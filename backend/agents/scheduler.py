"""
Scheduler Agent - Maintain clash-free calendar
Implements real-time conflict detection using Firestore database.
"""

import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple
from dataclasses import dataclass
from dateutil import parser

from database.firebase_connection import get_events_collection, EventDocument
from utils.api_helpers import AgentHelper
from utils.google_calendar import create_google_calendar_event
import os

logger = logging.getLogger(__name__)

@dataclass
class ConflictResult:
    """Result of conflict detection"""
    status: str  # "CLEAR" or "CLASH"
    conflicting_event: Optional[str] = None
    conflicting_events: Optional[List[Dict[str, Any]]] = None
    message: str = ""

@dataclass 
class TimeSlot:
    """Represents a time slot for scheduling"""
    start_time: datetime
    end_time: datetime
    venue: Optional[str] = None
    
    def __post_init__(self):
        """Validate time slot"""
        if self.start_time >= self.end_time:
            raise ValueError("Start time must be before end time")
        
        # Ensure timezone awareness
        if self.start_time.tzinfo is None:
            self.start_time = self.start_time.replace(tzinfo=timezone.utc)
        if self.end_time.tzinfo is None:
            self.end_time = self.end_time.replace(tzinfo=timezone.utc)

class SchedulerAgent:
    """
    AI Agent for scheduling and conflict detection.
    Handles real-time conflict detection against Firestore database.
    """
    
    def __init__(self):
        self.events_collection = None
        
    def _ensure_collection(self):
        """Ensure events collection is available"""
        if self.events_collection is None:
            try:
                self.events_collection = get_events_collection()
            except RuntimeError:
                # Firebase not initialized yet, will retry later
                pass
        
    def parse_datetime(self, datetime_str: str) -> datetime:
        """Parse datetime string with various formats"""
        try:
            # Try ISO format first
            if isinstance(datetime_str, str):
                dt = parser.isoparse(datetime_str)
            else:
                dt = datetime_str
                
            # Ensure timezone awareness
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
                
            return dt
        except Exception as e:
            logger.error(f"Failed to parse datetime '{datetime_str}': {e}")
            raise ValueError(f"Invalid datetime format: {datetime_str}")
    
    def check_time_overlap(self, slot1: TimeSlot, slot2: TimeSlot) -> bool:
        """
        Check if two time slots overlap.
        Two slots overlap if one starts before the other ends.
        """
        # For same venue conflicts, any overlap is a conflict
        if slot1.venue and slot2.venue and slot1.venue == slot2.venue:
            return not (slot1.end_time <= slot2.start_time or slot2.end_time <= slot1.start_time)
        
        # For different venues or unspecified venues, allow some buffer
        # This could be made configurable per organization
        return not (slot1.end_time <= slot2.start_time or slot2.end_time <= slot1.start_time)
    
    def get_overlapping_events(self, time_slot: TimeSlot) -> List[Dict[str, Any]]:
        """
        Query Firestore for events that overlap with the given time slot.
        """
        try:
            self._ensure_collection()
            if self.events_collection is None:
                # Firebase not available, return empty list for now
                logger.warning("Firebase not available, returning no conflicts")
                return []
                
            overlapping_events = []
            
            # Query events that might overlap
            # We need to check events where:
            # 1. Event starts before our slot ends AND
            # 2. Event ends after our slot starts
            
            events_ref = self.events_collection
            
            # Get all events (in production, you'd want to add date range filters)
            events = events_ref.where('status', '==', 'scheduled').stream()
            
            for event_doc in events:
                event_data = event_doc.to_dict()
                event_data['id'] = event_doc.id
                
                try:
                    event_start = event_data['start_time']
                    event_end = event_data['end_time']
                    
                    # Convert Firestore timestamps to datetime if needed
                    if hasattr(event_start, 'timestamp'):
                        event_start = datetime.fromtimestamp(event_start.timestamp(), tz=timezone.utc)
                    if hasattr(event_end, 'timestamp'):
                        event_end = datetime.fromtimestamp(event_end.timestamp(), tz=timezone.utc)
                    
                    # Create TimeSlot for comparison
                    event_slot = TimeSlot(
                        start_time=event_start,
                        end_time=event_end,
                        venue=event_data.get('venue')
                    )
                    
                    # Check for overlap
                    if self.check_time_overlap(time_slot, event_slot):
                        overlapping_events.append(event_data)
                        
                except Exception as e:
                    logger.warning(f"Error processing event {event_doc.id}: {e}")
                    continue
            
            return overlapping_events
            
        except Exception as e:
            logger.error(f"Error querying overlapping events: {e}")
            raise
    
    def check_conflict(
        self, 
        start_time: str, 
        end_time: str, 
        venue: str = None,
        exclude_event_id: str = None
    ) -> ConflictResult:
        """
        Check for scheduling conflicts in the given time slot.
        
        Args:
            start_time: ISO format datetime string
            end_time: ISO format datetime string  
            venue: Optional venue name
            exclude_event_id: Optional event ID to exclude from conflict check
            
        Returns:
            ConflictResult with conflict status and details
        """
        try:
            # Parse datetime strings
            parsed_start = self.parse_datetime(start_time)
            parsed_end = self.parse_datetime(end_time)
            
            # Create time slot
            time_slot = TimeSlot(
                start_time=parsed_start,
                end_time=parsed_end,
                venue=venue
            )
            
            # Get overlapping events
            overlapping_events = self.get_overlapping_events(time_slot)
            
            # Filter out excluded event if specified
            if exclude_event_id:
                overlapping_events = [
                    event for event in overlapping_events 
                    if event.get('id') != exclude_event_id
                ]
            
            # Log the conflict check
            AgentHelper.log_agent_action(
                agent_name="SchedulerAgent",
                action="conflict_check",
                details={
                    "time_slot": f"{start_time} - {end_time}",
                    "venue": venue,
                    "conflicts_found": len(overlapping_events)
                }
            )
            
            if overlapping_events:
                # Return conflict result
                primary_conflict = overlapping_events[0]
                return ConflictResult(
                    status="CLASH",
                    conflicting_event=primary_conflict.get('title', 'Unknown Event'),
                    conflicting_events=overlapping_events,
                    message=f"Time slot conflicts with {len(overlapping_events)} existing event(s)"
                )
            else:
                # No conflicts found
                return ConflictResult(
                    status="CLEAR",
                    message="Time slot is available"
                )
                
        except Exception as e:
            logger.error(f"Conflict check failed: {e}")
            return ConflictResult(
                status="ERROR",
                message=f"Failed to check conflicts: {str(e)}"
            )
    
    def suggest_alternative_times(
        self, 
        preferred_start: str,
        duration_hours: float,
        venue: str = None,
        max_suggestions: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Suggest alternative time slots if the preferred time has conflicts.
        
        Args:
            preferred_start: Preferred start time as ISO string
            duration_hours: Event duration in hours
            venue: Optional venue name
            max_suggestions: Maximum number of suggestions to return
            
        Returns:
            List of suggested time slots
        """
        try:
            from datetime import timedelta
            
            suggestions = []
            base_start = self.parse_datetime(preferred_start)
            duration = timedelta(hours=duration_hours)
            
            # Try different time offsets (1 hour increments)
            for offset_hours in [1, 2, -1, 3, -2, 4, -3, 6, -6, 12, -12, 24]:
                if len(suggestions) >= max_suggestions:
                    break
                    
                suggested_start = base_start + timedelta(hours=offset_hours)
                suggested_end = suggested_start + duration
                
                conflict_result = self.check_conflict(
                    start_time=suggested_start.isoformat(),
                    end_time=suggested_end.isoformat(),
                    venue=venue
                )
                
                if conflict_result.status == "CLEAR":
                    suggestions.append({
                        "start_time": suggested_start.isoformat(),
                        "end_time": suggested_end.isoformat(),
                        "confidence": 1.0,
                        "reasoning": f"Available slot {offset_hours}h from preferred time"
                    })
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Failed to suggest alternative times: {e}")
            return []
    
    def create_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new event in Firestore after conflict validation.
        
        Args:
            event_data: Event details including title, start_time, end_time, venue etc.
            
        Returns:
            Created event data with ID
        """
        try:
            self._ensure_collection()
            if self.events_collection is None:
                raise RuntimeError("Firebase not available. Please configure Firebase credentials.")
                
            # Validate required fields
            required_fields = ['title', 'start_time', 'end_time', 'venue']
            for field in required_fields:
                if not event_data.get(field):
                    raise ValueError(f"Missing required field: {field}")
            
            # Check for conflicts first
            conflict_result = self.check_conflict(
                start_time=event_data['start_time'],
                end_time=event_data['end_time'],
                venue=event_data.get('venue')
            )
            
            if conflict_result.status == "CLASH":
                raise ValueError(f"Cannot create event: {conflict_result.message}")
            
            # Parse datetime fields
            start_time = self.parse_datetime(event_data['start_time'])
            end_time = self.parse_datetime(event_data['end_time'])
            
            # Create event document
            event_doc = EventDocument.create_event_doc(
                title=event_data['title'],
                start_time=start_time,
                end_time=end_time,
                venue=event_data['venue'],
                organizer=event_data.get('organizer'),
                description=event_data.get('description'),
                category=event_data.get('category'),
                capacity=event_data.get('capacity'),
                budget=event_data.get('budget')
            )
            
            # Add to Firestore
            doc_ref = self.events_collection.add(event_doc)
            event_doc['id'] = doc_ref[1].id

            # Optionally publish to Google Calendar if a token is provided
            google_token = os.getenv("GOOGLE_CALENDAR_TOKEN")
            if google_token:
                try:
                    cal_event = create_google_calendar_event(
                        {
                            "title": event_doc['title'],
                            "description": event_doc.get('description', ''),
                            "venue": event_doc.get('venue'),
                            "start_time": event_doc['start_time'].isoformat(),
                            "end_time": event_doc['end_time'].isoformat()
                        },
                        google_token
                    )
                    if cal_event and cal_event.get('htmlLink'):
                        event_doc['google_calendar_link'] = cal_event['htmlLink']
                except Exception as e:
                    logger.warning(f"Failed to publish event to Google Calendar: {e}")
            
            AgentHelper.log_agent_action(
                agent_name="SchedulerAgent",
                action="event_created",
                event_id=event_doc['id'],
                details={"title": event_data['title'], "venue": event_data['venue']}
            )
            
            return event_doc
            
        except Exception as e:
            logger.error(f"Failed to create event: {e}")
            raise

# Global scheduler agent instance
scheduler_agent = SchedulerAgent()
