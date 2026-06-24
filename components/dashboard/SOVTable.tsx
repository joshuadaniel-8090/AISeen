interface SOVRow {
  name: string;
  isBrand: boolean;
  chatgpt: number;
  perplexity: number;
  google_aio: number;
}

interface SOVTableProps {
  rows: SOVRow[];
}

function pct(val: number) {
  return `${Math.round(val)}%`;
}

export function SOVTable({ rows }: SOVTableProps) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">Add competitors to see share-of-voice comparison.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-2 pr-4 font-medium">Brand</th>
            <th className="pb-2 pr-4 font-medium">ChatGPT</th>
            <th className="pb-2 pr-4 font-medium">Perplexity</th>
            <th className="pb-2 font-medium">Google AIO</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className={`border-b last:border-0 ${row.isBrand ? "font-semibold" : ""}`}>
              <td className="py-2 pr-4">{row.name}{row.isBrand ? " (you)" : ""}</td>
              <td className="py-2 pr-4">{pct(row.chatgpt)}</td>
              <td className="py-2 pr-4">{pct(row.perplexity)}</td>
              <td className="py-2">{pct(row.google_aio)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
