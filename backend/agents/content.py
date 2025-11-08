"""Content Agent - generate emails, social posts, banners using LLMs.

This agent uses the shared LLM wrapper (`utils.llm.generate_text`) so it can
use either Google Gemini or OpenAI depending on configuration.
"""
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

from utils.llm import generate_text
from utils.api_helpers import AgentHelper

logger = logging.getLogger(__name__)


class ContentAgent:
    """Generates marketing and content artifacts for events."""

    def __init__(self):
        # No heavyweight initialization required; wrapper chooses provider
        pass

    def generate_email(self, event: Dict[str, Any], tone: str = "professional", length: str = "short") -> str:
        """Generate a sponsorship or event invitation email.

        Args:
            event: dict with keys like title, date, venue, audience, goals
            tone: writing tone (professional, casual, enthusiastic)
            length: short|medium|long

        Returns:
            Generated email body as string
        """
        prompt = self._build_email_prompt(event, tone, length)
        try:
            text = generate_text(prompt, max_tokens=600)
            AgentHelper.log_agent_action(
                agent_name="ContentAgent",
                action="email_generated",
                details={"title": event.get('title'), "length": length}
            )
            return text
        except Exception as e:
            logger.warning(f"LLM email generation failed: {e}")
            return self._fallback_email(event)

    def generate_social_post(self, event: Dict[str, Any], platform: str = "twitter", length: int = 280) -> str:
        """Generate a social media post for an event.

        Args:
            event: event dict
            platform: 'twitter', 'facebook', 'linkedin', etc.
            length: maximum characters
        Returns:
            Post copy string
        """
        prompt = (
            f"Write a {length}-character {platform} post to promote the following event:\n"
            f"Title: {event.get('title')}\nDate: {event.get('date')}\nVenue: {event.get('venue')}\n"
            f"Audience: {event.get('audience', 'students and faculty')}\n\nInclude a clear CTA and relevant hashtags."
        )
        try:
            text = generate_text(prompt, max_tokens=200)
            AgentHelper.log_agent_action(
                agent_name="ContentAgent",
                action="social_post_generated",
                details={"title": event.get('title'), "platform": platform}
            )
            return text
        except Exception as e:
            logger.warning(f"LLM social post generation failed: {e}")
            # Very small fallback
            title = event.get('title', 'Upcoming Event')
            return f"{title} — Join us on {event.get('date', 'TBD')} at {event.get('venue', 'TBD')}. More info: [link] #CampusEvents"

    def generate_banner_text(self, event: Dict[str, Any], size: str = "hero") -> str:
        """Create concise banner/headline text for promotional assets."""
        prompt = (
            f"Create a short, punchy banner headline for: {event.get('title')}\n"
            f"Keep it under 10 words. Mention date and venue if space allows."
        )
        try:
            text = generate_text(prompt, max_tokens=50)
            AgentHelper.log_agent_action(
                agent_name="ContentAgent",
                action="banner_generated",
                details={"title": event.get('title'), "size": size}
            )
            return text.strip()
        except Exception as e:
            logger.warning(f"LLM banner generation failed: {e}")
            return event.get('title', 'Upcoming Event')

    def _build_email_prompt(self, event: Dict[str, Any], tone: str, length: str) -> str:
        title = event.get('title', 'Event')
        date = event.get('date', 'TBD')
        venue = event.get('venue', 'TBD')
        audience = event.get('audience', 'students and faculty')
        objectives = event.get('objectives', 'Networking and learning')

        prompt = (
            f"You are a professional event marketer. Write a {length} {tone} email invitation for the following event:\n"
            f"Title: {title}\nDate: {date}\nVenue: {venue}\nAudience: {audience}\nObjectives: {objectives}\n\n"
            "Include a short subject suggestion (one line) followed by the email body."
        )
        return prompt

    def _fallback_email(self, event: Dict[str, Any]) -> str:
        return (
            f"Subject: Invitation — {event.get('title', 'Upcoming Event')}\n\n"
            f"Hello,\n\nYou're invited to {event.get('title', 'an upcoming event')} on {event.get('date', 'TBD')} at {event.get('venue', 'TBD')}. "
            f"This event is aimed at {event.get('audience', 'students and faculty')} and will focus on {event.get('objectives', 'educational activities')}.\n\n"
            "Please RSVP via the event page.\n\nRegards,\nEvent Team"
        )


# Global instance
content_agent = ContentAgent()
# Content Agent - Generate branded content
