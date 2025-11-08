"""Async helper to log agent activity to MongoDB (background task).

Provides a small wrapper that schedules async inserts to the configured
MongoDB instance (via backend.database.mongo_connection.mongodb).
"""
import asyncio
import logging
from typing import Dict, Any

from database.mongo_connection import mongodb

logger = logging.getLogger(__name__)


async def _insert(collection_name: str, doc: Dict[str, Any]):
    try:
        # Check if database is connected using the health check method
        db_healthy = await mongodb.health_check()
        if not db_healthy:
            # Not connected yet
            logger.debug("MongoDB not connected; skipping log insert")
            return
        col = mongodb.get_collection(collection_name)
        await col.insert_one(doc)
    except Exception as e:
        logger.warning(f"Failed to write agent log to MongoDB: {e}")


def schedule_log(collection_name: str, doc: Dict[str, Any]):
    """Schedule a background task to insert a document into MongoDB.

    If called within an event loop, uses create_task. Otherwise, runs
    the coroutine synchronously (best-effort).
    """
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None

    if loop and loop.is_running():
        try:
            loop.create_task(_insert(collection_name, doc))
        except Exception as e:
            logger.warning(f"Could not schedule mongo insert task: {e}")
    else:
        # No running loop; run synchronously
        try:
            asyncio.run(_insert(collection_name, doc))
        except Exception as e:
            logger.warning(f"Could not run mongo insert sync: {e}")
