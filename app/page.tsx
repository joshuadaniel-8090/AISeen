import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PricingSection } from "@/components/landing/PricingSection";

export default function LandingPage() {
  return (
    <main>
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">AISeen</span>
        <a href="/login" className="text-sm text-muted-foreground hover:text-foreground">
          Sign in
        </a>
      </nav>
      <Hero />
      <HowItWorks />
      <PricingSection />
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AISeen. Built for founders who want to be seen.
      </footer>
    </main>
  );
}
