"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, ArrowRight } from "lucide-react";

interface Project {
  id: string;
  brand_name: string;
  domain: string | null;
  category: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ brand_name: "", domain: "", category: "" });
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    fetch("/api/projects")
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          setFetchError(body?.error ?? "Failed to load projects. Please refresh.");
          return [];
        }
        return r.json();
      })
      .then(setProjects)
      .catch(() => setFetchError("Could not reach the server. Check your connection."));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setCreateError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setCreateError(body?.error ?? "Failed to create project. Please try again.");
        setSaving(false);
        return;
      }
      const project = await res.json();
      setProjects((prev) => [project, ...prev]);
      setOpen(false);
      setForm({ brand_name: "", domain: "", category: "" });
    } catch {
      setCreateError("Could not reach the server. Check your connection.");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Each project tracks one brand across all AI engines.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              New project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-base">Create a project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-1">
              <div className="space-y-1.5">
                <Label htmlFor="brand" className="text-xs text-muted-foreground">
                  Brand name
                </Label>
                <Input
                  id="brand"
                  required
                  value={form.brand_name}
                  onChange={(e) =>
                    setForm({ ...form, brand_name: e.target.value })
                  }
                  placeholder="e.g. AISeen"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="domain" className="text-xs text-muted-foreground">
                  Domain <span className="text-muted-foreground/60">(optional)</span>
                </Label>
                <Input
                  id="domain"
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  placeholder="e.g. aiseen.io"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs text-muted-foreground">
                  Category
                </Label>
                <Input
                  id="category"
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="e.g. AI visibility tracker"
                />
              </div>
              {createError && (
                <p className="text-xs text-red-400">{createError}</p>
              )}
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Creating…" : "Create project"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {fetchError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-red-400">
          {fetchError}
        </div>
      )}

      {!fetchError && projects.length === 0 ? (
        <div className="rounded-lg border border-border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            No projects yet. Create one to start tracking.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {projects.map((p) => (
            <Link key={p.id} href={`/dashboard/projects/${p.id}`}>
              <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{p.brand_name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {p.domain ?? p.category}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
