import os
import asyncio
import resend
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from db import (
    get_active_projects,
    get_prompts_for_project,
    get_competitors_for_project,
    get_engine_by_slug,
    insert_check,
    insert_alert,
    get_yesterday_check,
)
from detector import detect_mention
from engines import openai_runner, perplexity_runner, dataforseo_runner

ENGINE_RUNNERS = {
    "chatgpt": openai_runner.run,
    "perplexity": perplexity_runner.run,
    "google_aio": dataforseo_runner.run,
}

PLAN_ENGINES = {
    "free": ["chatgpt"],
    "indie": ["chatgpt", "perplexity", "google_aio"],
    "pro": ["chatgpt", "perplexity", "google_aio"],
}

resend.api_key = os.environ.get("RESEND_API_KEY", "")


async def run_daily_checks():
    projects = await get_active_projects()
    for project in projects:
        plan = project["plan"]
        allowed_engines = PLAN_ENGINES.get(plan, ["chatgpt"])
        prompts = await get_prompts_for_project(str(project["id"]))
        competitors = await get_competitors_for_project(str(project["id"]))
        competitor_names = [c["name"] for c in competitors]

        for prompt in prompts:
            for slug in allowed_engines:
                engine = await get_engine_by_slug(slug)
                if not engine:
                    continue
                runner = ENGINE_RUNNERS.get(slug)
                if not runner:
                    continue

                try:
                    raw = await runner(prompt["text"])
                except Exception:
                    continue

                detection = detect_mention(raw, project["brand_name"], competitor_names)
                await insert_check(
                    prompt_id=str(prompt["id"]),
                    engine_id=str(engine["id"]),
                    mentioned=detection["mentioned"],
                    cited=detection["cited"],
                    position=detection["position"],
                    sentiment=detection["sentiment"],
                    raw_response=raw,
                )

                if project["alerts_enabled"]:
                    await _maybe_send_alert(project, prompt, engine, detection)


async def _maybe_send_alert(project, prompt, engine, detection):
    yesterday = await get_yesterday_check(str(prompt["id"]), str(engine["id"]))
    if not yesterday:
        return

    prev_mentioned = yesterday["mentioned"]
    curr_mentioned = detection["mentioned"]

    alert_type = None
    message = None

    if not prev_mentioned and curr_mentioned:
        alert_type = "mention_gained"
        message = (
            f'"{project["brand_name"]}" is now mentioned by {engine["name"]} '
            f'for the prompt: "{prompt["text"]}"'
        )
    elif prev_mentioned and not curr_mentioned:
        alert_type = "mention_lost"
        message = (
            f'"{project["brand_name"]}" is no longer mentioned by {engine["name"]} '
            f'for the prompt: "{prompt["text"]}"'
        )

    if alert_type and message:
        await insert_alert(str(project["id"]), alert_type, message)
        if project["email"] and project["alerts_enabled"]:
            _send_email_alert(project["email"], alert_type, message)


def _send_email_alert(email: str, alert_type: str, message: str):
    subject = "You gained AI visibility!" if alert_type == "mention_gained" else "AI visibility change detected"
    try:
        resend.Emails.send({
            "from": "AISeen <alerts@aiseen.io>",
            "to": [email],
            "subject": subject,
            "html": f"<p>{message}</p><p><a href='https://aiseen.io/dashboard'>View dashboard</a></p>",
        })
    except Exception:
        pass


def start_scheduler():
    scheduler = AsyncIOScheduler()
    # 06:00 IST = 00:30 UTC
    scheduler.add_job(
        run_daily_checks,
        CronTrigger(hour=0, minute=30, timezone="UTC"),
        id="daily_checks",
        replace_existing=True,
    )
    scheduler.start()
