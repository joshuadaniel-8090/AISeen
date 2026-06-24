import asyncpg
import os
from typing import Optional

_pool: Optional[asyncpg.Pool] = None


async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(os.environ["DATABASE_URL"], min_size=1, max_size=5)
    return _pool


async def fetch(query: str, *args):
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await conn.fetch(query, *args)


async def fetchrow(query: str, *args):
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await conn.fetchrow(query, *args)


async def execute(query: str, *args):
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await conn.execute(query, *args)


async def get_active_projects():
    return await fetch("""
        SELECT p.*, u.email, u.plan, u.alerts_enabled
        FROM projects p
        JOIN users u ON u.id = p.user_id
        WHERE p.active = TRUE
    """)


async def get_prompts_for_project(project_id: str):
    return await fetch(
        "SELECT * FROM prompts WHERE project_id = $1 AND active = TRUE",
        project_id,
    )


async def get_competitors_for_project(project_id: str):
    return await fetch(
        "SELECT * FROM competitors WHERE project_id = $1",
        project_id,
    )


async def get_engine_by_slug(slug: str):
    return await fetchrow("SELECT * FROM engines WHERE slug = $1", slug)


async def insert_check(
    prompt_id: str,
    engine_id: str,
    mentioned: bool,
    cited: bool,
    position: Optional[int],
    sentiment: Optional[str],
    raw_response: str,
):
    return await fetchrow(
        """
        INSERT INTO checks (prompt_id, engine_id, mentioned, cited, position, sentiment, raw_response)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
        """,
        prompt_id,
        engine_id,
        mentioned,
        cited,
        position,
        sentiment,
        raw_response,
    )


async def get_yesterday_check(prompt_id: str, engine_id: str):
    """Get the most recent check from more than 20 hours ago."""
    return await fetchrow(
        """
        SELECT * FROM checks
        WHERE prompt_id = $1 AND engine_id = $2
          AND run_at < NOW() - INTERVAL '20 hours'
        ORDER BY run_at DESC
        LIMIT 1
        """,
        prompt_id,
        engine_id,
    )


async def insert_alert(project_id: str, alert_type: str, message: str):
    await execute(
        "INSERT INTO alerts (project_id, type, message) VALUES ($1, $2, $3)",
        project_id,
        alert_type,
        message,
    )
