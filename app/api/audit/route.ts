import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// Simple in-memory rate limiter: 3 audits per IP per 24h
const ipMap = new Map<string, { count: number; resetAt: number }>();

function getRateLimitEntry(ip: string) {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || entry.resetAt < now) {
    const fresh = { count: 0, resetAt: now + 24 * 60 * 60 * 1000 };
    ipMap.set(ip, fresh);
    return fresh;
  }
  return entry;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const entry = getRateLimitEntry(ip);

  if (entry.count >= 3) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Max 3 audits per day." },
      { status: 429 }
    );
  }

  entry.count++;

  const body = await req.json();
  const { domain, brand_name, category, prompt_text } = body;

  if (!domain || !brand_name || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const fastapiUrl = process.env.FASTAPI_URL ?? "http://localhost:8001";
  const res = await fetch(`${fastapiUrl}/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain, brand_name, category, prompt_text }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Audit service error" }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
