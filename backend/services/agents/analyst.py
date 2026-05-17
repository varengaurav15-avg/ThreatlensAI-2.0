"""
ThreatLens AI — Analyst Agent
Requires OPENAI_API_KEY to perform LLM-backed analysis.
Without a key, functions return safe default responses.
"""
import os
from services.llm import get_llm


async def analyse_threat(threat_data: dict) -> dict:
    """Run AI analysis on a threat dict. Returns verdict + explanation."""
    try:
        llm = get_llm()
        prompt = (
            f"Analyse this cybersecurity threat and give a SHORT verdict "
            f"(CRITICAL / HIGH / MEDIUM / LOW) and one-sentence reason.\n\n"
            f"Threat: {str(threat_data)[:2000]}"
        )
        result = await llm.ainvoke(prompt)
        lines  = result.content.strip().split("\n")
        return {
            "verdict":     lines[0].strip().upper() if lines else "UNKNOWN",
            "explanation": lines[1].strip() if len(lines) > 1 else "",
        }
    except Exception as e:
        return {"verdict": "UNKNOWN", "explanation": f"Analyst unavailable: {e}"}
