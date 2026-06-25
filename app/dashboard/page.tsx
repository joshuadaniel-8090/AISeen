export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { getProjectsByUser, getChecksForProject } from "@/lib/db";
import { getLimits } from "@/lib/plan-gates";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { getUserById } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const user = await getUserById(session!.user!.id!);
  if (!user) return null;

  const limits = getLimits(user.plan as "free" | "indie" | "pro");
  const projects = await getProjectsByUser(user.id);

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-5 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <ArrowRight className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Welcome to AISeen</h1>
          <p className="text-muted-foreground text-sm mt-1.5 max-w-xs">
            Create your first project to start tracking your brand&apos;s AI visibility.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects">Create a project</Link>
        </Button>
      </div>
    );
  }

  const allChecks = (
    await Promise.all(
      projects.map((p) => getChecksForProject(p.id, limits.historyDays))
    )
  ).flat();

  const totalChecks = allChecks.length;
  const mentionedChecks = allChecks.filter((c) => c.mentioned).length;
  const visibilityScore =
    totalChecks > 0 ? Math.round((mentionedChecks / totalChecks) * 100) : 0;

  const days: Record<
    string,
    { chatgpt: number[]; perplexity: number[]; google_aio: number[] }
  > = {};
  for (let i = limits.historyDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    days[key] = { chatgpt: [], perplexity: [], google_aio: [] };
  }
  for (const c of allChecks) {
    const key = c.run_at.split("T")[0];
    if (
      days[key] &&
      (c.engine_slug === "chatgpt" ||
        c.engine_slug === "perplexity" ||
        c.engine_slug === "google_aio")
    ) {
      days[key][
        c.engine_slug as "chatgpt" | "perplexity" | "google_aio"
      ].push(c.mentioned ? 1 : 0);
    }
  }
  const trendData = Object.entries(days).map(([date, engines]) => ({
    date,
    chatgpt: engines.chatgpt.length
      ? Math.round(
          (engines.chatgpt.reduce((a, b) => a + b, 0) / engines.chatgpt.length) * 100
        )
      : 0,
    perplexity: engines.perplexity.length
      ? Math.round(
          (engines.perplexity.reduce((a, b) => a + b, 0) /
            engines.perplexity.length) *
            100
        )
      : 0,
    google_aio: engines.google_aio.length
      ? Math.round(
          (engines.google_aio.reduce((a, b) => a + b, 0) /
            engines.google_aio.length) *
            100
        )
      : 0,
  }));

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {projects.length} project{projects.length !== 1 ? "s" : ""} ·{" "}
          <span className="capitalize">{user.plan}</span> plan
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard
          title="Visibility"
          value={`${visibilityScore}%`}
          subtitle="across all engines"
          trend="neutral"
        />
        <ScoreCard
          title="Total Checks"
          value={String(totalChecks)}
          subtitle={`last ${limits.historyDays} days`}
          trend="neutral"
        />
        <ScoreCard title="Projects" value={String(projects.length)} />
        <ScoreCard
          title="Plan"
          value={user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
          subtitle={`${limits.maxPrompts} prompts`}
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-5">
          Visibility trend
        </h2>
        <TrendChart data={trendData} />
      </div>

      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Projects</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {projects.map((p) => (
            <Link key={p.id} href={`/dashboard/projects/${p.id}`}>
              <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{p.brand_name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.category}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
