"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { InspectionCompletionDataPoint } from "@/lib/types";

interface TooltipEntry {
  dataKey?: string;
  value?: number | string;
  name?: string;
  color?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const rate = payload.find((p) => p.dataKey === "completionRate");
  const completed = payload.find((p) => p.dataKey === "completed");
  const scheduled = payload.find((p) => p.dataKey === "scheduled");
  return (
    <div className="rounded border border-border bg-background px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {rate && (
        <p className="text-muted-foreground">
          Completion Rate:{" "}
          <span className="font-mono font-semibold text-foreground">
            {Number(rate.value).toFixed(1)}%
          </span>
        </p>
      )}
      {completed && scheduled && (
        <p className="text-muted-foreground">
          {completed.value} / {scheduled.value} completed
        </p>
      )}
    </div>
  );
};

interface ComplianceTrendChartProps {
  data: InspectionCompletionDataPoint[];
}

export function ComplianceTrendChart({ data }: ComplianceTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <defs>
          <linearGradient id="fillCompletionRate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.20} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.5}
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: string) => v.split(" ")[0]}
        />
        <YAxis
          domain={[70, 100]}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}%`}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} />
        {/* Target line at 90% */}
        <ReferenceLine
          y={90}
          stroke="var(--success)"
          strokeDasharray="4 4"
          strokeOpacity={0.6}
          label={{
            value: "Target 90%",
            position: "insideTopRight",
            fontSize: 10,
            fill: "var(--success)",
          }}
        />
        <Area
          type="monotone"
          dataKey="completionRate"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#fillCompletionRate)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0, fill: "var(--chart-1)" }}
          name="Completion Rate"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
