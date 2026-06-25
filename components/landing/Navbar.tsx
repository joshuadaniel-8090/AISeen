import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          AISeen
        </Link>
        <nav className="flex items-center gap-5">
          <Link
            href="/audit"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Free audit
          </Link>
          <Button size="sm" variant="outline" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
