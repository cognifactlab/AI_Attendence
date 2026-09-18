from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
import uuid

class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(String(20), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    embedding = Column(String, nullable=False)  # Stored as JSON string, converted to vector in queries
    sample_quality = Column(Float)
    image_path = Column(String(500))
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
