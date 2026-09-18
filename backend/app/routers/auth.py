from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.middleware.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        auth_service = AuthService(db)
        user = auth_service.register_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login and get JWT token"""
    auth_service = AuthService(db)
    result = auth_service.authenticate_user(credentials)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "access_token": result["access_token"],
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@router.put("/me")
async def update_current_user(
    update_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user information"""
    auth_service = AuthService(db)
    user = auth_service.update_user(str(current_user.id), update_data)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {"message": "User updated successfully", "user": user}

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout (client should delete token)"""
    return {"message": "Logged out successfully"}
