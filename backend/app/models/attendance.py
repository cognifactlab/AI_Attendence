from sqlalchemy import Column, String, Float, Date, Time, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
import uuid

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(String(20), ForeignKey("employees.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    check_in = Column(Time)
    check_out = Column(Time)
    status = Column(String(20), nullable=False)  # present, late, absent, half-day
    confidence = Column(Float)
    method = Column(String(20), default="face")  # face, manual, qr
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint('employee_id', 'date', name='uq_employee_date'),
    )
