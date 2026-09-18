from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import date, timedelta
from app.database import get_db
from app.models.attendance import Attendance
from app.models.employee import Employee
from app.middleware.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dashboard statistics"""
    today = date.today()
    
    # Total active employees
    total_employees = db.query(Employee).filter(Employee.status == "active").count()
    
    # Today's attendance
    today_records = db.query(Attendance).filter(Attendance.date == today).all()
    
    present = sum(1 for r in today_records if r.status == "present")
    late = sum(1 for r in today_records if r.status == "late")
    absent = total_employees - present - late
    
    # Attendance rate
    attendance_rate = ((present + late) / total_employees * 100) if total_employees > 0 else 0
    
    # Average confidence
    confidences = [r.confidence for r in today_records if r.confidence is not None]
    avg_confidence = sum(confidences) / len(confidences) if confidences else 0
    
    return {
        "total_employees": total_employees,
        "present_today": present,
        "late_today": late,
        "absent_today": absent,
        "attendance_rate": round(attendance_rate, 2),
        "avg_confidence": round(avg_confidence, 2)
    }

@router.get("/department")
async def get_department_stats(
    query_date: date = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get department-wise statistics"""
    query_date = query_date or date.today()
    
    # Get all departments
    departments = db.query(Employee.department).distinct().all()
    
    stats = []
    for (dept,) in departments:
        # Total employees in department
        total = db.query(Employee).filter(
            Employee.department == dept,
            Employee.status == "active"
        ).count()
        
        # Present today
        present = db.query(Attendance).filter(
            Attendance.date == query_date,
            Attendance.status.in_(["present", "late"])
        ).join(Employee).filter(Employee.department == dept).count()
        
        attendance_rate = (present / total * 100) if total > 0 else 0
        
        stats.append({
            "department": dept,
            "total_employees": total,
            "present": present,
            "attendance_rate": round(attendance_rate, 2)
        })
    
    return stats

@router.get("/monthly")
async def get_monthly_trend(
    months: int = 12,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get monthly attendance trend"""
    today = date.today()
    trend = []
    
    for i in range(months - 1, -1, -1):
        month_date = today - timedelta(days=i * 30)
        month_start = month_date.replace(day=1)
        
        if month_date.month == 12:
            month_end = month_date.replace(year=month_date.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            month_end = month_date.replace(month=month_date.month + 1, day=1) - timedelta(days=1)
        
        # Total employees
        total = db.query(Employee).filter(
            Employee.status == "active",
            Employee.join_date <= month_end
        ).count()
        
        # Attendance records
        records = db.query(Attendance).filter(
            Attendance.date >= month_start,
            Attendance.date <= month_end
        ).all()
        
        present = sum(1 for r in records if r.status in ["present", "late"])
        
        # Calculate average attendance rate for the month
        attendance_rate = (present / (total * 30) * 100) if total > 0 else 0
        
        # Average confidence
        confidences = [r.confidence for r in records if r.confidence is not None]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        trend.append({
            "month": month_start.strftime("%b %Y"),
            "rate": round(attendance_rate, 2),
            "confidence": round(avg_confidence, 2)
        })
    
    return trend

@router.get("/performers")
async def get_top_performers(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get top performing employees"""
    # Get employees with highest attendance rate in last 30 days
    thirty_days_ago = date.today() - timedelta(days=30)
    
    # Get all attendance records in last 30 days
    records = db.query(
        Attendance.employee_id,
        func.count(Attendance.id).label("total_days"),
        func.sum(func.case(
            (Attendance.status.in_(["present", "late"]), 1),
            else_=0
        )).label("present_days")
    ).filter(
        Attendance.date >= thirty_days_ago
    ).group_by(Attendance.employee_id).all()
    
    # Calculate attendance rate
    performers = []
    for record in records:
        employee = db.query(Employee).filter(Employee.id == record.employee_id).first()
        if employee:
            rate = (record.present_days / record.total_days * 100) if record.total_days > 0 else 0
            performers.append({
                "employee_id": record.employee_id,
                "employee_name": employee.name,
                "department": employee.department,
                "attendance_rate": round(rate, 2),
                "total_days": record.total_days,
                "present_days": record.present_days
            })
    
    # Sort by attendance rate
    performers.sort(key=lambda x: x["attendance_rate"], reverse=True)
    
    return performers[:limit]
