from sqlalchemy import Column, String, Boolean, Integer, Date, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(String(20), primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    department = Column(String(100), nullable=False, index=True)
    position = Column(String(100))
    phone = Column(String(20))
    join_date = Column(Date, nullable=False)
    face_registered = Column(Boolean, default=False)
    face_samples_count = Column(Integer, default=0)
    status = Column(String(20), default="active")  # active, inactive, terminated
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
