from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.face_service import FaceService
from app.schemas.face import FaceRegisterRequest, FaceRecognizeRequest, FaceRecognizeResponse
from app.middleware.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/register")
async def register_face(
    face_data: FaceRegisterRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Register a face for an employee"""
    try:
        face_service = FaceService(db)
        result = face_service.register_face(
            employee_id=face_data.employee_id,
            image_data=face_data.image_data
        )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Face registration failed: {str(e)}"
        )

@router.post("/recognize", response_model=FaceRecognizeResponse)
async def recognize_face(
    face_data: FaceRecognizeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Recognize a face from image"""
    try:
        face_service = FaceService(db)
        result = face_service.recognize_face(
            image_data=face_data.image_data,
            threshold=face_data.threshold
        )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Face recognition failed: {str(e)}"
        )

@router.get("/samples/{employee_id}")
async def get_face_samples(
    employee_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all face samples for an employee"""
    try:
        face_service = FaceService(db)
        samples = face_service.get_face_samples(employee_id)
        return {"samples": samples, "count": len(samples)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get face samples: {str(e)}"
        )

@router.delete("/samples/{embedding_id}")
async def delete_face_sample(
    embedding_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a face sample"""
    try:
        face_service = FaceService(db)
        result = face_service.delete_face_sample(embedding_id)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete face sample: {str(e)}"
        )

@router.get("/stats")
async def get_face_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get face recognition statistics"""
    from app.models.face_embedding import FaceEmbedding
    from app.models.employee import Employee
    
    total_employees = db.query(Employee).filter(Employee.status == "active").count()
    registered_faces = db.query(Employee).filter(
        Employee.face_registered == True,
        Employee.status == "active"
    ).count()
    total_samples = db.query(FaceEmbedding).count()
    
    return {
        "total_employees": total_employees,
        "registered_faces": registered_faces,
        "total_samples": total_samples,
        "registration_rate": round((registered_faces / total_employees * 100) if total_employees > 0 else 0, 2)
    }
