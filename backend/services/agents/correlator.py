"""
ThreatLens AI — Correlator Agent
Groups related threats and identifies attack patterns.
"""


def correlate(threats: list) -> list:
    """
    Group threats by shared CVE, IP, or MITRE tactic.
    Returns a list of correlation groups (each a list of threat IDs).
    """
    if not threats:
        return []

    groups: dict[str, list] = {}
    for t in threats:
        key = t.get("cve") or t.get("source", "unknown")
        groups.setdefault(key, []).append(t.get("id", ""))

    return [ids for ids in groups.values() if len(ids) > 1]
