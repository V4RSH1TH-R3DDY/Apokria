"""
Sponsor Agent - Match events with sponsors and generate outreach content.
Uses intelligent filtering and LLM-powered email generation.
"""

import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from pathlib import Path
import os

from utils.api_helpers import AgentHelper
from utils.llm import generate_text

logger = logging.getLogger(__name__)

class SponsorAgent:
    """
    AI Agent for sponsor recommendation and outreach generation.
    Matches events with relevant sponsors and creates personalized outreach emails.
    """
    
    def __init__(self):
        self.sponsors_data = self._load_sponsors_data()
        # Use shared LLM wrapper at call time; no direct Gemini init here

    def _load_sponsors_data(self) -> Dict[str, Any]:
        """Load sponsors data from JSON file"""
        try:
            sponsors_file = Path(__file__).parent.parent / "data" / "sponsors.json"
            with open(sponsors_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load sponsors data: {e}")
            return {"sponsors": [], "event_type_mappings": {}}
    
    # Removed direct Gemini initialization - use utils.llm.generate_text when generating emails
    
    def _calculate_match_score(self, sponsor: Dict[str, Any], event_type: str, budget: float = None) -> float:
        """
        Calculate match score between sponsor and event.
        
        Args:
            sponsor: Sponsor data dictionary
            event_type: Type of event
            budget: Optional event budget
            
        Returns:
            Match score between 0.0 and 1.0
        """
        score = 0.0
        
        # Event type preference (40% weight)
        if event_type in sponsor.get("preferred_event_types", []):
            score += 0.4
        
        # Category mapping (30% weight)
        event_mappings = self.sponsors_data.get("event_type_mappings", {})
        relevant_categories = event_mappings.get(event_type, [])
        if sponsor.get("category") in relevant_categories:
            score += 0.3
        
        # Budget compatibility (20% weight)
        if budget and sponsor.get("budget_range"):
            sponsor_min = sponsor["budget_range"].get("min", 0)
            sponsor_max = sponsor["budget_range"].get("max", float('inf'))
            
            if sponsor_min <= budget <= sponsor_max:
                score += 0.2
            elif budget < sponsor_min:
                # Partial score if budget is close but below minimum
                ratio = budget / sponsor_min if sponsor_min > 0 else 0
                score += 0.2 * min(ratio, 1.0)
        else:
            # Default score if budget not specified
            score += 0.1
        
        # Past partnership bonus (10% weight)
        if sponsor.get("past_partnerships", False):
            score += 0.1
        
        return min(score, 1.0)
    
    def get_sponsor_recommendations(
        self, 
        event_type: str, 
        event_name: str = None,
        budget: float = None,
        location: str = None,
        max_recommendations: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Get filtered and scored sponsor recommendations.
        
        Args:
            event_type: Type of event (tech, cultural, sports, etc.)
            event_name: Optional event name for context
            budget: Optional event budget
            location: Optional event location
            max_recommendations: Maximum number of sponsors to return
            
        Returns:
            List of recommended sponsors with match scores
        """
        try:
            sponsors = self.sponsors_data.get("sponsors", [])
            recommendations = []
            
            for sponsor in sponsors:
                match_score = self._calculate_match_score(sponsor, event_type, budget)
                
                if match_score > 0.2:  # Minimum threshold
                    recommendation = {
                        "sponsor": sponsor,
                        "match_score": round(match_score, 3),
                        "reasoning": self._generate_reasoning(sponsor, event_type, match_score)
                    }
                    recommendations.append(recommendation)
            
            # Sort by match score (descending)
            recommendations.sort(key=lambda x: x["match_score"], reverse=True)
            
            # Log the recommendation process
            AgentHelper.log_agent_action(
                agent_name="SponsorAgent",
                action="sponsor_recommendation",
                details={
                    "event_type": event_type,
                    "event_name": event_name,
                    "recommendations_found": len(recommendations),
                    "top_match_score": recommendations[0]["match_score"] if recommendations else 0
                }
            )
            
            return recommendations[:max_recommendations]
            
        except Exception as e:
            logger.error(f"Error generating sponsor recommendations: {e}")
            return []
    
    def _generate_reasoning(self, sponsor: Dict[str, Any], event_type: str, match_score: float) -> str:
        """Generate human-readable reasoning for sponsor match"""
        reasons = []
        
        if event_type in sponsor.get("preferred_event_types", []):
            reasons.append(f"specializes in {event_type} events")
        
        if sponsor.get("past_partnerships"):
            reasons.append("has successful partnership history")
        
        if sponsor.get("values"):
            reasons.append(f"aligns with values: {', '.join(sponsor['values'][:2])}")
        
        if not reasons:
            reasons.append("relevant industry match")
        
        confidence = "high" if match_score > 0.7 else "medium" if match_score > 0.4 else "low"
        return f"{confidence} match - {', '.join(reasons)}"
    
    def generate_outreach_email(
        self, 
        sponsor: Dict[str, Any], 
        event_details: Dict[str, Any]
    ) -> str:
        """
        Generate personalized outreach email using LLM.
        
        Args:
            sponsor: Sponsor information
            event_details: Event information including name, type, date, etc.
            
        Returns:
            Personalized email content
        """
        # Use generic LLM wrapper (Gemini or OpenAI) when available
        try:
            prompt = self._create_email_prompt(sponsor, event_details)
            text = generate_text(prompt, max_tokens=800)

            AgentHelper.log_agent_action(
                agent_name="SponsorAgent",
                action="email_generated",
                details={
                    "sponsor_name": sponsor.get("name"),
                    "event_name": event_details.get("event_name"),
                    "email_length": len(text) if text else 0
                }
            )

            return text if text else self._generate_fallback_email(sponsor, event_details)

        except Exception as e:
            logger.error(f"Error generating email with LLM: {e}")
            return self._generate_fallback_email(sponsor, event_details)
    
    def _create_email_prompt(self, sponsor: Dict[str, Any], event_details: Dict[str, Any]) -> str:
        """Create detailed prompt for email generation"""
        contact_person = sponsor.get("contact", {}).get("contact_person", "Team")
        company_name = sponsor.get("name", "")
        event_name = event_details.get("event_name", "Upcoming Event")
        event_type = event_details.get("event_type", "event")
        
        prompt = f"""
You are a professional event organizer reaching out to potential sponsors. Write a compelling, personalized sponsorship outreach email.

SPONSOR INFORMATION:
- Company: {company_name}
- Contact Person: {contact_person}
- Industry: {sponsor.get('industry', 'N/A')}
- Location: {sponsor.get('location', 'N/A')}
- Company Values: {', '.join(sponsor.get('values', []))}
- Interests: {', '.join(sponsor.get('sponsorship_interests', []))}
- Past Partnerships: {'Yes' if sponsor.get('past_partnerships') else 'No'}

EVENT INFORMATION:
- Event Name: {event_name}
- Event Type: {event_type}
- Target Audience: {event_details.get('target_audience', 'University students and faculty')}
- Expected Attendance: {event_details.get('expected_attendance', '100-200 attendees')}
- Date: {event_details.get('event_date', 'TBD')}
- Objectives: {event_details.get('objectives', 'Educational and networking')}

INSTRUCTIONS:
1. Address the contact person professionally
2. Briefly introduce the event and its value proposition
3. Explain why this sponsor is a perfect fit (reference their values/interests)
4. Highlight mutual benefits and alignment
5. Include specific sponsorship opportunities
6. Suggest next steps
7. Keep it concise but compelling (200-300 words)
8. Use a professional but warm tone
9. Include a clear call-to-action

Write only the email content without subject line.
"""
        return prompt
    
    def _generate_fallback_email(self, sponsor: Dict[str, Any], event_details: Dict[str, Any]) -> str:
        """Generate fallback email when LLM is unavailable"""
        contact_person = sponsor.get("contact", {}).get("contact_person", "Team")
        company_name = sponsor.get("name", "")
        event_name = event_details.get("event_name", "Upcoming Event")
        
        return f"""Dear {contact_person},

I hope this email finds you well. I'm reaching out to explore a potential sponsorship opportunity for {event_name}, an exciting {event_details.get('event_type', 'event')} that aligns perfectly with {company_name}'s mission and values.

Our event will bring together {event_details.get('expected_attendance', '100-200')} participants from the university community, providing excellent visibility and engagement opportunities for {company_name}.

Given your company's focus on {sponsor.get('industry', 'innovation')} and commitment to {', '.join(sponsor.get('values', ['education', 'community'])[:2])}, we believe this partnership would be mutually beneficial.

We offer flexible sponsorship packages that can be customized to meet your marketing objectives and budget requirements. I'd love to discuss how we can create a partnership that delivers value for both our organizations.

Would you be available for a brief call next week to explore this opportunity further?

Looking forward to hearing from you.

Best regards,
Event Organization Team
University Campus Events"""

# Global sponsor agent instance
sponsor_agent = SponsorAgent()
