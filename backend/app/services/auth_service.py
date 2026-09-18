from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.security import hash_password, verify_password, create_access_token
from app.schemas.user import UserCreate, UserLogin
from typing import Optional

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register_user(self, user_data: UserCreate) -> User:
        """Register a new user"""
        # Check if user already exists
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Create new user
        hashed_password = hash_password(user_data.password)
        new_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            name=user_data.name,
            role="employee"
        )
        
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        
        return new_user

    def authenticate_user(self, credentials: UserLogin) -> Optional[dict]:
        """Authenticate user and return JWT token"""
        # Find user by email
        user = self.db.query(User).filter(User.email == credentials.email).first()
        
        if not user:
            return None
        
        # Verify password
        if not verify_password(credentials.password, user.hashed_password):
            return None
        
        # Check if user is active
        if not user.is_active:
            return None
        
        # Create access token
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()

    def update_user(self, user_id: str, update_data: dict) -> Optional[User]:
        """Update user information"""
        user = self.db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return None
        
        for key, value in update_data.items():
            if hasattr(user, key):
                setattr(user, key, value)
        
        self.db.commit()
        self.db.refresh(user)
        
        return user

    def deactivate_user(self, user_id: str) -> bool:
        """Deactivate a user"""
        user = self.db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return False
        
        user.is_active = False
        self.db.commit()
        
        return True
