"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try it out",
    features: ["3 prompts", "ChatGPT only", "7-day history", "No alerts"],
    cta: "Get started",
    plan: null,
    highlighted: false,
  },
  {
    name: "Indie",
    price: "$19",
    period: "/month",
    description: "For solo founders",
    features: ["25 prompts", "All 3 engines", "7-day history", "Email alerts", "1 competitor"],
    cta: "Upgrade to Indie",
    plan: "indie",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For growing teams",
    features: ["100 prompts", "All 3 engines", "30-day history", "Email alerts", "5 competitors", "CSV export"],
    cta: "Upgrade to Pro",
    plan: "pro",
    highlighted: false,
  },
];

export function PricingSection() {
  const router = useRouter();

  async function handleUpgrade(plan: string | null) {
    if (!plan) {
      router.push("/login");
      return;
    }
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Pricing</h2>
        <p className="text-center text-muted-foreground mb-12">Simple, transparent pricing. No hidden fees.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <Card key={p.name} className={p.highlighted ? "border-primary shadow-lg" : ""}>
              <CardHeader>
                <CardTitle className="text-xl">{p.name}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{p.price}</span>
                  <span className="text-muted-foreground text-sm">{p.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={p.highlighted ? "default" : "outline"}
                  onClick={() => handleUpgrade(p.plan)}
                >
                  {p.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
