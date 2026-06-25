import Link from "next/link";
import { Mail } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <Link
        href="/"
        className="text-sm font-semibold tracking-tight mb-10 text-foreground/60 hover:text-foreground transition-colors"
      >
        AISeen
      </Link>

      <div className="w-full max-w-sm text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          We sent a magic link to your inbox. Click it to sign in — it expires
          in 10 minutes.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Use a different email
        </Link>
      </div>
    </div>
  );
}
