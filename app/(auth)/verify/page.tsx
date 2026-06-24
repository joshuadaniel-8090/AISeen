import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="text-4xl">📬</div>
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-muted-foreground max-w-sm">
          We sent a magic link to your inbox. Click it to sign in — it expires in 10 minutes.
        </p>
        <Link href="/login" className="text-sm text-primary underline underline-offset-4">
          Use a different email
        </Link>
      </div>
    </div>
  );
}
