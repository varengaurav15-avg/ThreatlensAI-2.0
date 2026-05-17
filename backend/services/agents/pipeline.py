"""
ThreatLens AI — Agent Pipeline
Orchestrates analyst → context → correlator flow for a list of threats.
"""
from services.agents.analyst import analyse_threat
from services.agents.context import enrich_context
from services.agents.correlator import correlate


async def run_pipeline(threats: list) -> dict:
    """
    Run the full agent pipeline on a list of threat dicts.
    Returns enriched threats + correlation groups.
    """
    enriched = []
    for threat in threats:
        ctx     = enrich_context(threat)
        verdict = await analyse_threat(ctx)
        ctx["agent_verdict"]      = verdict.get("verdict", "UNKNOWN")
        ctx["agent_explanation"]  = verdict.get("explanation", "")
        enriched.append(ctx)

    groups = correlate(enriched)
    return {"threats": enriched, "correlations": groups}
