export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { getLimits } from "@/lib/plan-gates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const session = await auth();
  const user = await getUserById(session!.user!.id!);
  if (!user) return null;

  const limits = getLimits(user.plan as "free" | "indie" | "pro");

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account and billing.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-medium">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Email</span>
            <span className="text-foreground">{user.email}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Plan</span>
            <Badge variant="secondary" className="capitalize">
              {user.plan}
            </Badge>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div>
          <h2 className="text-sm font-medium">Plan &amp; Billing</h2>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="capitalize">{user.plan}</span> plan —{" "}
            {limits.maxPrompts} prompts · {limits.maxCompetitors} competitors ·{" "}
            {limits.historyDays}-day history
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {user.plan === "free" && (
            <>
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="plan" value="indie" />
                <Button type="submit" size="sm">
                  Upgrade to Indie · $19/mo
                </Button>
              </form>
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="plan" value="pro" />
                <Button type="submit" variant="outline" size="sm">
                  Upgrade to Pro · $49/mo
                </Button>
              </form>
            </>
          )}
          {user.plan !== "free" && user.stripe_customer_id && (
            <form action="/api/stripe/portal" method="POST">
              <Button type="submit" variant="outline" size="sm">
                Manage billing
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
