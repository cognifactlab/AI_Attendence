from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Application
    app_name: str = "FaceTrack AI"
    debug: bool = False
    
    # Database
    database_url: str = "postgresql://facetrack:facetrack_pass@localhost:5432/facetrack_db"
    
    # JWT Authentication
    secret_key: str = "your-super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours
    
    # CORS
    cors_origins: str = "http://localhost:8080,http://localhost:3000"
    
    # Face Recognition
    face_recognition_model: str = "HOG"  # HOG or CNN
    face_embedding_dimensions: int = 128
    face_match_threshold: float = 0.6
    max_face_samples: int = 10
    min_face_samples: int = 3
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    cache_ttl: int = 3600
    
    # Rate Limiting
    rate_limit_per_minute: int = 100
    login_rate_limit: int = 5
    
    # File Upload
    upload_dir: str = "./uploads"
    max_upload_size: int = 10485760  # 10MB
    allowed_extensions: str = "jpg,jpeg,png,webp"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
