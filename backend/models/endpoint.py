from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer
from database import Base
from datetime import datetime

class Endpoint(Base):
    __tablename__ = "endpoints"
    
    id          = Column(String, primary_key=True)
    name        = Column(String)
    os          = Column(String)
    ip          = Column(String)
    status      = Column(String, default="HEALTHY")  # HEALTHY, WARNING, INCIDENT
    agent_version = Column(String)
    last_seen   = Column(DateTime, default=datetime.utcnow)
    incidents   = Column(Integer, default=0)
    cpu         = Column(Float, default=0.0)
    mem         = Column(Float, default=0.0)