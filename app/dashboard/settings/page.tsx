export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { getLimits } from "@/lib/plan-gates";
import { Button } from "@/components/ui/button";

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  indie: "Indie",
  pro: "Pro",
};

export default async function SettingsPage() {
  const session = await auth();
  const user = await getUserById(session!.user!.id!);
  if (!user) return null;

  const limits = getLimits(user.plan as "free" | "indie" | "pro");
  const planLabel = PLAN_LABELS[user.plan] ?? user.plan;

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and billing.</p>
      </div>

      {/* Account */}
      <div className="rounded-lg border border-border bg-card">
        <div className="px-6 py-4 border-b border-border/50">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account</h2>
        </div>
        <div className="px-6 py-2 divide-y divide-border/50">
          <Row label="Email" value={user.email} />
          <Row label="Plan">
            <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5">
              {planLabel}
            </span>
          </Row>
        </div>
      </div>

      {/* Plan & Billing */}
      <div className="rounded-lg border border-border bg-card">
        <div className="px-6 py-4 border-b border-border/50">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Plan &amp; Billing</h2>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Limit label="Prompts" value={limits.maxPrompts === Infinity ? "Unlimited" : String(limits.maxPrompts)} />
            <Limit label="Competitors" value={limits.maxCompetitors === Infinity ? "Unlimited" : String(limits.maxCompetitors)} />
            <Limit label="History" value={`${limits.historyDays}d`} />
          </div>

          {user.plan === "free" && (
            <div className="flex flex-wrap gap-2 pt-1">
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="plan" value="indie" />
                <Button type="submit" size="sm">Upgrade to Indie · $19/mo</Button>
              </form>
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="plan" value="pro" />
                <Button type="submit" variant="outline" size="sm">Upgrade to Pro · $49/mo</Button>
              </form>
            </div>
          )}

          {user.plan !== "free" && user.stripe_customer_id && (
            <form action="/api/stripe/portal" method="POST">
              <Button type="submit" variant="outline" size="sm">Manage billing</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children ?? <span className="text-sm text-foreground">{value}</span>}
    </div>
  );
}

function Limit({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/50 bg-background/50 px-3 py-2.5 text-center">
      <div className="text-lg font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
