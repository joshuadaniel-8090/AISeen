import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="flex flex-col items-center text-center py-24 px-4">
      <h1 className="text-5xl font-extrabold tracking-tight max-w-3xl leading-tight">
        Does AI recommend your product?
      </h1>
      <p className="mt-6 text-xl text-muted-foreground max-w-xl">
        AISeen tracks whether ChatGPT, Perplexity, and Google AI Overviews mention your brand — daily, automatically, with alerts when visibility changes.
      </p>
      <div className="mt-10 flex gap-4 flex-wrap justify-center">
        <Button size="lg" asChild>
          <Link href="/audit">Check my brand free</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/login">Sign up</Link>
        </Button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">No credit card required. Free plan available.</p>
    </section>
  );
}
