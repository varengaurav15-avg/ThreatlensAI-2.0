from sqlalchemy import Column, String, DateTime, Boolean
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id           = Column(String, primary_key=True)
    email        = Column(String, unique=True, nullable=False, index=True)
    password_h   = Column(String, nullable=False)   # bcrypt hash
    name         = Column(String, nullable=True)
    token        = Column(String, nullable=True)     # session token
    created_at   = Column(DateTime, default=datetime.utcnow)
    is_active    = Column(Boolean, default=True)
    verified     = Column(Boolean, default=False)    # email verified
    verify_token = Column(String, nullable=True)     # one-time email verification token
