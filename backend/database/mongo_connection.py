"""
MongoDB Atlas connection and database utilities for Apokria.
Handles connection, database operations, and collection management.
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MongoDB:
    """MongoDB Atlas connection manager using Motor (async driver)"""
    
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.database = None
        
    async def connect(self):
        """Connect to MongoDB Atlas"""
        try:
            mongodb_uri = os.getenv("MONGODB_URI")
            if not mongodb_uri:
                raise ValueError("MONGODB_URI environment variable not set")
                
            self.client = AsyncIOMotorClient(mongodb_uri)
            
            # Test the connection
            await self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB Atlas")
            
            # Select database (default to 'apokria')
            db_name = os.getenv("DB_NAME", "apokria")
            self.database = self.client[db_name]
            
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
        except Exception as e:
            logger.error(f"Error connecting to MongoDB: {e}")
            raise
    
    async def disconnect(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")
    
    def get_collection(self, collection_name: str):
        """Get a collection from the database"""
        if self.database is None:
            raise RuntimeError("Database not connected. Call connect() first.")
        return self.database[collection_name]
    
    async def health_check(self) -> bool:
        """Check if database connection is healthy"""
        try:
            if self.client:
                await self.client.admin.command('ping')
                return True
            return False
        except Exception:
            return False

# Global database instance
mongodb = MongoDB()

async def get_database():
    """Dependency to get database instance"""
    return mongodb

# Collection getters for different data types
async def get_events_collection():
    """Get events collection"""
    return mongodb.get_collection("events")

async def get_users_collection():
    """Get users collection"""
    return mongodb.get_collection("users")

async def get_sponsors_collection():
    """Get sponsors collection"""
    return mongodb.get_collection("sponsors")

async def get_analytics_collection():
    """Get analytics collection"""
    return mongodb.get_collection("analytics")

async def get_mongo_db():
    """Get MongoDB database instance for auth and other services"""
    db_healthy = await mongodb.health_check()
    if not db_healthy:
        await mongodb.connect()
    return mongodb.database

# Database initialization and cleanup
async def init_database():
    """Initialize database connection on startup"""
    await mongodb.connect()
    logger.info("Database initialized")

async def close_database():
    """Close database connection on shutdown"""
    await mongodb.disconnect()
    logger.info("Database connection closed")