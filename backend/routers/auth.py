import os, logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.user import User
import bcrypt, uuid
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])


def _hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def _check(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


@router.post("/register")
async def register(body: dict, db: AsyncSession = Depends(get_db)):
    email    = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""
    name     = (body.get("name") or "").strip()

    if not email or not password:
        raise HTTPException(400, "Email and password required")
    if len(password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")

    result = await db.execute(select(User).where(User.email == email))
    if result.scalar_one_or_none():
        raise HTTPException(409, "An account with this email already exists")

    token = str(uuid.uuid4())
    user  = User(
        id=str(uuid.uuid4()), email=email, password_h=_hash(password),
        name=name or email.split("@")[0], token=token,
        verified=True, created_at=datetime.utcnow(),
    )
    db.add(user)
    await db.commit()

    return {"success": True, "token": token,
            "user": {"id": user.id, "email": user.email, "name": user.name}}


@router.post("/login")
async def login(body: dict, db: AsyncSession = Depends(get_db)):
    email    = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not email or not password:
        raise HTTPException(400, "Email and password required")

    result = await db.execute(select(User).where(User.email == email))
    user   = result.scalar_one_or_none()

    if not user or not _check(password, user.password_h):
        raise HTTPException(401, "Invalid email or password")

    user.token = str(uuid.uuid4())
    await db.commit()
    return {"success": True, "token": user.token,
            "user": {"id": user.id, "email": user.email, "name": user.name}}


@router.post("/logout")
async def logout(body: dict, db: AsyncSession = Depends(get_db)):
    token  = body.get("token") or ""
    result = await db.execute(select(User).where(User.token == token))
    user   = result.scalar_one_or_none()
    if user:
        user.token = None
        await db.commit()
    return {"success": True}


@router.get("/me")
async def me(token: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.token == token))
    user   = result.scalar_one_or_none()
    if not user:
        raise HTTPException(401, "Invalid or expired session")
    return {"id": user.id, "email": user.email, "name": user.name}
