"""
ThreatLens AI — Context Agent
Enriches threat data with additional contextual information.
"""


def enrich_context(threat_data: dict) -> dict:
    """Add contextual fields to a threat dict (asset match, tags, etc.)."""
    enriched = dict(threat_data)
    # Placeholder: real implementation would query asset inventory, CMDB, etc.
    enriched.setdefault("asset_match", False)
    enriched.setdefault("context_tags", [])
    return enriched
