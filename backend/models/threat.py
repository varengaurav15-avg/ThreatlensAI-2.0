from sqlalchemy import Column, String, Float, Boolean, DateTime, Text
from database import Base
from datetime import datetime

class Threat(Base):
    __tablename__ = "threats"
    
    id             = Column(String, primary_key=True)
    cve            = Column(String, nullable=True)
    title          = Column(String, nullable=False)
    origin         = Column(String, default="GLOBAL")   # GLOBAL or ENDPOINT
    source         = Column(String)                      # NVD, OTX, AGENT etc
    severity       = Column(String, default="MEDIUM")
    cvss_score     = Column(Float,  default=0.0)
    epss_score     = Column(Float,  default=0.0)
    priority_score = Column(Float,  default=0.0)
    asset_match    = Column(Boolean, default=False)
    mitre_tags     = Column(Text,   default="[]")        # JSON string
    ai_summary     = Column(Text,   nullable=True)
    raw_data       = Column(Text,   nullable=True)
    machine        = Column(String, nullable=True)       # for endpoint events
    resolved       = Column(Boolean, default=False)
    auto_responded = Column(Boolean, default=False)
    response_log   = Column(Text,   default="[]")        # JSON string
    created_at     = Column(DateTime, default=datetime.utcnow)