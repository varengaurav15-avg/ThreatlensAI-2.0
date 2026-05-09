from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
import os, json

load_dotenv()
llm = ChatOpenAI(model="gpt-4o", temperature=0.2)

def load_prompt(name: str) -> str:
    path = os.path.join(os.path.dirname(__file__), f"../prompts/{name}.txt")
    with open(path) as f:
        return f.read()

async def summarize_threat(raw_data: str) -> str:
    try:
        chain  = PromptTemplate.from_template(load_prompt("summarizer")) | llm
        result = await chain.ainvoke({"raw_data": raw_data[:3000]})
        return result.content
    except Exception as e:
        return f"AI summary unavailable: {str(e)}"

async def get_ai_verdict(sandbox_report: str) -> dict:
    try:
        chain  = PromptTemplate.from_template(load_prompt("verdict")) | llm
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
        chain  = PromptTemplate.from_template(load_prompt("brief")) | llm
        result = await chain.ainvoke({"threats_json": json.dumps(threats[:20])})
        return result.content
    except Exception as e:
        return f"Brief generation failed: {str(e)}"