from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.database import get_db
from app.services.attendance_service import AttendanceService
from app.schemas.attendance import AttendanceResponse, AttendanceStats
from app.middleware.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/check-in", response_model=AttendanceResponse)
async def check_in(
    employee_id: str,
    confidence: Optional[float] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark employee check-in"""
    try:
        attendance_service = AttendanceService(db)
        attendance = attendance_service.mark_check_in(
            employee_id=employee_id,
            confidence=confidence
        )
        return attendance
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/check-out", response_model=AttendanceResponse)
async def check_out(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark employee check-out"""
    try:
        attendance_service = AttendanceService(db)
        attendance = attendance_service.mark_check_out(employee_id=employee_id)
        return attendance
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/today", response_model=List[AttendanceResponse])
async def get_today_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get today's attendance records"""
    attendance_service = AttendanceService(db)
    records = attendance_service.get_attendance_by_date(date.today())
    return records

@router.get("/date/{query_date}", response_model=List[AttendanceResponse])
async def get_attendance_by_date(
    query_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get attendance records for a specific date"""
    attendance_service = AttendanceService(db)
    records = attendance_service.get_attendance_by_date(query_date)
    return records

@router.get("/employee/{employee_id}", response_model=List[AttendanceResponse])
async def get_employee_attendance(
    employee_id: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get attendance records for an employee"""
    attendance_service = AttendanceService(db)
    records = attendance_service.get_attendance_by_employee(
        employee_id=employee_id,
        start_date=start_date,
        end_date=end_date
    )
    return records

@router.get("/stats/today", response_model=AttendanceStats)
async def get_today_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get today's attendance statistics"""
    attendance_service = AttendanceService(db)
    stats = attendance_service.get_today_stats()
    return stats

@router.get("/export")
async def export_attendance(
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export attendance records for a date range"""
    attendance_service = AttendanceService(db)
    records = attendance_service.export_attendance(start_date, end_date)
    return {"records": records, "count": len(records)}
