"""Analytics Agent - compute KPIs and basic reports from events data.

This agent reads from Firestore (preferred) via `database.firebase_connection`.
If Firestore is not initialized it will try MongoDB (async) as a best-effort.
"""
import logging
from typing import Dict, Any, List
from datetime import datetime, timezone

from database.firebase_connection import get_events_collection
from utils.api_helpers import DateTimeHelper

logger = logging.getLogger(__name__)


class AnalyticsAgent:
    """Provides simple analytics over events stored in Firestore or Mongo."""

    def __init__(self):
        pass

    def _fetch_events(self) -> List[Dict[str, Any]]:
        """Fetch events from Firestore. Returns list of event dicts."""
        try:
            events_col = get_events_collection()
        except Exception as e:
            logger.warning(f"Firestore not available for analytics: {e}")
            return []

        try:
            # Read all scheduled events (lightweight query)
            docs = events_col.where('status', '==', 'scheduled').stream()
            events = []
            for d in docs:
                data = d.to_dict()
                data['id'] = d.id
                events.append(data)
            return events
        except Exception as e:
            logger.error(f"Failed to fetch events for analytics: {e}")
            return []

    def basic_kpis(self) -> Dict[str, Any]:
        """Return simple KPIs: total events, upcoming events, average capacity, events by category."""
        events = self._fetch_events()
        now = datetime.utcnow().replace(tzinfo=timezone.utc)

        total = len(events)
        upcoming = 0
        capacity_sum = 0
        capacity_count = 0
        by_category = {}

        for e in events:
            try:
                start = e.get('start_time')
                if hasattr(start, 'timestamp'):
                    start_dt = datetime.fromtimestamp(start.timestamp(), tz=timezone.utc)
                else:
                    start_dt = DateTimeHelper.parse_datetime(start) if isinstance(start, str) else start

                if start_dt and start_dt > now:
                    upcoming += 1
            except Exception:
                # ignore parsing errors
                pass

            cap = e.get('capacity')
            if isinstance(cap, (int, float)) and cap > 0:
                capacity_sum += cap
                capacity_count += 1

            cat = e.get('category') or 'uncategorized'
            by_category[cat] = by_category.get(cat, 0) + 1

        avg_capacity = (capacity_sum / capacity_count) if capacity_count else None

        return {
            'total_events': total,
            'upcoming_events': upcoming,
            'average_capacity': avg_capacity,
            'events_by_category': by_category
        }

    def next_event(self) -> Dict[str, Any]:
        """Return the next upcoming event (minimal info)"""
        events = self._fetch_events()
        now = datetime.utcnow().replace(tzinfo=timezone.utc)
        next_ev = None
        next_start = None

        for e in events:
            try:
                start = e.get('start_time')
                if hasattr(start, 'timestamp'):
                    start_dt = datetime.fromtimestamp(start.timestamp(), tz=timezone.utc)
                else:
                    start_dt = DateTimeHelper.parse_datetime(start) if isinstance(start, str) else start

                if start_dt and start_dt > now:
                    if next_start is None or start_dt < next_start:
                        next_start = start_dt
                        next_ev = e
            except Exception:
                continue

        if not next_ev:
            return {}

        return {
            'id': next_ev.get('id'),
            'title': next_ev.get('title'),
            'start_time': next_start.isoformat() if next_start else None,
            'venue': next_ev.get('venue')
        }

    def events_over_time(self, months: int = 6) -> Dict[str, int]:
        """Return a simple timeseries (month-year -> count) for the last N months."""
        from collections import defaultdict
        events = self._fetch_events()
        now = datetime.utcnow()
        counts = defaultdict(int)

        try:
            for e in events:
                start = e.get('start_time')
                if hasattr(start, 'timestamp'):
                    start_dt = datetime.fromtimestamp(start.timestamp())
                else:
                    start_dt = DateTimeHelper.parse_datetime(start) if isinstance(start, str) else start

                if not start_dt:
                    continue

                delta_months = (now.year - start_dt.year) * 12 + (now.month - start_dt.month)
                if 0 <= delta_months < months:
                    key = f"{start_dt.year}-{start_dt.month:02d}"
                    counts[key] += 1
        except Exception as e:
            logger.warning(f"Error computing events over time: {e}")

        return dict(counts)


# Global instance
analytics_agent = AnalyticsAgent()
# Analytics Agent - Track KPIs and insights
