from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
from _paths import ENV_PATH
import os, json

load_dotenv(dotenv_path=ENV_PATH, override=False)

_llm = None

def get_llm():
    global _llm
    if _llm is None:
        from langchain_openai import ChatOpenAI
        api_key = os.getenv("OPENAI_API_KEY", "")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY not set. Add it in Settings → AI Configuration.")
        _llm = ChatOpenAI(model="gpt-4o", temperature=0.2, api_key=api_key)
    return _llm

def load_prompt(name: str) -> str:
    from _paths import BASE_DIR
    path = os.path.join(BASE_DIR, "prompts", f"{name}.txt")
    with open(path) as f:
        return f.read()

async def summarize_threat(raw_data: str) -> str:
    try:
        chain  = PromptTemplate.from_template(load_prompt("summarizer")) | get_llm()
        result = await chain.ainvoke({"raw_data": raw_data[:3000]})
        return result.content
    except Exception as e:
        return f"AI summary unavailable: {str(e)}"

async def get_ai_verdict(sandbox_report: str) -> dict:
    try:
        chain  = PromptTemplate.from_template(load_prompt("verdict")) | get_llm()
        result = await chain.ainvoke({"sandbox_report": sandbox_report[:3000]})
        lines  = result.content.strip().split("\n")
        return {
            "verdict":     lines[0].strip().upper(),
            "explanation": lines[1].strip() if len(lines) > 1 else ""
        }
    except Exception as e:
        return {"verdict": "UNKNOWN", "explanation": str(e)}

async def generate_morning_brief(threats: list) -> str:
    try:
        chain  = PromptTemplate.from_template(load_prompt("brief")) | get_llm()
        result = await chain.ainvoke({"threats_json": json.dumps(threats[:20])})
        return result.content
    except Exception as e:
        return f"Brief generation failed: {str(e)}"
