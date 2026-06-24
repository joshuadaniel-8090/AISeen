import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

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

interface ChecksTableProps {
  checks: Check[];
}

export function ChecksTable({ checks }: ChecksTableProps) {
  if (checks.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No checks yet. Add prompts and run your first check.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-2 pr-4 font-medium">Prompt</th>
            <th className="pb-2 pr-4 font-medium">Engine</th>
            <th className="pb-2 pr-4 font-medium">Mentioned</th>
            <th className="pb-2 pr-4 font-medium">Position</th>
            <th className="pb-2 pr-4 font-medium">Sentiment</th>
            <th className="pb-2 font-medium">Run at</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((c) => (
            <tr key={c.id} className="border-b last:border-0">
              <td className="py-2 pr-4 max-w-[200px] truncate">{c.prompt_text}</td>
              <td className="py-2 pr-4">{c.engine_name}</td>
              <td className="py-2 pr-4">
                <Badge variant={c.mentioned ? "success" : "destructive"}>
                  {c.mentioned ? "Yes" : "No"}
                </Badge>
              </td>
              <td className="py-2 pr-4">{c.position ?? "—"}</td>
              <td className="py-2 pr-4">
                {c.sentiment ? (
                  <Badge
                    variant={
                      c.sentiment === "positive"
                        ? "success"
                        : c.sentiment === "negative"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {c.sentiment}
                  </Badge>
                ) : (
                  "—"
                )}
              </td>
              <td className="py-2 text-muted-foreground">{formatDate(c.run_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
