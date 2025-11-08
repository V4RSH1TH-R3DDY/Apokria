"""Simple Google Calendar helper using an OAuth access token.

This helper uses a bearer access token (short-lived) to create events in the
primary calendar. It's lightweight and intended for optional publishing from
the Scheduler agent when `GOOGLE_CALENDAR_TOKEN` is present in the environment.

Security: Do not store long-lived refresh tokens in the repo. Prefer using a
proper OAuth flow or service account + domain-wide delegation if you need
server-side calendar access for multiple users.
"""
from typing import Dict, Any, Optional
import requests
import logging

logger = logging.getLogger(__name__)

GOOGLE_CALENDAR_EVENTS_ENDPOINT = "https://www.googleapis.com/calendar/v3/calendars/primary/events"


def create_google_calendar_event(event: Dict[str, Any], access_token: str) -> Optional[Dict[str, Any]]:
    """Create a Google Calendar event using a bearer access token.

    Args:
        event: Event dictionary with keys: title, start_time (ISO), end_time (ISO), description, venue
        access_token: OAuth2 access token with calendar.events scope

    Returns:
        The created event JSON from Google (or None on failure)
    """
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "summary": event.get("title", "Apokria Event"),
        "description": event.get("description", ""),
        "location": event.get("venue"),
        "start": {"dateTime": event.get("start_time"), "timeZone": "UTC"},
        "end": {"dateTime": event.get("end_time"), "timeZone": "UTC"},
    }

    try:
        resp = requests.post(GOOGLE_CALENDAR_EVENTS_ENDPOINT, headers=headers, json=payload, timeout=10)
        if resp.status_code in (200, 201):
            logger.info("Created Google Calendar event")
            return resp.json()
        else:
            logger.warning(f"Failed to create calendar event: {resp.status_code} {resp.text}")
            return None
    except Exception as e:
        logger.error(f"Error creating Google Calendar event: {e}")
        return None
