"""
Firebase configuration and connection utilities for Apokria.
Handles Firestore database operations and authentication.
"""

import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from typing import Optional, Dict, Any
import logging
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

class FirebaseManager:
    """Firebase Admin SDK manager for Firestore operations"""
    
    def __init__(self):
        self.app: Optional[firebase_admin.App] = None
        self.db: Optional[firestore.Client] = None
        
    def initialize(self):
        """Initialize Firebase Admin SDK"""
        try:
            if not firebase_admin._apps:
                # First try default credentials
                try:
                    self.app = firebase_admin.initialize_app()
                    logger.info("Firebase initialized with default credentials")
                    return
                except Exception as e:
                    logger.warning(f"Failed to initialize with default credentials: {e}")
                
                # Check for service account key file
                service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")

                # If a relative path is provided, resolve it relative to the backend folder
                if service_account_path:
                    candidate = Path(service_account_path)
                    if not candidate.is_absolute():
                        # Resolve relative to repository backend directory (two levels up from this file)
                        repo_backend = Path(__file__).resolve().parents[1]
                        candidate = (repo_backend / service_account_path).resolve()

                    if candidate.exists():
                        # Use service account file
                        abs_path = str(candidate)
                        logger.info(f"Using Firebase service account file at: {abs_path}")
                        # Read and parse the JSON file directly
                        with open(abs_path, 'r') as f:
                            service_account_info = json.load(f)
                        # Also set GOOGLE_APPLICATION_CREDENTIALS for libraries that rely on it
                        os.environ.setdefault("GOOGLE_APPLICATION_CREDENTIALS", abs_path)
                        cred = credentials.Certificate(service_account_info)
                        self.app = firebase_admin.initialize_app(cred)
                    else:
                        logger.debug(f"FIREBASE_SERVICE_ACCOUNT_PATH set but file not found at {candidate}")

                # If we haven't initialized yet, try FIREBASE_SERVICE_ACCOUNT_JSON
                if not self.app:
                    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
                    if service_account_json:
                        try:
                            # Accept either a JSON string or a Python-like dict string
                            service_account_info = json.loads(service_account_json)
                        except Exception:
                            # Try to fix common issues (single quotes or escaped newlines)
                            try:
                                cleaned = service_account_json.replace("'", '"')
                                service_account_info = json.loads(cleaned)
                            except Exception:
                                # As a last resort, attempt to evaluate using ast (safer to fail loudly)
                                import ast
                                service_account_info = ast.literal_eval(service_account_json)

                        cred = credentials.Certificate(service_account_info)
                        self.app = firebase_admin.initialize_app(cred)

                # If still not initialized, fall back to default credentials
                if not self.app:
                    logger.warning("No Firebase credentials found. Using default credentials.")
                    self.app = firebase_admin.initialize_app()
                        
                logger.info("Firebase Admin SDK initialized successfully")
            else:
                self.app = firebase_admin.get_app()
                
            self.db = firestore.client(app=self.app)
            logger.info("Firestore client initialized")
            
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {e}")
            raise
    
    def get_collection(self, collection_name: str):
        """Get a Firestore collection reference"""
        if not self.db:
            raise RuntimeError("Firestore not initialized. Call initialize() first.")
        return self.db.collection(collection_name)
    
    def health_check(self) -> bool:
        """Check if Firebase connection is healthy"""
        try:
            if self.db:
                # Try to read from a test collection
                test_ref = self.db.collection('health_check').limit(1)
                list(test_ref.stream())  # This will raise if connection fails
                return True
            return False
        except Exception as e:
            logger.error(f"Firebase health check failed: {e}")
            return False

# Global Firebase instance
firebase_manager = FirebaseManager()

async def init_firebase():
    """Initialize Firebase connection on startup"""
    firebase_manager.initialize()
    logger.info("Firebase initialized")

async def close_firebase():
    """Close Firebase connection on shutdown"""
    try:
        if firebase_manager.app:
            firebase_admin.delete_app(firebase_manager.app)
        logger.info("Firebase connection closed")
    except Exception as e:
        logger.warning(f"Error closing Firebase: {e}")

def get_firestore_client():
    """Get Firestore client instance"""
    return firebase_manager.db

def get_events_collection():
    """Get events collection from Firestore"""
    return firebase_manager.get_collection("events")

def get_users_collection():
    """Get users collection from Firestore"""
    return firebase_manager.get_collection("users")

def get_analytics_collection():
    """Get analytics collection from Firestore"""
    return firebase_manager.get_collection("analytics")

# Event data model helpers
class EventDocument:
    """Helper class for Event document structure in Firestore"""
    
    @staticmethod
    def create_event_doc(
        title: str,
        start_time: datetime,
        end_time: datetime,
        venue: str,
        organizer: str = None,
        description: str = None,
        category: str = None,
        capacity: int = None,
        budget: float = None
    ) -> Dict[str, Any]:
        """Create a standardized event document for Firestore"""
        return {
            "title": title,
            "description": description or "",
            "start_time": start_time,
            "end_time": end_time,
            "venue": venue,
            "organizer": organizer or "",
            "category": category or "general",
            "capacity": capacity or 0,
            "budget": budget or 0.0,
            "status": "scheduled",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    
    @staticmethod
    def update_event_doc(**kwargs) -> Dict[str, Any]:
        """Create an update document for Firestore"""
        update_data = {k: v for k, v in kwargs.items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        return update_data