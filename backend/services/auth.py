"""
Authentication service for Apokria.
Handles user registration, login, and user management operations.
"""

from datetime import datetime
from typing import Optional
from fastapi import HTTPException, status
from models.auth import UserCreate, UserLogin, User, UserInDB, UserResponse, UserRole
from utils.auth import AuthUtils
from database.mongo_connection import get_mongo_db
import logging

logger = logging.getLogger(__name__)

class AuthService:
    """Authentication service class"""
    
    @staticmethod
    async def register_user(user_data: UserCreate) -> UserResponse:
        """Register a new user"""
        try:
            db = await get_mongo_db()
            
            # Check if username already exists
            existing_user = await db.users.find_one({"username": user_data.username})
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already registered"
                )
            
            # Check if email already exists
            existing_email = await db.users.find_one({"email": user_data.email})
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            
            # Hash password
            hashed_password = AuthUtils.get_password_hash(user_data.password)
            
            # Create user document
            user_doc = {
                "username": user_data.username,
                "email": user_data.email,
                "full_name": user_data.full_name,
                "role": user_data.role.value,
                "hashed_password": hashed_password,
                "is_active": True,
                "created_at": datetime.utcnow(),
                "last_login": None
            }
            
            # Insert user into database
            result = await db.users.insert_one(user_doc)
            user_doc["id"] = str(result.inserted_id)
            
            # Remove sensitive information and return user
            del user_doc["hashed_password"]
            del user_doc["_id"]
            
            logger.info(f"User registered successfully: {user_data.username}")
            return UserResponse(**user_doc)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"User registration error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Registration failed"
            )
    
    @staticmethod
    async def authenticate_user(login_data: UserLogin) -> Optional[User]:
        """Authenticate a user and return user object if valid"""
        try:
            db = await get_mongo_db()
            
            # Find user by username
            user_doc = await db.users.find_one({"username": login_data.username})
            if not user_doc:
                return None
            
            # Verify password
            if not AuthUtils.verify_password(login_data.password, user_doc["hashed_password"]):
                return None
            
            # Check if user is active
            if not user_doc.get("is_active", True):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Inactive user account"
                )
            
            # Update last login
            await db.users.update_one(
                {"_id": user_doc["_id"]},
                {"$set": {"last_login": datetime.utcnow()}}
            )
            
            # Convert to User model
            user_doc["id"] = str(user_doc["_id"])
            del user_doc["_id"]
            del user_doc["hashed_password"]  # Don't expose password hash
            
            return User(**user_doc)
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"User authentication error: {e}")
            return None
    
    @staticmethod
    async def login_user(login_data: UserLogin) -> dict:
        """Login user and return token"""
        user = await AuthService.authenticate_user(login_data)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create token
        token_response = AuthUtils.create_user_token(user)
        
        logger.info(f"User logged in successfully: {user.username}")
        return token_response
    
    @staticmethod
    async def get_user_by_username(username: str) -> Optional[UserResponse]:
        """Get user by username"""
        try:
            db = await get_mongo_db()
            
            user_doc = await db.users.find_one({"username": username})
            if not user_doc:
                return None
            
            # Convert to UserResponse model
            user_doc["id"] = str(user_doc["_id"])
            del user_doc["_id"]
            del user_doc["hashed_password"]  # Don't expose password hash
            
            return UserResponse(**user_doc)
            
        except Exception as e:
            logger.error(f"Error fetching user: {e}")
            return None
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[UserResponse]:
        """Get user by ID"""
        try:
            from bson import ObjectId
            db = await get_mongo_db()
            
            user_doc = await db.users.find_one({"_id": ObjectId(user_id)})
            if not user_doc:
                return None
            
            # Convert to UserResponse model
            user_doc["id"] = str(user_doc["_id"])
            del user_doc["_id"]
            del user_doc["hashed_password"]  # Don't expose password hash
            
            return UserResponse(**user_doc)
            
        except Exception as e:
            logger.error(f"Error fetching user by ID: {e}")
            return None
    
    @staticmethod
    async def update_user_role(username: str, new_role: UserRole, admin_user: User) -> UserResponse:
        """Update user role (admin only)"""
        try:
            if admin_user.role != UserRole.ADMIN:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Only admins can update user roles"
                )
            
            db = await get_mongo_db()
            
            result = await db.users.update_one(
                {"username": username},
                {"$set": {"role": new_role.value}}
            )
            
            if result.matched_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            
            updated_user = await AuthService.get_user_by_username(username)
            logger.info(f"User role updated: {username} -> {new_role.value}")
            return updated_user
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating user role: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update user role"
            )