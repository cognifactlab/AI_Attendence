from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date, time, datetime

class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    check_in: Optional[time] = None
    check_out: Optional[time] = None
    status: str
    confidence: Optional[float] = None
    method: str = "face"
    notes: Optional[str] = None

class AttendanceResponse(BaseModel):
    id: UUID
    employee_id: str
    date: date
    check_in: Optional[time]
    check_out: Optional[time]
    status: str
    confidence: Optional[float]
    method: str
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class AttendanceStats(BaseModel):
    total_employees: int
    present: int
    late: int
    absent: int
    half_day: int
    attendance_rate: float
    avg_confidence: float
