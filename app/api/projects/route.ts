import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getProjectsByUser, createProject } from "@/lib/db";
import { getUserById } from "@/lib/db";
import { canAddPrompt, getLimits } from "@/lib/plan-gates";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const projects = await getProjectsByUser(session.user.id);
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getUserById(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const existing = await getProjectsByUser(user.id);
  const limits = getLimits(user.plan as "free" | "indie" | "pro");
  if (existing.length >= 3 && user.plan === "free") {
    return NextResponse.json({ error: "Free plan allows up to 3 projects" }, { status: 403 });
  }

  const { brand_name, domain, category } = await req.json();
  if (!brand_name || !category) {
    return NextResponse.json({ error: "brand_name and category required" }, { status: 400 });
  }

  const project = await createProject(user.id, brand_name, domain || null, category);
  return NextResponse.json(project, { status: 201 });
}
