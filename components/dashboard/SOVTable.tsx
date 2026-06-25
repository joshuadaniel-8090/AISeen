interface SOVRow {
  name: string;
  isBrand: boolean;
  chatgpt: number;
  perplexity: number;
  google_aio: number;
}

const ENGINE_COLORS = {
  chatgpt: "#10b981",
  perplexity: "#6366f1",
  google_aio: "#f59e0b",
};

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{value}%</span>
    </div>
  );
}

export function SOVTable({ rows }: { rows: SOVRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">
        Add competitors to see share-of-voice comparison.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full text-sm min-w-[520px]">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 pr-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[30%]">Brand</th>
            <th className="pb-3 pr-6 text-left text-xs font-medium uppercase tracking-wider w-[23%]">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ENGINE_COLORS.chatgpt }} />
                ChatGPT
              </span>
            </th>
            <th className="pb-3 pr-6 text-left text-xs font-medium uppercase tracking-wider w-[23%]">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ENGINE_COLORS.perplexity }} />
                Perplexity
              </span>
            </th>
            <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider w-[24%]">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ENGINE_COLORS.google_aio }} />
                Google AIO
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-border/50 last:border-0">
              <td className="py-3 pr-6">
                <span className={row.isBrand ? "font-medium text-foreground" : "text-foreground/70"}>
                  {row.name}
                  {row.isBrand && <span className="ml-1.5 text-xs text-primary">(you)</span>}
                </span>
              </td>
              <td className="py-3 pr-6">
                <Bar value={row.chatgpt} color={ENGINE_COLORS.chatgpt} />
              </td>
              <td className="py-3 pr-6">
                <Bar value={row.perplexity} color={ENGINE_COLORS.perplexity} />
              </td>
              <td className="py-3">
                <Bar value={row.google_aio} color={ENGINE_COLORS.google_aio} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
