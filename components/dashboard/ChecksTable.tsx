import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const ENGINE_COLOR: Record<string, string> = {
  ChatGPT: "#10b981",
  Perplexity: "#6366f1",
  "Google AI Overview": "#f59e0b",
};

interface Check {
  id: string;
  prompt_text: string;
  engine_name: string;
  run_at: string;
  mentioned: boolean;
  cited: boolean;
  position: number | null;
  sentiment: string | null;
}

export function ChecksTable({ checks }: { checks: Check[] }) {
  if (checks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">
        No checks yet. Add prompts and run your first check.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 pr-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Prompt</th>
            <th className="pb-3 pr-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Engine</th>
            <th className="pb-3 pr-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Mentioned</th>
            <th className="pb-3 pr-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Position</th>
            <th className="pb-3 pr-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Sentiment</th>
            <th className="pb-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Run at</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((c) => (
            <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
              <td className="py-3 pr-4 max-w-[200px] truncate text-foreground/80" title={c.prompt_text}>
                {c.prompt_text}
              </td>
              <td className="py-3 pr-4">
                <span className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: ENGINE_COLOR[c.engine_name] ?? "#888" }}
                  />
                  <span className="text-foreground/80">{c.engine_name}</span>
                </span>
              </td>
              <td className="py-3 pr-4">
                <Badge variant={c.mentioned ? "success" : "destructive"}>
                  {c.mentioned ? "Yes" : "No"}
                </Badge>
              </td>
              <td className="py-3 pr-4 tabular-nums text-muted-foreground">{c.position ?? "—"}</td>
              <td className="py-3 pr-4">
                {c.sentiment ? (
                  <Badge
                    variant={
                      c.sentiment === "positive" ? "success"
                        : c.sentiment === "negative" ? "destructive"
                        : "secondary"
                    }
                  >
                    {c.sentiment}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              <td className="py-3 text-muted-foreground text-xs tabular-nums">{formatDate(c.run_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
