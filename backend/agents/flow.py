"""
Flow Agent - Generate intelligent event itineraries using Google Gemini AI
Creates detailed, minute-by-minute event flows with professional event director expertise.
"""

import os
import logging
from typing import Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta

from agents.prompts.flow_prompts import build_context_prompt, EVENT_TYPE_TEMPLATES
from utils.api_helpers import AgentHelper
from utils.llm import generate_text

logger = logging.getLogger(__name__)

@dataclass
class FlowRequest:
    """Request model for flow generation"""
    event_name: str
    event_type: str
    duration: float  # in hours
    audience_size: Optional[int] = 100
    budget_range: Optional[str] = "Medium"
    venue_type: Optional[str] = "Indoor campus facility"
    special_requirements: Optional[str] = "None"
    additional_context: Optional[str] = None

@dataclass
class FlowResponse:
    """Response model for generated flow"""
    event_name: str
    event_type: str
    duration: float
    generated_flow: str  # Markdown formatted itinerary
    metadata: Dict[str, Any]
    created_at: str

class FlowAgent:
    """
    AI Agent for generating intelligent event itineraries using Google Gemini.
    Creates professional, detailed event flows with minute-by-minute planning.
    """
    
    def __init__(self):
        # No direct provider initialization here; use `utils.llm` wrapper at call time
        pass
    
    def _validate_request(self, request: FlowRequest) -> None:
        """Validate flow generation request"""
        if not request.event_name or len(request.event_name.strip()) == 0:
            raise ValueError("Event name is required")
        
        if not request.event_type or len(request.event_type.strip()) == 0:
            raise ValueError("Event type is required")
        
        if request.duration <= 0:
            raise ValueError("Duration must be positive")
        
        if request.duration > 72:  # 3 days max
            raise ValueError("Duration cannot exceed 72 hours")
        
        if request.audience_size and request.audience_size <= 0:
            raise ValueError("Audience size must be positive")
    
    def _get_fallback_flow(self, request: FlowRequest) -> str:
        """Generate a basic fallback flow when Gemini is not available"""
        duration_hours = int(request.duration)
        duration_minutes = int((request.duration - duration_hours) * 60)
        
        return f"""# {request.event_name} - Event Flow

## 📋 Event Overview
- **Event Type**: {request.event_type}
- **Duration**: {duration_hours}h {duration_minutes}m
- **Expected Audience**: {request.audience_size} people
- **Venue**: {request.venue_type}

## ⏰ Detailed Timeline

### Pre-Event Setup
**[T-120] Setup Begins**
- Duration: 120 minutes  
- Responsible: Event crew
- Details: Venue preparation, equipment setup, signage placement
- Materials needed: AV equipment, tables, chairs, signage
- Contingency: Allow extra 30 minutes for technical issues

### Event Execution
**[00:00] Event Opening**
- Duration: 15 minutes
- Responsible: Event host
- Details: Welcome remarks and agenda overview
- Materials needed: Microphone, presentation slides
- Contingency: Pre-recorded welcome message ready

**[00:15] Main Activities**
- Duration: {int(request.duration * 60 - 30)} minutes
- Responsible: Activity coordinators
- Details: Core event programming based on {request.event_type}
- Materials needed: Activity-specific equipment
- Contingency: Backup activities prepared

**[{duration_hours:02d}:{duration_minutes-15:02d}] Event Wrap-up**
- Duration: 15 minutes
- Responsible: Event host
- Details: Closing remarks, thank you, next steps
- Materials needed: Microphone, feedback forms
- Contingency: Digital feedback collection backup

### Post-Event
**[+60] Breakdown Complete**
- Duration: 60 minutes
- Responsible: Event crew  
- Details: Equipment removal, venue restoration
- Materials needed: Storage containers, cleaning supplies
- Contingency: Extended breakdown time if needed

## 🎯 Critical Success Factors
1. Smooth technical setup and operation
2. Effective time management throughout event
3. Positive attendee engagement and feedback

## 📦 Resource Requirements
- **Equipment**: Standard AV setup, tables, chairs
- **Staffing**: 1 coordinator per 25 attendees
- **Vendors**: Catering (if applicable), security

## 🚨 Contingency Plans
- **Technical Issues**: Backup equipment and tech support on-site
- **Low Attendance**: Adjust room setup and activities accordingly
- **Weather**: Indoor venue backup for outdoor elements

*Note: This is a basic template. For detailed, AI-generated flows, please configure Google Gemini API.*
"""
    
    def generate_flow(self, request: FlowRequest) -> FlowResponse:
        """
        Generate an intelligent event flow using Google Gemini AI.
        
        Args:
            request: FlowRequest with event details
            
        Returns:
            FlowResponse with generated itinerary
        """
        try:
            # Validate request
            self._validate_request(request)
            
            # Log the generation request
            AgentHelper.log_agent_action(
                agent_name="FlowAgent",
                action="flow_generation_started",
                details={
                    "event_name": request.event_name,
                    "event_type": request.event_type,
                    "duration": request.duration,
                    "audience_size": request.audience_size
                }
            )
            
            # Use LLM wrapper (Gemini or OpenAI) if available
            try:
                prompt = build_context_prompt(
                    event_name=request.event_name,
                    event_type=request.event_type,
                    duration=request.duration,
                    audience_size=request.audience_size or 100,
                    budget_range=request.budget_range or "Medium",
                    venue_type=request.venue_type or "Indoor campus facility",
                    special_requirements=request.special_requirements or "None"
                )

                if request.additional_context:
                    prompt += f"\n\n**ADDITIONAL CONTEXT:**\n{request.additional_context}"

                logger.info(f"Generating flow for {request.event_name} using configured LLM")
                generated_flow = generate_text(prompt, max_tokens=1200)

                if not generated_flow:
                    raise ValueError("LLM returned empty response")

            except Exception as e:
                logger.warning(f"LLM generation failed or not configured: {e}. Using fallback flow.")
                generated_flow = self._get_fallback_flow(request)
                
                return FlowResponse(
                    event_name=request.event_name,
                    event_type=request.event_type,
                    duration=request.duration,
                    generated_flow=generated_flow,
                    metadata={
                        "generator": "fallback_template",
                        "ai_model": None,
                        "prompt_tokens": 0,
                        "response_tokens": len(generated_flow.split())
                    },
                    created_at=datetime.utcnow().isoformat()
                )
            
            # We already generated `generated_flow` above using the configured LLM.
            # Build prompt again for metadata tracking (if needed)
            prompt = build_context_prompt(
                event_name=request.event_name,
                event_type=request.event_type,
                duration=request.duration,
                audience_size=request.audience_size or 100,
                budget_range=request.budget_range or "Medium",
                venue_type=request.venue_type or "Indoor campus facility",
                special_requirements=request.special_requirements or "None"
            )

            if request.additional_context:
                prompt += f"\n\n**ADDITIONAL CONTEXT:**\n{request.additional_context}"

            flow_response = FlowResponse(
                event_name=request.event_name,
                event_type=request.event_type,
                duration=request.duration,
                generated_flow=generated_flow,
                metadata={
                    "generator": "llm",
                    "prompt_length": len(prompt) if 'prompt' in locals() else 0,
                    "response_length": len(generated_flow),
                    "event_type_template": request.event_type in EVENT_TYPE_TEMPLATES
                },
                created_at=datetime.utcnow().isoformat()
            )
            
            # Log successful generation
            AgentHelper.log_agent_action(
                agent_name="FlowAgent",
                action="flow_generation_completed",
                details={
                    "event_name": request.event_name,
                    "flow_length": len(generated_flow),
                    "model_used": "gemini-pro"
                }
            )
            
            return flow_response
            
        except Exception as e:
            logger.error(f"Flow generation failed: {e}")
            
            # Log failure
            AgentHelper.log_agent_action(
                agent_name="FlowAgent",
                action="flow_generation_failed",
                details={
                    "event_name": request.event_name,
                    "error": str(e)
                }
            )
            raise
    
    def get_supported_event_types(self) -> Dict[str, str]:
        """Get list of supported event types with descriptions"""
        return {
            event_type: info["focus"] 
            for event_type, info in EVENT_TYPE_TEMPLATES.items()
        }
    
    def estimate_setup_time(self, duration: float, audience_size: int) -> Dict[str, int]:
        """Estimate setup and breakdown times based on event parameters"""
        
        # Base setup time in minutes
        base_setup = 60
        
        # Adjustments based on duration
        if duration > 6:
            setup_multiplier = 1.5
        elif duration > 3:
            setup_multiplier = 1.2
        else:
            setup_multiplier = 1.0
        
        # Adjustments based on audience size
        if audience_size > 200:
            size_multiplier = 1.4
        elif audience_size > 50:
            size_multiplier = 1.2
        else:
            size_multiplier = 1.0
        
        setup_time = int(base_setup * setup_multiplier * size_multiplier)
        breakdown_time = int(setup_time * 0.7)  # Breakdown typically faster
        
        return {
            "setup_minutes": setup_time,
            "breakdown_minutes": breakdown_time,
            "total_event_time": int(duration * 60 + setup_time + breakdown_time)
        }
    
    def health_check(self) -> Dict[str, Any]:
        """Check FlowAgent health and capabilities"""
        return {
            "llm_configured": bool(os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")),
            "supported_event_types": len(EVENT_TYPE_TEMPLATES),
            "fallback_available": True,
            "max_duration_hours": 72,
            "api_configured": bool(os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY"))
        }

# Global flow agent instance
flow_agent = FlowAgent()
