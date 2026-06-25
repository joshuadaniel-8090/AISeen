import { cn } from "@/lib/utils";

interface ScoreCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
}

export function ScoreCard({ title, value, subtitle, trend }: ScoreCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </p>
      <div className="text-3xl font-bold tabular-nums leading-none">{value}</div>
      {subtitle && (
        <p
          className={cn(
            "text-xs mt-2",
            trend === "up" && "text-emerald-400",
            trend === "down" && "text-red-400",
            (!trend || trend === "neutral") && "text-muted-foreground"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
