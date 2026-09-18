from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.attendance import Attendance
from app.models.employee import Employee
from app.schemas.attendance import AttendanceCreate, AttendanceStats
from datetime import date, time, datetime
from typing import List, Optional

class AttendanceService:
    def __init__(self, db: Session):
        self.db = db

    def mark_check_in(self, employee_id: str, check_in_time: Optional[time] = None, 
                     confidence: Optional[float] = None, method: str = "face") -> Attendance:
        """Mark employee check-in"""
        today = date.today()
        
        # Check if attendance already exists for today
        existing = self.db.query(Attendance).filter(
            Attendance.employee_id == employee_id,
            Attendance.date == today
        ).first()
        
        if existing:
            if existing.check_in:
                raise ValueError("Employee already checked in today")
            existing.check_in = check_in_time or datetime.now().time()
            existing.confidence = confidence
            existing.method = method
            existing.status = "present"
            self.db.commit()
            self.db.refresh(existing)
            return existing
        
        # Create new attendance record
        attendance = Attendance(
            employee_id=employee_id,
            date=today,
            check_in=check_in_time or datetime.now().time(),
            status="present",
            confidence=confidence,
            method=method
        )
        
        self.db.add(attendance)
        self.db.commit()
        self.db.refresh(attendance)
        
        return attendance

    def mark_check_out(self, employee_id: str, check_out_time: Optional[time] = None) -> Attendance:
        """Mark employee check-out"""
        today = date.today()
        
        attendance = self.db.query(Attendance).filter(
            Attendance.employee_id == employee_id,
            Attendance.date == today
        ).first()
        
        if not attendance:
            raise ValueError("No check-in record found for today")
        
        if attendance.check_out:
            raise ValueError("Employee already checked out today")
        
        attendance.check_out = check_out_time or datetime.now().time()
        self.db.commit()
        self.db.refresh(attendance)
        
        return attendance

    def get_attendance_by_date(self, query_date: date) -> List[Attendance]:
        """Get all attendance records for a specific date"""
        return self.db.query(Attendance).filter(Attendance.date == query_date).all()

    def get_attendance_by_employee(self, employee_id: str, start_date: Optional[date] = None,
                                   end_date: Optional[date] = None) -> List[Attendance]:
        """Get attendance records for an employee"""
        query = self.db.query(Attendance).filter(Attendance.employee_id == employee_id)
        
        if start_date:
            query = query.filter(Attendance.date >= start_date)
        if end_date:
            query = query.filter(Attendance.date <= end_date)
        
        return query.order_by(Attendance.date.desc()).all()

    def get_today_stats(self) -> AttendanceStats:
        """Get today's attendance statistics"""
        today = date.today()
        
        # Total active employees
        total_employees = self.db.query(Employee).filter(Employee.status == "active").count()
        
        # Today's attendance
        today_records = self.db.query(Attendance).filter(Attendance.date == today).all()
        
        present = sum(1 for r in today_records if r.status == "present")
        late = sum(1 for r in today_records if r.status == "late")
        absent = total_employees - present - late
        half_day = sum(1 for r in today_records if r.status == "half-day")
        
        # Calculate attendance rate
        attendance_rate = ((present + late) / total_employees * 100) if total_employees > 0 else 0
        
        # Calculate average confidence
        confidences = [r.confidence for r in today_records if r.confidence is not None]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0
        
        return AttendanceStats(
            total_employees=total_employees,
            present=present,
            late=late,
            absent=absent,
            half_day=half_day,
            attendance_rate=round(attendance_rate, 2),
            avg_confidence=round(avg_confidence, 2)
        )

    def get_department_stats(self, query_date: Optional[date] = None) -> List[dict]:
        """Get attendance statistics by department"""
        query_date = query_date or date.today()
        
        # Get all departments
        departments = self.db.query(Employee.department).distinct().all()
        
        stats = []
        for (dept,) in departments:
            # Total employees in department
            total = self.db.query(Employee).filter(
                Employee.department == dept,
                Employee.status == "active"
            ).count()
            
            # Present today
            present = self.db.query(Attendance).filter(
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

    def export_attendance(self, start_date: date, end_date: date) -> List[dict]:
        """Export attendance records for a date range"""
        records = self.db.query(Attendance).filter(
            Attendance.date >= start_date,
            Attendance.date <= end_date
        ).order_by(Attendance.date.desc(), Attendance.employee_id).all()
        
        return [
            {
                "employee_id": r.employee_id,
                "date": r.date.isoformat(),
                "check_in": r.check_in.isoformat() if r.check_in else None,
                "check_out": r.check_out.isoformat() if r.check_out else None,
                "status": r.status,
                "confidence": r.confidence,
                "method": r.method
            }
            for r in records
        ]
