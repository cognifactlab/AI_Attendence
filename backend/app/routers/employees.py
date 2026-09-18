from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from app.middleware.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[EmployeeResponse])
async def get_employees(
    skip: int = 0,
    limit: int = 100,
    department: str = None,
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all employees"""
    query = db.query(Employee)
    
    if department:
        query = query.filter(Employee.department == department)
    
    if status_filter:
        query = query.filter(Employee.status == status_filter)
    
    employees = query.offset(skip).limit(limit).all()
    return employees

@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get employee by ID"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    return employee

@router.post("/", response_model=EmployeeResponse)
async def create_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new employee"""
    # Check if employee with email already exists
    existing = db.query(Employee).filter(Employee.email == employee_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee with this email already exists"
        )
    
    # Generate employee ID
    last_employee = db.query(Employee).order_by(Employee.id.desc()).first()
    if last_employee:
        last_num = int(last_employee.id.split('-')[1])
        new_id = f"EMP-{str(last_num + 1).zfill(4)}"
    else:
        new_id = "EMP-0001"
    
    # Create employee
    employee = Employee(
        id=new_id,
        name=employee_data.name,
        email=employee_data.email,
        department=employee_data.department,
        position=employee_data.position,
        phone=employee_data.phone,
        join_date=employee_data.join_date
    )
    
    db.add(employee)
    db.commit()
    db.refresh(employee)
    
    return employee

@router.put("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: str,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update employee information"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Update fields
    update_data = employee_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(employee, key, value)
    
    db.commit()
    db.refresh(employee)
    
    return employee

@router.delete("/{employee_id}")
async def delete_employee(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an employee"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    db.delete(employee)
    db.commit()
    
    return {"message": "Employee deleted successfully"}

@router.get("/departments/list")
async def get_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of all departments"""
    departments = db.query(Employee.department).distinct().all()
    return [dept[0] for dept in departments]
