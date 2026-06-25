export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { SidebarNav } from "@/components/dashboard/SidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-dvh">
      <aside className="w-52 border-r border-border/50 flex flex-col py-5 px-3 shrink-0 bg-card">
        <div className="px-2.5 mb-7">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            AISeen
          </Link>
        </div>

        <div className="flex-1">
          <SidebarNav />
        </div>

        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </form>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
