export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import {
  getProjectById,
  getChecksForProject,
  getPromptsByProject,
  getCompetitorsByProject,
} from "@/lib/db";
import { getUserById } from "@/lib/db";
import { getLimits } from "@/lib/plan-gates";
import { ChecksTable } from "@/components/dashboard/ChecksTable";
import { SOVTable } from "@/components/dashboard/SOVTable";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const user = await getUserById(session!.user!.id!);
  if (!user) return null;

  const project = await getProjectById(params.id);
  if (!project || project.user_id !== user.id) return notFound();

  const limits = getLimits(user.plan as "free" | "indie" | "pro");
  const [checks, prompts, competitors] = await Promise.all([
    getChecksForProject(project.id, limits.historyDays),
    getPromptsByProject(project.id),
    getCompetitorsByProject(project.id),
  ]);

  const totalChecks = checks.length;
  const mentionedChecks = checks.filter((c) => c.mentioned).length;
  const visibilityScore =
    totalChecks > 0 ? Math.round((mentionedChecks / totalChecks) * 100) : 0;

  const days: Record<
    string,
    { chatgpt: number[]; perplexity: number[]; google_aio: number[] }
  > = {};
  for (let i = limits.historyDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days[d.toISOString().split("T")[0]] = {
      chatgpt: [],
      perplexity: [],
      google_aio: [],
    };
  }
  for (const c of checks) {
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
  const trendData = Object.entries(days).map(([date, e]) => ({
    date,
    chatgpt: e.chatgpt.length
      ? Math.round(
          (e.chatgpt.reduce((a, b) => a + b, 0) / e.chatgpt.length) * 100
        )
      : 0,
    perplexity: e.perplexity.length
      ? Math.round(
          (e.perplexity.reduce((a, b) => a + b, 0) / e.perplexity.length) *
            100
        )
      : 0,
    google_aio: e.google_aio.length
      ? Math.round(
          (e.google_aio.reduce((a, b) => a + b, 0) / e.google_aio.length) *
            100
        )
      : 0,
  }));

  const engines = ["chatgpt", "perplexity", "google_aio"] as const;
  const brandScores = Object.fromEntries(
    engines.map((eng) => {
      const engChecks = checks.filter((c) => c.engine_slug === eng);
      if (engChecks.length === 0) return [eng, 0];
      const brandMentions = engChecks.filter((c) => c.mentioned).length;
      return [eng, Math.round((brandMentions / engChecks.length) * 100)];
    })
  );
  const sovRows = [
    {
      name: project.brand_name,
      isBrand: true,
      chatgpt: brandScores.chatgpt,
      perplexity: brandScores.perplexity,
      google_aio: brandScores.google_aio,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold">{project.brand_name}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {project.category}
          {project.domain ? ` · ${project.domain}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard
          title="Visibility Score"
          value={`${visibilityScore}%`}
          trend="neutral"
        />
        <ScoreCard title="Total Checks" value={String(totalChecks)} />
        <ScoreCard
          title="Prompts"
          value={String(prompts.length)}
          subtitle={`of ${limits.maxPrompts} max`}
        />
        <ScoreCard
          title="Competitors"
          value={String(competitors.length)}
          subtitle={`of ${limits.maxCompetitors} max`}
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-5">
          Visibility trend
        </h2>
        <TrendChart data={trendData} />
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-5">
          Share of voice
        </h2>
        <SOVTable rows={sovRows} />
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-5">
          Recent checks
        </h2>
        <ChecksTable checks={checks.slice(0, 50)} />
      </div>
    </div>
  );
}
