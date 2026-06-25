"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";

interface AuditResult {
  engine: string;
  mentioned: boolean;
  cited: boolean;
  position: number | null;
  raw_response: string;
}

const ENGINE_LABELS: Record<string, string> = {
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  google_aio: "Google AI Overview",
};

const ENGINE_COLOR: Record<string, string> = {
  chatgpt: "#10b981",
  perplexity: "#6366f1",
  google_aio: "#f59e0b",
};

export default function AuditPage() {
  const [form, setForm] = useState({ domain: "", brand_name: "", category: "" });
  const [results, setResults] = useState<AuditResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [domainError, setDomainError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDomainError("");
    setResults(null);

    if (!form.domain.includes(".")) {
      setDomainError("Enter a valid domain (e.g. aiseen.io).");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message: string =
        body?.error ??
        (res.status === 429
          ? "You've reached the limit of 3 free audits per day. Sign up for a free account to track daily."
          : res.status === 503
          ? "The AI analysis service is currently unavailable. Please try again later."
          : res.status >= 500
          ? "A server error occurred. Please try again in a moment."
          : "Something went wrong. Please try again.");
      setError(message);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setResults(data.results);
    setLoading(false);
  }

  const anyMentioned = results?.some((r) => r.mentioned);

  return (
    <div className="min-h-dvh">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 pt-32 pb-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Free AI visibility audit</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            See if ChatGPT, Perplexity, and Google AI mention your brand right now.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card p-6 space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="brand" className="text-xs text-muted-foreground">
              Brand name
            </Label>
            <Input
              id="brand"
              required
              value={form.brand_name}
              onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
              placeholder="e.g. AISeen"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="domain" className="text-xs text-muted-foreground">
              Domain
            </Label>
            <Input
              id="domain"
              required
              value={form.domain}
              onChange={(e) => { setForm({ ...form, domain: e.target.value }); setDomainError(""); }}
              placeholder="e.g. aiseen.io"
              className={domainError ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {domainError && <p className="text-xs text-red-400">{domainError}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-xs text-muted-foreground">
              Product category
            </Label>
            <Input
              id="category"
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. AI visibility tracker for SaaS founders"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Running audit…" : "Check my brand"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            3 free audits per day · No account required
          </p>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
        )}

        {results && (
          <div className="mt-8 space-y-5">
            <h2 className="text-base font-semibold">
              Results for{" "}
              <span className="text-primary">{form.brand_name}</span>
            </h2>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                      Engine
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                      Mentioned
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                      Position
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                      Snippet
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.engine} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 font-medium text-sm">
                          <span
                            className="h-1.5 w-1.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: ENGINE_COLOR[r.engine] ?? "#888",
                            }}
                          />
                          {ENGINE_LABELS[r.engine] ?? r.engine}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={r.mentioned ? "success" : "destructive"}>
                          {r.mentioned ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {r.position ?? "—"}
                      </td>
                      <td className="px-4 py-3 max-w-[200px] truncate text-muted-foreground text-xs">
                        {r.raw_response || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 text-center space-y-4">
              <p className="text-sm font-medium leading-relaxed">
                {anyMentioned
                  ? "You're visible in AI — monitor it daily to stay ahead."
                  : "You're not showing up yet — track your progress and get notified when that changes."}
              </p>
              <Button asChild>
                <Link href="/login">Monitor this daily — Sign up free</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
