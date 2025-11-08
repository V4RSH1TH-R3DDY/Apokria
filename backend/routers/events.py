"""
Events router for the Apokria event management system.
Provides CRUD operations for events and integration with agents.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
import uuid
from datetime import datetime

from models.events import Event, CreateEventRequest, UpdateEventRequest, ScheduleItem, Package, Asset, OutreachBundle
from utils.api_helpers import APIResponse
from agents.scheduler import scheduler_agent
from agents.flow import flow_agent, FlowRequest  
from agents.sponsor import SponsorAgent
from agents.content import content_agent

router = APIRouter(prefix="/api", tags=["events"])

# In-memory storage for demo (replace with database in production)
events_store: Dict[str, Event] = {}

# Initialize agents
sponsor_agent = SponsorAgent()


@router.get("/events", response_model=List[Event])
async def list_events():
    """Get all events"""
    return list(events_store.values())


@router.post("/events", response_model=Event)
async def create_event(event_data: CreateEventRequest):
    """Create a new event"""
    try:
        event_id = str(uuid.uuid4())
        
        # Create new event
        new_event = Event(
            id=event_id,
            name=event_data.name,
            startDate=event_data.startDate,
            endDate=event_data.endDate,
            venue=event_data.venue,
            capacity=event_data.capacity,
            schedules=[],
            packages=[],
            assets=[],
            outreach=None
        )
        
        # Store the event
        events_store[event_id] = new_event
        
        return new_event
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create event: {str(e)}")


@router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str):
    """Get a specific event by ID"""
    if event_id not in events_store:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return events_store[event_id]


@router.put("/events/{event_id}", response_model=Event)
async def update_event(event_id: str, event_data: UpdateEventRequest):
    """Update an existing event"""
    if event_id not in events_store:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = events_store[event_id]
    
    # Update fields if provided
    if event_data.name is not None:
        event.name = event_data.name
    if event_data.startDate is not None:
        event.startDate = event_data.startDate
    if event_data.endDate is not None:
        event.endDate = event_data.endDate
    if event_data.venue is not None:
        event.venue = event_data.venue
    if event_data.capacity is not None:
        event.capacity = event_data.capacity
    
    events_store[event_id] = event
    return event


@router.delete("/events/{event_id}")
async def delete_event(event_id: str):
    """Delete an event"""
    if event_id not in events_store:
        raise HTTPException(status_code=404, detail="Event not found")
    
    del events_store[event_id]
    return {"message": "Event deleted successfully"}


@router.post("/events/{event_id}/schedule/generate")
async def generate_schedule(event_id: str):
    """Generate schedule for an event using the Flow Agent"""
    if event_id not in events_store:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = events_store[event_id]
    
    try:
        # Use the Flow Agent to generate event flow
        flow_request = FlowRequest(
            event_name=event.name,
            event_type="conference",  # Default type
            duration=1,  # Default duration
            audience_size=event.capacity or 100,
            budget_range="Medium"
        )
        
        flow_response = await flow_agent.generate_flow(flow_request)
        
        # Convert flow to schedule items
        schedules = []
        for i, stage in enumerate(flow_response.flow.stages[:5]):  # Limit to 5 stages
            schedule_item = ScheduleItem(
                id=str(uuid.uuid4()),
                day=1,
                startTime=f"{9 + i}:00",
                endTime=f"{10 + i}:00",
                session=stage.name,
                room=f"Room {i + 1}"
            )
            schedules.append(schedule_item)
        
        # Update event with generated schedule
        event.schedules = schedules
        events_store[event_id] = event
        
        return {"message": "Schedule generated successfully", "schedules": schedules}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate schedule: {str(e)}")


@router.post("/events/{event_id}/sponsor/tiers")
async def generate_sponsor_tiers(event_id: str):
    """Generate sponsorship tiers for an event"""
    if event_id not in events_store:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = events_store[event_id]
    
    try:
        # Generate sponsor tiers using the Sponsor Agent
        packages = [
            Package(
                id=str(uuid.uuid4()),
                tier="Platinum",
                benefits=[
                    "Logo on main stage backdrop",
                    "Opening ceremony mention", 
                    "Premium booth space",
                    "Social media promotion"
                ],
                price=5000
            ),
            Package(
                id=str(uuid.uuid4()),
                tier="Gold",
                benefits=[
                    "Logo on event materials",
                    "Standard booth space",
                    "Social media mention"
                ],
                price=3000
            ),
            Package(
                id=str(uuid.uuid4()),
                tier="Silver",
                benefits=[
                    "Logo on website",
                    "Small booth space"
                ],
                price=1500
            )
        ]
        
        # Update event with generated packages
        event.packages = packages
        events_store[event_id] = event
        
        return {"message": "Sponsor tiers generated successfully", "packages": packages}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate sponsor tiers: {str(e)}")


@router.post("/events/{event_id}/sponsor/pdf")
async def generate_sponsor_pdf(event_id: str):
    """Generate sponsor prospectus PDF"""
    if event_id not in events_store:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = events_store[event_id]
    
    try:
        # Generate a mock PDF asset
        pdf_asset = Asset(
            id=str(uuid.uuid4()),
            type="pdf",
            url=f"/assets/{event_id}/sponsor-prospectus.pdf",
            version=1,
            locale="en"
        )
        
        # Add asset to event
        event.assets.append(pdf_asset)
        events_store[event_id] = event
        
        return {"message": "Sponsor PDF generated successfully", "asset": pdf_asset}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate sponsor PDF: {str(e)}")


@router.post("/events/{event_id}/outreach/generate")
async def generate_outreach(event_id: str):
    """Generate outreach content for an event"""
    if event_id not in events_store:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event = events_store[event_id]
    
    try:
        # Generate outreach content using the Content Agent
        outreach = OutreachBundle(
            emailSponsor=f"""
Subject: Partnership Opportunity - {event.name}

Dear [Sponsor Name],

We are excited to invite you to partner with us for {event.name}, taking place at {event.venue or 'our campus'}.

This event presents an excellent opportunity to connect with {event.capacity or 'hundreds of'} students and showcase your brand.

Best regards,
Event Team
            """.strip(),
            
            emailParticipants=f"""
Subject: You're Invited to {event.name}!

Hello!

We're thrilled to invite you to {event.name}, an exciting event happening at {event.venue or 'our campus'}.

Join us for an amazing experience with networking, learning, and fun activities.

Register now!
Event Team
            """.strip(),
            
            whatsapp=f"🎉 Excited to announce {event.name}! Join us at {event.venue or 'campus'} for an incredible event. Don't miss out!"
        )
        
        # Update event with outreach content
        event.outreach = outreach
        events_store[event_id] = event
        
        return {"message": "Outreach content generated successfully", "outreach": outreach}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate outreach content: {str(e)}")