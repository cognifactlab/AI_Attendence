from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import engine, Base
from app.routers import auth, employees, faces, attendance, reports

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create database tables
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown: Cleanup if needed
    pass

app = FastAPI(
    title="FaceTrack AI API",
    description="AI-powered attendance management system with face recognition",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(faces.router, prefix="/api/faces", tags=["Face Recognition"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

@app.get("/")
async def root():
    return {
        "message": "FaceTrack AI API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "facetrack-api"}
