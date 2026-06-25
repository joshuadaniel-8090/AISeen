"use client";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    features: [
      "25 prompts",
      "All 3 engines",
      "7-day history",
      "Email alerts",
      "1 competitor",
    ],
    cta: "Upgrade to Indie",
    plan: "indie",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For growing teams",
    features: [
      "100 prompts",
      "All 3 engines",
      "30-day history",
      "Email alerts",
      "5 competitors",
      "CSV export",
    ],
    cta: "Upgrade to Pro",
    plan: "pro",
    highlighted: false,
  },
];

export function PricingSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".pricing-card", {
          y: 20,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".pricing-grid",
            start: "top 80%",
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  async function handleUpgrade(plan: string | null) {
    if (!plan) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body?.error ?? "Could not start checkout. Please try again.");
        return;
      }
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      alert("Could not reach the server. Check your connection and try again.");
    }
  }

  return (
    <section ref={sectionRef} className="py-24 px-6 border-t border-border/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Simple pricing</h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base">
            No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="pricing-grid grid md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`pricing-card rounded-xl border p-6 flex flex-col gap-5 ${
                p.highlighted
                  ? "border-primary/40 bg-primary/5 shadow-[0_0_80px_-20px_hsl(var(--primary)/0.3)]"
                  : "border-border bg-card"
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-semibold">{p.name}</span>
                  {p.highlighted && (
                    <span className="text-xs rounded-full bg-primary/15 text-primary px-2 py-0.5 font-medium">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{p.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tabular-nums">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.period}</span>
                </div>
              </div>

              <ul className="flex flex-col gap-2.5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
