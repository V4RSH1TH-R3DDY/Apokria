"""
Event models for the Apokria event management system.
Matches the TypeScript types expected by the frontend.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Union
from datetime import datetime


class ScheduleItem(BaseModel):
    """Schedule item for an event"""
    id: str
    day: int
    startTime: str
    endTime: str
    session: str
    room: Optional[str] = None


class Package(BaseModel):
    """Sponsorship package for an event"""
    id: str
    tier: str
    benefits: List[str]
    price: Optional[float] = None


class Asset(BaseModel):
    """Event asset (PDF, image, etc.)"""
    id: str
    type: str = Field(..., pattern="^(pdf|image|csv)$")
    url: str
    version: int
    locale: Optional[str] = None


class OutreachBundle(BaseModel):
    """Outreach content bundle"""
    emailSponsor: str
    emailParticipants: str
    whatsapp: str


class Event(BaseModel):
    """Main event model"""
    id: str
    name: str
    startDate: str  # ISO format date string
    endDate: str    # ISO format date string
    venue: Optional[str] = None
    capacity: Optional[int] = None
    schedules: List[ScheduleItem] = []
    packages: List[Package] = []
    assets: List[Asset] = []
    outreach: Optional[OutreachBundle] = None


class CreateEventRequest(BaseModel):
    """Request model for creating a new event"""
    name: str
    startDate: str
    endDate: str
    venue: Optional[str] = None
    capacity: Optional[int] = None


class UpdateEventRequest(BaseModel):
    """Request model for updating an existing event"""
    name: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    venue: Optional[str] = None
    capacity: Optional[int] = None