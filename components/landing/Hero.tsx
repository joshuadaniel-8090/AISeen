"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ENGINES = [
  { name: "ChatGPT", dot: "#10b981" },
  { name: "Perplexity", dot: "#6366f1" },
  { name: "Google AIO", dot: "#f59e0b" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".h-eyebrow", { y: 12, autoAlpha: 0, duration: 0.5 })
          .from(".h-headline", { y: 24, autoAlpha: 0, duration: 0.7 }, "-=0.25")
          .from(".h-sub", { y: 16, autoAlpha: 0, duration: 0.6 }, "-=0.4")
          .from(".h-ctas", { y: 12, autoAlpha: 0, duration: 0.5 }, "-=0.3")
          .from(".h-note", { autoAlpha: 0, duration: 0.4 }, "-=0.15")
          .from(".h-engines", { y: 10, autoAlpha: 0, duration: 0.5 }, "-=0.2");
      }, ref);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex flex-col items-center text-center pt-36 pb-28 px-6 overflow-hidden"
    >
      {/* dot grid background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 0%, black 20%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 0%, black 20%, transparent 100%)",
        }}
      />
      {/* glow orb */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[80px] pointer-events-none"
      />

      {/* eyebrow */}
      <div className="h-eyebrow relative z-10 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground mb-8">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        AI visibility monitoring, automated daily
      </div>

      {/* headline */}
      <h1 className="h-headline relative z-10 text-5xl md:text-6xl lg:text-7xl font-bold max-w-3xl leading-[1.06]">
        Does AI recommend
        <br className="hidden md:block" />
        your product?
      </h1>

      {/* subtext */}
      <p className="h-sub relative z-10 mt-6 text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
        AISeen tracks whether ChatGPT, Perplexity, and Google AI mention your brand — daily, automatically, with instant alerts when visibility changes.
      </p>

      {/* CTAs */}
      <div className="h-ctas relative z-10 mt-10 flex gap-3 flex-wrap justify-center">
        <Button size="lg" asChild className="font-medium">
          <Link href="/audit">Check my brand free</Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="font-medium">
          <Link href="/login">Start tracking</Link>
        </Button>
      </div>

      <p className="h-note relative z-10 mt-4 text-xs text-muted-foreground">
        Free plan available · No credit card required
      </p>

      {/* engine badges */}
      <div className="h-engines relative z-10 mt-14 flex items-center gap-2 flex-wrap justify-center">
        <span className="text-xs text-muted-foreground/60 mr-1">Monitoring</span>
        {ENGINES.map((e) => (
          <span
            key={e.name}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card px-2.5 py-1 text-xs font-medium text-foreground/70"
          >
            <span
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: e.dot }}
            />
            {e.name}
          </span>
        ))}
      </div>
    </section>
  );
}
