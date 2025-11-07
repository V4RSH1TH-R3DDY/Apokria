"""
API helper utilities for Apokria backend.
Common functions for response handling, validation, and utilities.
"""

from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from typing import Dict, Any, Optional, List
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class APIResponse:
    """Standard API response formatter"""
    
    @staticmethod
    def success(data: Any = None, message: str = "Success") -> Dict[str, Any]:
        """Standard success response format"""
        response = {
            "status": "success",
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        }
        if data is not None:
            response["data"] = data
        return response
    
    @staticmethod
    def error(message: str, error_code: str = None, status_code: int = 400) -> HTTPException:
        """Standard error response format"""
        error_detail = {
            "status": "error",
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        }
        if error_code:
            error_detail["error_code"] = error_code
            
        raise HTTPException(status_code=status_code, detail=error_detail)
    
    @staticmethod
    def validation_error(errors: List[str]) -> HTTPException:
        """Validation error response"""
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "status": "error",
                "message": "Validation failed",
                "errors": errors,
                "timestamp": datetime.utcnow().isoformat()
            }
        )

class DateTimeHelper:
    """DateTime utilities for events and scheduling"""
    
    @staticmethod
    def is_valid_datetime(date_string: str) -> bool:
        """Validate datetime string format"""
        try:
            datetime.fromisoformat(date_string.replace('Z', '+00:00'))
            return True
        except ValueError:
            return False
    
    @staticmethod
    def parse_datetime(date_string: str) -> datetime:
        """Parse datetime string to datetime object"""
        try:
            return datetime.fromisoformat(date_string.replace('Z', '+00:00'))
        except ValueError:
            raise ValueError(f"Invalid datetime format: {date_string}")
    
    @staticmethod
    def format_datetime(dt: datetime) -> str:
        """Format datetime to ISO string"""
        return dt.isoformat()

class EventValidator:
    """Event-specific validation helpers"""
    
    @staticmethod
    def validate_event_data(event_data: Dict[str, Any]) -> List[str]:
        """Validate event creation/update data"""
        errors = []
        
        # Required fields
        required_fields = ['title', 'start_time', 'end_time', 'venue']
        for field in required_fields:
            if not event_data.get(field):
                errors.append(f"Field '{field}' is required")
        
        # Validate datetime fields
        for field in ['start_time', 'end_time']:
            if event_data.get(field) and not DateTimeHelper.is_valid_datetime(event_data[field]):
                errors.append(f"Field '{field}' must be a valid datetime")
        
        # Validate start_time < end_time
        if (event_data.get('start_time') and event_data.get('end_time') and
            DateTimeHelper.is_valid_datetime(event_data['start_time']) and
            DateTimeHelper.is_valid_datetime(event_data['end_time'])):
            
            start = DateTimeHelper.parse_datetime(event_data['start_time'])
            end = DateTimeHelper.parse_datetime(event_data['end_time'])
            
            if start >= end:
                errors.append("Start time must be before end time")
        
        return errors

class AgentHelper:
    """Helper functions for AI agents"""
    
    @staticmethod
    def prepare_agent_context(event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare context for AI agents"""
        return {
            "event": event_data,
            "timestamp": datetime.utcnow().isoformat(),
            "campus_info": {
                "timezone": "UTC",  # Should be configurable
                "academic_year": "2025-26",
                "semester": "Fall"
            }
        }
    
    @staticmethod
    def log_agent_action(agent_name: str, action: str, event_id: str = None, details: Dict = None):
        """Log agent actions for tracking"""
        log_data = {
            "agent": agent_name,
            "action": action,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        if event_id:
            log_data["event_id"] = event_id
        if details:
            log_data["details"] = details
            
        logger.info(f"Agent Action: {log_data}")

def create_response(success: bool = True, data: Any = None, message: str = None) -> JSONResponse:
    """Create standardized JSON response"""
    if success:
        return JSONResponse(
            content=APIResponse.success(data=data, message=message or "Operation successful"),
            status_code=200
        )
    else:
        return JSONResponse(
            content={
                "status": "error",
                "message": message or "Operation failed",
                "timestamp": datetime.utcnow().isoformat()
            },
            status_code=400
        )

def handle_agent_error(agent_name: str, error: Exception) -> HTTPException:
    """Handle and format agent-specific errors"""
    error_message = f"{agent_name} agent error: {str(error)}"
    logger.error(error_message, exc_info=True)
    
    return APIResponse.error(
        message=f"Failed to process request with {agent_name} agent",
        error_code=f"{agent_name.upper()}_ERROR",
        status_code=500
    )