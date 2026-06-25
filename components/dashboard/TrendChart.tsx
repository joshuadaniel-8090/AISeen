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

const BORDER_COLOR = "hsl(240, 4%, 16%)";
const MUTED_FG = "hsl(240, 5%, 55%)";

export function TrendChart({ data }: TrendChartProps) {
  const formatted = data.map((d) => ({ ...d, date: formatDate(d.date) }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={formatted} margin={{ top: 5, right: 16, left: -8, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={BORDER_COLOR} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: MUTED_FG }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: MUTED_FG }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(240, 6%, 7%)",
            border: `1px solid ${BORDER_COLOR}`,
            borderRadius: "0.5rem",
            fontSize: "12px",
            color: "hsl(0, 0%, 98%)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
          formatter={(v: number) => [`${v}%`]}
          labelStyle={{ color: MUTED_FG, marginBottom: 4 }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", color: MUTED_FG, paddingTop: "12px" }}
        />
        <Line
          type="monotone"
          dataKey="chatgpt"
          name="ChatGPT"
          stroke="#10b981"
          dot={false}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="perplexity"
          name="Perplexity"
          stroke="#6366f1"
          dot={false}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="google_aio"
          name="Google AIO"
          stroke="#f59e0b"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
