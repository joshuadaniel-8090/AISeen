"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "Add your brand",
    description:
      "Enter your brand name, domain, and product category. We auto-generate the prompts people actually ask AI.",
  },
  {
    num: "02",
    title: "We run prompts daily",
    description:
      "AISeen queries ChatGPT, Perplexity, and Google AI every morning and records whether you appear.",
  },
  {
    num: "03",
    title: "Get instant alerts",
    description:
      "When your visibility changes — gained or lost — we email you immediately so you can act fast.",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".how-step", {
          y: 24,
          autoAlpha: 0,
          duration: 0.65,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".how-grid",
            start: "top 78%",
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 border-t border-border/50"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
          <p className="mt-3 text-muted-foreground text-sm md:text-base">
            Set up in under two minutes. Results every morning.
          </p>
        </div>

        <div className="how-grid grid md:grid-cols-3 gap-10 lg:gap-16">
          {steps.map((s) => (
            <div key={s.num} className="how-step">
              <div className="text-5xl font-bold tabular-nums text-muted-foreground/20 mb-5 leading-none">
                {s.num}
              </div>
              <h3 className="text-base font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
