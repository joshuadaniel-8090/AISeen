import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

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
    return NextResponse.json(
      { error: "Brand name, domain, and category are required." },
      { status: 400 }
    );
  }

  const fastapiUrl = process.env.FASTAPI_URL ?? "http://localhost:8001";

  let res: Response;
  try {
    res = await fetch(`${fastapiUrl}/audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, brand_name, category, prompt_text }),
    });
  } catch (err) {
    const isConnRefused =
      err instanceof Error &&
      (err.message.includes("ECONNREFUSED") ||
        err.message.includes("fetch failed") ||
        (err as NodeJS.ErrnoException).code === "ECONNREFUSED");

    if (isConnRefused) {
      return NextResponse.json(
        {
          error:
            "The AI analysis service is not reachable. Make sure the backend is running (FASTAPI_URL).",
        },
        { status: 503 }
      );
    }

    console.error("[audit] fetch error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }

  if (!res.ok) {
    let detail = `Audit service returned status ${res.status}.`;
    try {
      const json = await res.json();
      if (json?.detail || json?.error) detail = json.detail ?? json.error;
    } catch {
      // ignore parse errors
    }
    return NextResponse.json({ error: detail }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
