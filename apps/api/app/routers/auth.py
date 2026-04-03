from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from ..core.database import get_db
from ..core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)
from ..core.config import settings
from ..models.schemas import UserCreate, UserLogin, UserResponse, Token
from sqlalchemy import text

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    result = db.execute(
        text("SELECT id FROM \"User\" WHERE email = :email"),
        {"email": user_data.email}
    )
    if result.fetchone():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    hashed_password = get_password_hash(user_data.password)
    result = db.execute(
        text("""
            INSERT INTO "User" (id, email, name, password, "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), :email, :name, :password, NOW(), NOW())
            RETURNING id, email
        """),
        {
            "email": user_data.email,
            "name": user_data.name,
            "password": hashed_password
        }
    )
    db.commit()
    user = result.fetchone()

    # Create token
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return Token(access_token=access_token)


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT id, email, password FROM \"User\" WHERE email = :email"),
        {"email": user_data.email}
    )
    user = result.fetchone()

    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return Token(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = db.execute(
        text("SELECT id, email, name, \"createdAt\" FROM \"User\" WHERE id = :id"),
        {"id": current_user["user_id"]}
    )
    user = result.fetchone()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        createdAt=user.createdAt
    )
