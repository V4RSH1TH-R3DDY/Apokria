from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from utils.api_helpers import APIResponse, EventValidator
from agents.scheduler import scheduler_agent
from agents.flow import flow_agent, FlowRequest
from agents.sponsor import SponsorAgent
from agents.content import content_agent
from database.firebase_connection import init_firebase, close_firebase
from database.mongo_connection import init_database, close_database
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize agents
sponsor_agent = SponsorAgent()

# FastAPI application entry point
app = FastAPI(title="Apokria API", description="Multi-agent AI event orchestrator for colleges", version="1.0.0")

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    """Initialize database connections on startup"""
    try:
        await init_firebase()
        # Initialize MongoDB (if configured)
        try:
            await init_database()
        except Exception as e:
            print(f"MongoDB init failed or not configured: {e}")
    except Exception as e:
        # Firebase not configured, continue without it
        print(f"Firebase not available: {e}")
        print("API will work in limited mode without Firebase")

@app.on_event("shutdown") 
async def shutdown_event():
    """Close database connections on shutdown"""
    try:
        await close_firebase()
    except Exception:
        pass
    try:
        await close_database()
    except Exception as e:
        print(f"Error closing MongoDB connection: {e}")

# Pydantic models for request/response
class ConflictCheckRequest(BaseModel):
    start_time: str
    end_time: str
    venue: Optional[str] = None
    exclude_event_id: Optional[str] = None

class EventCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: str
    end_time: str
    venue: str
    organizer: Optional[str] = None
    category: Optional[str] = None
    capacity: Optional[int] = None
    budget: Optional[float] = None

# FlowAgent request model
class FlowGenerationRequest(BaseModel):
    event_name: str
    event_type: str
    duration: float  # in hours
    audience_size: Optional[int] = 100
    budget_range: Optional[str] = "Medium"  
    venue_type: Optional[str] = "Indoor campus facility"
    special_requirements: Optional[str] = "None"
    additional_context: Optional[str] = None

# SponsorAgent request model
class SponsorRecommendationRequest(BaseModel):
    event_type: str
    event_name: Optional[str] = None
    budget_range: Optional[str] = "Medium"  # Low, Medium, High
    audience_size: Optional[int] = 100
    target_demographics: Optional[str] = None
    additional_context: Optional[str] = None

@app.get("/")
async def root():
    return APIResponse.success(
        message="Welcome to Apokria - Where Every Campus Event Finds Its Perfect Flow"
    )

@app.get("/health")
async def health_check():
    return APIResponse.success(
        data={"status": "healthy", "version": "1.0.0"},
        message="Apokria API is running"
    )

# Phase 1 API Endpoints as per specification

@app.post("/api/schedule")
async def create_schedule():
    """Scheduler Agent - Create or check event schedule"""
    return APIResponse.success(
        message="Schedule agent endpoint - ready for implementation"
    )

# SUB-PHASE 2.1: CONFLICT DETECTION ENDPOINT
@app.post("/check_conflict")
async def check_conflict(request: ConflictCheckRequest):
    """
    Check for scheduling conflicts in the given time slot.
    
    Returns:
        - {"status": "CLEAR"} if no conflicts
        - {"status": "CLASH", "conflicting_event": "Event Name"} if conflicts found
    """
    try:
        # Use the scheduler agent to check conflicts
        conflict_result = scheduler_agent.check_conflict(
            start_time=request.start_time,
            end_time=request.end_time,
            venue=request.venue,
            exclude_event_id=request.exclude_event_id
        )
        
        if conflict_result.status == "ERROR":
            raise HTTPException(status_code=400, detail=conflict_result.message)
        
        response_data = {"status": conflict_result.status}
        
        if conflict_result.status == "CLASH":
            response_data["conflicting_event"] = conflict_result.conflicting_event
            if conflict_result.conflicting_events:
                response_data["conflicting_events"] = conflict_result.conflicting_events
        
        response_data["message"] = conflict_result.message
        
        return APIResponse.success(
            data=response_data,
            message=f"Conflict check completed: {conflict_result.status}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conflict check failed: {str(e)}")

@app.get("/check_conflict")
async def check_conflict_get(
    start_time: str = Query(..., description="Event start time (ISO format)"),
    end_time: str = Query(..., description="Event end time (ISO format)"), 
    venue: Optional[str] = Query(None, description="Event venue"),
    exclude_event_id: Optional[str] = Query(None, description="Event ID to exclude from check")
):
    """
    GET version of conflict check for easy testing via browser/curl.
    """
    request = ConflictCheckRequest(
        start_time=start_time,
        end_time=end_time,
        venue=venue,
        exclude_event_id=exclude_event_id
    )
    return await check_conflict(request)

# Additional scheduler endpoints
@app.post("/api/events")
async def create_event(request: EventCreateRequest):
    """Create a new event with conflict validation"""
    try:
        # Validate event data
        event_data = request.dict()
        validation_errors = EventValidator.validate_event_data(event_data)
        
        if validation_errors:
            raise HTTPException(status_code=422, detail={
                "message": "Validation failed",
                "errors": validation_errors
            })
        
        # Create event using scheduler agent
        created_event = scheduler_agent.create_event(event_data)
        
        return APIResponse.success(
            data=created_event,
            message="Event created successfully"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create event: {str(e)}")

@app.post("/api/schedule/suggest")
async def suggest_alternative_times(
    preferred_start: str = Query(..., description="Preferred start time (ISO format)"),
    duration_hours: float = Query(..., description="Event duration in hours"),
    venue: Optional[str] = Query(None, description="Event venue"),
    max_suggestions: int = Query(3, description="Maximum suggestions to return")
):
    """Suggest alternative time slots if preferred time has conflicts"""
    try:
        suggestions = scheduler_agent.suggest_alternative_times(
            preferred_start=preferred_start,
            duration_hours=duration_hours,
            venue=venue,
            max_suggestions=max_suggestions
        )
        
        return APIResponse.success(
            data={"suggestions": suggestions},
            message=f"Found {len(suggestions)} alternative time slots"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to suggest times: {str(e)}")

@app.post("/api/flow")
async def generate_flow(request: FlowGenerationRequest):
    """Flow Agent - Generate intelligent event flow using Google Gemini AI"""
    try:
        # Convert Pydantic model to dataclass
        flow_request = FlowRequest(
            event_name=request.event_name,
            event_type=request.event_type,
            duration=request.duration,
            audience_size=request.audience_size,
            budget_range=request.budget_range,
            venue_type=request.venue_type,
            special_requirements=request.special_requirements,
            additional_context=request.additional_context
        )
        
        # Generate flow using FlowAgent
        flow_response = flow_agent.generate_flow(flow_request)
        
        return APIResponse.success(
            data={
                "event_name": flow_response.event_name,
                "event_type": flow_response.event_type,
                "duration": flow_response.duration,
                "generated_flow": flow_response.generated_flow,
                "metadata": flow_response.metadata,
                "created_at": flow_response.created_at
            },
            message="Event flow generated successfully"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Flow generation failed: {str(e)}")

@app.get("/generate_flow")
async def generate_flow_get(
    event_name: str = Query(..., description="Name of the event"),
    event_type: str = Query(..., description="Type of event (e.g., academic_conference, cultural_festival)"),
    duration: float = Query(..., description="Event duration in hours"),
    audience_size: int = Query(100, description="Expected number of attendees"),
    budget_range: str = Query("Medium", description="Budget range (Low/Medium/High)"),
    venue_type: str = Query("Indoor campus facility", description="Type of venue"),
    special_requirements: str = Query("None", description="Special requirements or constraints")
):
    """GET version of flow generation for easy browser testing"""
    request = FlowGenerationRequest(
        event_name=event_name,
        event_type=event_type,
        duration=duration,
        audience_size=audience_size,
        budget_range=budget_range,
        venue_type=venue_type,
        special_requirements=special_requirements
    )
    return await generate_flow(request)

@app.get("/api/flow/types")
async def get_event_types():
    """Get supported event types with descriptions"""
    try:
        event_types = flow_agent.get_supported_event_types()
        return APIResponse.success(
            data={"event_types": event_types},
            message="Event types retrieved successfully"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get event types: {str(e)}")

@app.get("/api/flow/health")
async def flow_agent_health():
    """Check FlowAgent health and capabilities"""
    try:
        health_status = flow_agent.health_check()
        return APIResponse.success(
            data=health_status,
            message="FlowAgent health check completed"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@app.post("/api/sponsors")
async def recommend_sponsors(request: SponsorRecommendationRequest):
    """
    Sponsor Agent - Get sponsor recommendations and outreach email
    
    Returns:
        - recommendations: List of recommended sponsors with scores
        - outreach_email: Generated personalized outreach email
    """
    try:
        # Get sponsor recommendations from SponsorAgent
        recommendations = sponsor_agent.get_sponsor_recommendations(
            event_type=request.event_type,
            event_name=request.event_name,
            budget=request.budget_range,
            location=None,
            max_recommendations=5
        )

        # Build a simple event_details dict for email generation
        event_details = {
            "event_name": request.event_name or f"{request.event_type.replace('_', ' ').title()} Event",
            "event_type": request.event_type,
            "expected_attendance": request.audience_size,
            "objectives": request.additional_context or ""
        }

        # Generate outreach email using LLM
        outreach_email = sponsor_agent.generate_outreach_email(
            sponsor=recommendations[0]['sponsor'] if recommendations else {},
            event_details=event_details
        )
        
        return APIResponse.success(
            data={
                "recommendations": recommendations,
                "outreach_email": outreach_email,
                "event_type": request.event_type,
                "budget_range": request.budget_range
            },
            message=f"Found {len(recommendations)} sponsor recommendations"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sponsor recommendation failed: {str(e)}")

@app.get("/get_sponsors")
async def get_sponsors(
    event_type: str = Query(..., description="Type of event (e.g., academic_conference, cultural_festival)"),
    event_name: Optional[str] = Query(None, description="Name of the event"),
    budget_range: str = Query("Medium", description="Budget range (Low/Medium/High)"),
    audience_size: int = Query(100, description="Expected number of attendees"),
    target_demographics: Optional[str] = Query(None, description="Target audience demographics")
):
    """GET version of sponsor recommendations for easy browser testing"""
    request = SponsorRecommendationRequest(
        event_type=event_type,
        event_name=event_name,
        budget_range=budget_range,
        audience_size=audience_size,
        target_demographics=target_demographics
    )
    return await recommend_sponsors(request)

@app.get("/api/sponsors/health")
async def sponsor_agent_health():
    """Check SponsorAgent health and capabilities"""
    try:
        health_status = sponsor_agent.health_check()
        return APIResponse.success(
            data=health_status,
            message="SponsorAgent health check completed"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sponsor health check failed: {str(e)}")

@app.post("/api/content")
async def generate_content(request: dict):
    """Generic content endpoint that routes to specific content generation.

    Expected request shape:
    {
        "type": "email" | "social" | "banner",
        "event": {...},
        // optional params per type
    }
    """
    try:
        body = request
        ctype = body.get("type")
        event = body.get("event") or {}

        if ctype == "email":
            tone = body.get("tone", "professional")
            length = body.get("length", "short")
            result = content_agent.generate_email(event, tone=tone, length=length)
            return APIResponse.success(data={"content": result}, message="Email generated")

        if ctype == "social":
            platform = body.get("platform", "twitter")
            length = body.get("length", 280)
            result = content_agent.generate_social_post(event, platform=platform, length=length)
            return APIResponse.success(data={"content": result}, message="Social post generated")

        if ctype == "banner":
            size = body.get("size", "hero")
            result = content_agent.generate_banner_text(event, size=size)
            return APIResponse.success(data={"content": result}, message="Banner text generated")

        return APIResponse.error("Invalid content type", status_code=400)
    except Exception as e:
        return APIResponse.error(f"Content generation failed: {e}", status_code=500)

@app.get("/api/analytics")
async def get_analytics():
    """Analytics Agent - Get stats and dashboards"""
    return APIResponse.success(
        message="Analytics agent endpoint - ready for implementation"
    )

# Additional event management endpoints
@app.get("/api/events")
async def get_events():
    """Get all events"""
    return APIResponse.success(
        data={"events": []},
        message="Event listing endpoint - ready for agent integration"
    )
