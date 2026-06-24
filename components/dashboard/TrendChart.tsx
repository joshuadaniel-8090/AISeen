"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatDate } from "@/lib/utils";

interface DataPoint {
  date: string;
  chatgpt: number;
  perplexity: number;
  google_aio: number;
}

interface TrendChartProps {
  data: DataPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
  const formatted = data.map((d) => ({ ...d, date: formatDate(d.date) }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={formatted} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => `${v}%`} />
        <Legend />
        <Line type="monotone" dataKey="chatgpt" name="ChatGPT" stroke="#10b981" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="perplexity" name="Perplexity" stroke="#6366f1" dot={false} strokeWidth={2} />
        <Line type="monotone" dataKey="google_aio" name="Google AIO" stroke="#f59e0b" dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
