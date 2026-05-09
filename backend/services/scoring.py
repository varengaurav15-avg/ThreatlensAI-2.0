from datetime import datetime

def score_to_severity(score: float) -> str:
    if score >= 9.0: return "CRITICAL"
    if score >= 7.0: return "HIGH"
    if score >= 4.0: return "MEDIUM"
    return "LOW"

def score_threat(threat: dict) -> float:
    cvss  = float(threat.get("cvss_score") or 5.0)
    epss  = float(threat.get("epss_score") or 0.1)
    asset = 1.0 if threat.get("asset_match") else 0.3

    if threat.get("origin") == "ENDPOINT":
        # Happening right now on your machine — max urgency
        recency = 1.0
        epss    = 1.0
        asset   = 1.0
    else:
        created = threat.get("created_at", datetime.utcnow())
        if isinstance(created, str):
            created = datetime.fromisoformat(created)
        hours_old = (datetime.utcnow() - created).total_seconds() / 3600
        recency   = max(0.1, 1.0 - (hours_old / 168))

    raw = (cvss/10 * 0.3) + (epss * 0.3) + (asset * 0.2) + (recency * 0.2)
    return round(raw * 100, 1)