"""
Authentication utilities for Apokria.
Handles password hashing, JWT token creation/validation, and user verification.
"""

import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.auth import TokenData, UserInDB, User
import logging

logger = logging.getLogger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# HTTP Bearer token scheme
security = HTTPBearer()

class AuthUtils:
    """Authentication utility class"""
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a plaintext password against its hash"""
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception as e:
            logger.error(f"Password verification error: {e}")
            return False
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hash a password"""
        return pwd_context.hash(password)
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create a JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            
        to_encode.update({"exp": expire})
        
        try:
            encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
            return encoded_jwt
        except Exception as e:
            logger.error(f"Token creation error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not create access token"
            )
    
    @staticmethod
    def verify_token(token: str) -> TokenData:
        """Verify and decode a JWT token"""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            role: str = payload.get("role")
            
            if username is None:
                raise credentials_exception
                
            token_data = TokenData(username=username, role=role)
            return token_data
            
        except JWTError as e:
            logger.error(f"JWT verification error: {e}")
            raise credentials_exception
    
    @staticmethod
    def create_user_token(user: User) -> dict:
        """Create a complete token response for a user"""
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        token_data = {
            "sub": user.username,
            "role": user.role.value,
            "user_id": user.id,
            "email": user.email
        }
        
        access_token = AuthUtils.create_access_token(
            data=token_data, 
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # in seconds
            "user": user
        }

async def get_current_user_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> TokenData:
    """Dependency to get current user from JWT token"""
    return AuthUtils.verify_token(credentials.credentials)

async def get_current_user(token_data: TokenData = Depends(get_current_user_token)) -> User:
    """Dependency to get current user object"""
    # This would typically fetch from database
    # For now, return basic user info from token
    from database.mongo_connection import get_mongo_db
    
    try:
        db = await get_mongo_db()
        user_doc = await db.users.find_one({"username": token_data.username})
        
        if user_doc is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Convert MongoDB document to User model
        user_doc["id"] = str(user_doc["_id"])
        del user_doc["_id"]
        del user_doc["hashed_password"]  # Don't expose password hash
        
        return User(**user_doc)
        
    except Exception as e:
        logger.error(f"Error fetching current user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not fetch user information"
        )

def require_role(required_roles: list[str]):
    """Dependency factory for role-based access control"""
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role.value not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker

# Common role dependencies
require_admin = require_role(["admin"])
require_organizer = require_role(["organizer", "admin"])
require_student = require_role(["student", "organizer", "admin"])