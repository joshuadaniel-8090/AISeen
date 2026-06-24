export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { getLimits } from "@/lib/plan-gates";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const session = await auth();
  const user = await getUserById(session!.user!.id!);
  if (!user) return null;

  const limits = getLimits(user.plan as "free" | "indie" | "pro");

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Email: </span>
            {user.email}
          </div>
          <div className="text-sm flex items-center gap-2">
            <span className="text-muted-foreground">Plan: </span>
            <Badge variant="secondary">{user.plan}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan & Billing</CardTitle>
          <CardDescription>
            You are on the <strong>{user.plan}</strong> plan — {limits.maxPrompts} prompts, {limits.maxCompetitors} competitors, {limits.historyDays}-day history.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          {user.plan === "free" && (
            <>
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="plan" value="indie" />
                <Button type="submit">Upgrade to Indie ($19/mo)</Button>
              </form>
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="plan" value="pro" />
                <Button type="submit" variant="outline">Upgrade to Pro ($49/mo)</Button>
              </form>
            </>
          )}
          {user.plan !== "free" && user.stripe_customer_id && (
            <form action="/api/stripe/portal" method="POST">
              <Button type="submit" variant="outline">Manage billing</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
