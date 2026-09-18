from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    department: str
    position: Optional[str] = None
    phone: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    join_date: date

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None

class EmployeeResponse(EmployeeBase):
    id: str
    join_date: date
    face_registered: bool
    face_samples_count: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
