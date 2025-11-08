"""
Authentication models for Apokria.
Handles user registration, login, and token management.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    STUDENT = "student"
    ORGANIZER = "organizer"  
    ADMIN = "admin"

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.STUDENT

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: Optional[str] = None
    is_active: bool = True
    created_at: datetime
    last_login: Optional[datetime] = None

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: User

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    role: UserRole
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None