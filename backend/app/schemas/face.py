from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class FaceRegisterRequest(BaseModel):
    employee_id: str
    image_data: str  # Base64 encoded image

class FaceRecognizeRequest(BaseModel):
    image_data: str  # Base64 encoded image
    threshold: Optional[float] = 0.6

class FaceResponse(BaseModel):
    id: UUID
    employee_id: str
    sample_quality: Optional[float]
    is_primary: bool
    created_at: datetime

    class Config:
        from_attributes = True

class FaceRecognizeResponse(BaseModel):
    matched: bool
    employee_id: Optional[str] = None
    confidence: float
    message: str

class FaceEmbeddingResponse(BaseModel):
    embedding: List[float]
    dimensions: int
