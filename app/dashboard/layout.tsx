export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { SidebarNav } from "@/components/dashboard/SidebarNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-dvh">
      <aside className="w-52 shrink-0 flex flex-col border-r border-border/50 bg-card">
        <div className="px-5 h-14 flex items-center border-b border-border/50">
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight hover:text-primary transition-colors">
            AISeen
          </Link>
        </div>

        <div className="flex-1 py-4 px-3">
          <SidebarNav />
        </div>

        <div className="px-3 pb-4 space-y-1 border-t border-border/50 pt-4">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          </form>
          <div className="flex gap-3 px-2.5 pt-1">
            <Link href="/privacy" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
