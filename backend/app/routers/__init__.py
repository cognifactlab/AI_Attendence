from app.routers.auth import router as auth_router
from app.routers.employees import router as employees_router
from app.routers.faces import router as faces_router
from app.routers.attendance import router as attendance_router
from app.routers.reports import router as reports_router

__all__ = ['auth_router', 'employees_router', 'faces_router', 'attendance_router', 'reports_router']
