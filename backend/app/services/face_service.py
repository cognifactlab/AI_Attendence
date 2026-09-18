import face_recognition
import numpy as np
import base64
from io import BytesIO
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.face_embedding import FaceEmbedding
from app.config import settings
import json

class FaceService:
    def __init__(self, db: Session):
        self.db = db
        self.model = settings.face_recognition_model
        self.threshold = settings.face_match_threshold

    def decode_image(self, image_data: str) -> np.ndarray:
        """Decode base64 image data to numpy array"""
        try:
            # Remove data URL prefix if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            image_bytes = base64.b64decode(image_data)
            image = face_recognition.load_image_file(BytesIO(image_bytes))
            return image
        except Exception as e:
            raise ValueError(f"Failed to decode image: {str(e)}")

    def encode_face(self, image: np.ndarray) -> Optional[List[float]]:
        """Generate 128-d face embedding from image"""
        try:
            if self.model == "CNN":
                encodings = face_recognition.face_encodings(image, model="cnn")
            else:
                encodings = face_recognition.face_encodings(image, model="hog")
            
            if not encodings:
                return None
            
            return encodings[0].tolist()
        except Exception as e:
            raise ValueError(f"Failed to encode face: {str(e)}")

    def detect_faces(self, image: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """Detect faces in image and return bounding boxes"""
        try:
            if self.model == "CNN":
                face_locations = face_recognition.face_locations(image, model="cnn")
            else:
                face_locations = face_recognition.face_locations(image, model="hog")
            
            return face_locations
        except Exception as e:
            raise ValueError(f"Failed to detect faces: {str(e)}")

    def register_face(self, employee_id: str, image_data: str) -> dict:
        """Register a face embedding for an employee"""
        image = self.decode_image(image_data)
        
        # Detect faces
        face_locations = self.detect_faces(image)
        if not face_locations:
            raise ValueError("No face detected in image")
        
        # Encode face
        embedding = self.encode_face(image)
        if embedding is None:
            raise ValueError("Failed to generate face embedding")
        
        # Store in database
        face_embedding = FaceEmbedding(
            employee_id=employee_id,
            embedding=json.dumps(embedding),
            sample_quality=0.95,  # TODO: Calculate actual quality
            is_primary=False
        )
        
        self.db.add(face_embedding)
        self.db.commit()
        self.db.refresh(face_embedding)
        
        # Update employee face_registered status
        from app.models.employee import Employee
        employee = self.db.query(Employee).filter(Employee.id == employee_id).first()
        if employee:
            employee.face_registered = True
            employee.face_samples_count += 1
            self.db.commit()
        
        return {
            "status": "success",
            "embedding_id": str(face_embedding.id),
            "dimensions": len(embedding),
            "message": "Face registered successfully"
        }

    def recognize_face(self, image_data: str, threshold: Optional[float] = None) -> dict:
        """Recognize face by comparing against stored embeddings"""
        threshold = threshold or self.threshold
        
        image = self.decode_image(image_data)
        
        # Detect faces
        face_locations = self.detect_faces(image)
        if not face_locations:
            return {
                "matched": False,
                "confidence": 0.0,
                "message": "No face detected in image"
            }
        
        # Encode face
        query_embedding = self.encode_face(image)
        if query_embedding is None:
            return {
                "matched": False,
                "confidence": 0.0,
                "message": "Failed to generate face embedding"
            }
        
        # Get all stored embeddings
        stored_embeddings = self.db.query(FaceEmbedding).all()
        
        if not stored_embeddings:
            return {
                "matched": False,
                "confidence": 0.0,
                "message": "No registered faces in database"
            }
        
        # Compare with stored embeddings
        best_match = None
        best_distance = float('inf')
        
        query_embedding_array = np.array(query_embedding)
        
        for stored in stored_embeddings:
            stored_embedding_array = np.array(json.loads(stored.embedding))
            
            # Calculate Euclidean distance
            distance = np.linalg.norm(query_embedding_array - stored_embedding_array)
            
            # Convert distance to confidence (0-100)
            confidence = max(0, min(100, (1 - distance / 1.0) * 100))
            
            if distance < best_distance:
                best_distance = distance
                best_match = {
                    "employee_id": stored.employee_id,
                    "confidence": round(confidence, 2),
                    "distance": distance
                }
        
        # Check if match meets threshold
        if best_match and best_match["confidence"] >= (threshold * 100):
            return {
                "matched": True,
                "employee_id": best_match["employee_id"],
                "confidence": best_match["confidence"],
                "message": "Face recognized successfully"
            }
        else:
            return {
                "matched": False,
                "confidence": best_match["confidence"] if best_match else 0.0,
                "message": "No match found above threshold"
            }

    def get_face_samples(self, employee_id: str) -> List[dict]:
        """Get all face samples for an employee"""
        embeddings = self.db.query(FaceEmbedding).filter(
            FaceEmbedding.employee_id == employee_id
        ).all()
        
        return [
            {
                "id": str(emb.id),
                "sample_quality": emb.sample_quality,
                "is_primary": emb.is_primary,
                "created_at": emb.created_at.isoformat()
            }
            for emb in embeddings
        ]

    def delete_face_sample(self, embedding_id: str) -> dict:
        """Delete a face sample"""
        embedding = self.db.query(FaceEmbedding).filter(
            FaceEmbedding.id == embedding_id
        ).first()
        
        if not embedding:
            raise ValueError("Face sample not found")
        
        employee_id = embedding.employee_id
        
        self.db.delete(embedding)
        self.db.commit()
        
        # Update employee face count
        from app.models.employee import Employee
        employee = self.db.query(Employee).filter(Employee.id == employee_id).first()
        if employee:
            remaining_count = self.db.query(FaceEmbedding).filter(
                FaceEmbedding.employee_id == employee_id
            ).count()
            
            employee.face_samples_count = remaining_count
            if remaining_count == 0:
                employee.face_registered = False
            
            self.db.commit()
        
        return {
            "status": "success",
            "message": "Face sample deleted successfully"
        }
