import httpx
import os
import base64
import json


async def run(prompt_text: str) -> str:
    login = os.environ["DATAFORSEO_LOGIN"]
    password = os.environ["DATAFORSEO_PASSWORD"]
    credentials = base64.b64encode(f"{login}:{password}".encode()).decode()

    payload = [
        {
            "keyword": prompt_text,
            "location_code": 2840,  # United States
            "language_code": "en",
            "device": "desktop",
            "os": "windows",
        }
    ]

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://api.dataforseo.com/v3/serp/google/organic/live/advanced",
            headers={
                "Authorization": f"Basic {credentials}",
                "Content-Type": "application/json",
            },
            content=json.dumps(payload),
        )
        response.raise_for_status()
        data = response.json()

    tasks = data.get("tasks", [])
    if not tasks or tasks[0].get("status_code") != 20000:
        return ""

    items = tasks[0].get("result", [{}])[0].get("items", [])

    for item in items:
        if item.get("type") == "featured_snippet" or item.get("type") == "answer_box":
            return item.get("description", "") or item.get("text", "")

    # Fall back to AI overview if present
    for item in items:
        if "ai_overview" in item.get("type", "").lower():
            return str(item)

    return ""
