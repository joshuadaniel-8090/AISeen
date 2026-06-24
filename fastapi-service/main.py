import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from db import get_pool, get_engine_by_slug, insert_check, get_prompts_for_project
from detector import detect_mention
from engines import openai_runner, perplexity_runner, dataforseo_runner
from cron import start_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_pool()
    start_scheduler()
    yield


app = FastAPI(title="AISeen API", lifespan=lifespan)

ENGINE_RUNNERS = {
    "chatgpt": openai_runner.run,
    "perplexity": perplexity_runner.run,
    "google_aio": dataforseo_runner.run,
}


class RunCheckRequest(BaseModel):
    prompt_id: str
    brand_name: str
    competitors: list[str] = []
    engine_slugs: list[str] = ["chatgpt"]
    prompt_text: str


class AuditRequest(BaseModel):
    domain: str
    brand_name: str
    category: str
    prompt_text: str | None = None


@app.post("/run-check")
async def run_check(body: RunCheckRequest):
    results = []
    for slug in body.engine_slugs:
        runner = ENGINE_RUNNERS.get(slug)
        if not runner:
            continue
        engine = await get_engine_by_slug(slug)
        if not engine:
            continue
        try:
            raw = await runner(body.prompt_text)
        except Exception as e:
            raw = f"[error: {e}]"

        detection = detect_mention(raw, body.brand_name, body.competitors)
        await insert_check(
            prompt_id=body.prompt_id,
            engine_id=str(engine["id"]),
            mentioned=detection["mentioned"],
            cited=detection["cited"],
            position=detection["position"],
            sentiment=detection["sentiment"],
            raw_response=raw,
        )
        results.append(
            {
                "engine": slug,
                "mentioned": detection["mentioned"],
                "cited": detection["cited"],
                "position": detection["position"],
                "sentiment": detection["sentiment"],
            }
        )
    return {"checks": results}


@app.post("/run-all")
async def run_all(x_cron_secret: str = Header(None)):
    if x_cron_secret != os.environ.get("CRON_SECRET"):
        raise HTTPException(status_code=403, detail="Forbidden")
    from cron import run_daily_checks
    await run_daily_checks()
    return {"status": "ok"}


@app.post("/audit")
async def audit(body: AuditRequest):
    prompt_text = body.prompt_text or f"best {body.category}"
    results = []
    for slug, runner in ENGINE_RUNNERS.items():
        try:
            raw = await runner(prompt_text)
        except Exception as e:
            raw = f"[error: {e}]"

        detection = detect_mention(raw, body.brand_name, [])
        results.append(
            {
                "engine": slug,
                "mentioned": detection["mentioned"],
                "cited": detection["cited"],
                "position": detection["position"],
                "raw_response": raw[:500] if raw else "",
            }
        )
    return {"results": results}


@app.get("/health")
async def health():
    return {"status": "ok"}
