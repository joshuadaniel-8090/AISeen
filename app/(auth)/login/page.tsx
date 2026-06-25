"use client";
import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import gsap from "gsap";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".login-card", {
          y: 20,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
        });
      }, ref);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("resend", { email, callbackUrl: "/dashboard" });
    setLoading(false);
  }

  return (
    <div
      ref={ref}
      className="min-h-dvh flex flex-col items-center justify-center px-6 py-12"
    >
      {/* minimal logo mark */}
      <Link href="/" className="text-sm font-semibold tracking-tight mb-10 text-foreground/60 hover:text-foreground transition-colors">
        AISeen
      </Link>

      <div className="login-card w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="text-muted-foreground text-sm mt-1">
            We&apos;ll send a magic link to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs text-muted-foreground">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send magic link"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          No password needed. Check your inbox after submitting.
        </p>
      </div>
    </div>
  );
}
