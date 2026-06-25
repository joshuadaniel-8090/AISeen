import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PricingSection } from "@/components/landing/PricingSection";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <Hero />
        <HowItWorks />
        <PricingSection />
      </main>
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/50 tracking-tight">AISeen</span>
          <span>© 2025 AISeen. Built for founders who want to be seen.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
