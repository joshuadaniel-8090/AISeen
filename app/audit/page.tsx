"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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

export default function AuditPage() {
  const [form, setForm] = useState({ domain: "", brand_name: "", category: "" });
  const [results, setResults] = useState<AuditResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults(null);

    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.status === 429) {
      setError("You've reached the limit of 3 free audits per day. Sign up for a free account to track daily.");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setResults(data.results);
    setLoading(false);
  }

  const anyMentioned = results?.some((r) => r.mentioned);

  return (
    <div className="min-h-screen">
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">AISeen</Link>
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Free AI Visibility Audit</h1>
          <p className="text-muted-foreground mt-2">See if ChatGPT, Perplexity, and Google AI mention your brand — right now.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-6">
          <div className="space-y-1">
            <Label htmlFor="brand">Brand name</Label>
            <Input id="brand" required value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} placeholder="e.g. AISeen" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="domain">Domain</Label>
            <Input id="domain" required value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="e.g. aiseen.io" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="category">Product category</Label>
            <Input id="category" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. AI visibility tracker for SaaS founders" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Running audit…" : "Check my brand"}
          </Button>
        </form>

        {error && <p className="mt-4 text-sm text-destructive text-center">{error}</p>}

        {results && (
          <div className="mt-8 space-y-4">
            <h2 className="font-semibold text-lg">Results for <span className="text-primary">{form.brand_name}</span></h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Engine</th>
                    <th className="text-left px-4 py-3 font-medium">Mentioned</th>
                    <th className="text-left px-4 py-3 font-medium">Position</th>
                    <th className="text-left px-4 py-3 font-medium">Snippet</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.engine} className="border-t">
                      <td className="px-4 py-3 font-medium">{ENGINE_LABELS[r.engine] ?? r.engine}</td>
                      <td className="px-4 py-3">
                        <Badge variant={r.mentioned ? "success" : "destructive"}>
                          {r.mentioned ? "Yes" : "No"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{r.position ?? "—"}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate text-muted-foreground">
                        {r.raw_response || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border rounded-lg p-6 text-center space-y-3 bg-muted/40">
              <p className="font-semibold">
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
