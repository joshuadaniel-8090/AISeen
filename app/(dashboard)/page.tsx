import { auth } from "@/lib/auth";
import { getProjectsByUser, getChecksForProject } from "@/lib/db";
import { getLimits } from "@/lib/plan-gates";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { getUserById } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();
  const user = await getUserById(session!.user!.id!);
  if (!user) return null;

  const limits = getLimits(user.plan as "free" | "indie" | "pro");
  const projects = await getProjectsByUser(user.id);

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <h1 className="text-2xl font-bold">Welcome to AISeen</h1>
        <p className="text-muted-foreground max-w-sm">
          Create your first project to start tracking your brand's AI visibility.
        </p>
        <Button asChild>
          <Link href="/projects">Create a project</Link>
        </Button>
      </div>
    );
  }

  // Aggregate checks across all projects
  const allChecks = (
    await Promise.all(projects.map((p) => getChecksForProject(p.id, limits.historyDays)))
  ).flat();

  const totalChecks = allChecks.length;
  const mentionedChecks = allChecks.filter((c) => c.mentioned).length;
  const visibilityScore = totalChecks > 0 ? Math.round((mentionedChecks / totalChecks) * 100) : 0;

  // Build 7-day trend data
  const days: Record<string, { chatgpt: number[]; perplexity: number[]; google_aio: number[] }> = {};
  for (let i = limits.historyDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    days[key] = { chatgpt: [], perplexity: [], google_aio: [] };
  }
  for (const c of allChecks) {
    const key = c.run_at.split("T")[0];
    if (days[key] && (c.engine_slug === "chatgpt" || c.engine_slug === "perplexity" || c.engine_slug === "google_aio")) {
      days[key][c.engine_slug as "chatgpt" | "perplexity" | "google_aio"].push(c.mentioned ? 1 : 0);
    }
  }
  const trendData = Object.entries(days).map(([date, engines]) => ({
    date,
    chatgpt: engines.chatgpt.length ? Math.round((engines.chatgpt.reduce((a, b) => a + b, 0) / engines.chatgpt.length) * 100) : 0,
    perplexity: engines.perplexity.length ? Math.round((engines.perplexity.reduce((a, b) => a + b, 0) / engines.perplexity.length) * 100) : 0,
    google_aio: engines.google_aio.length ? Math.round((engines.google_aio.reduce((a, b) => a + b, 0) / engines.google_aio.length) * 100) : 0,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tracking {projects.length} project{projects.length !== 1 ? "s" : ""} · {user.plan} plan
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard title="Overall Visibility" value={`${visibilityScore}%`} subtitle="across all engines" trend="neutral" />
        <ScoreCard title="Total Checks" value={String(totalChecks)} subtitle={`last ${limits.historyDays} days`} trend="neutral" />
        <ScoreCard title="Projects" value={String(projects.length)} />
        <ScoreCard title="Plan" value={user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} subtitle={`${limits.maxPrompts} prompts max`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Visibility trend</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={trendData} />
        </CardContent>
      </Card>

      <div>
        <h2 className="font-semibold mb-3">Your projects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="font-medium">{p.brand_name}</div>
                  <div className="text-sm text-muted-foreground">{p.category}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
