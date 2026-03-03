"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { DailyTagScanDataPoint } from "@/lib/types";

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
  const scans = payload.find((p) => p.dataKey === "scans");
  const triggered = payload.find((p) => p.dataKey === "inspectionsTriggered");
  return (
    <div className="rounded border border-border bg-background px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {scans && (
        <p className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-sm shrink-0"
            style={{ backgroundColor: "var(--chart-2)" }}
          />
          Tag Scans:{" "}
          <span className="font-mono font-semibold text-foreground">
            {scans.value}
          </span>
        </p>
      )}
      {triggered && (
        <p className="text-muted-foreground flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-sm shrink-0"
            style={{ backgroundColor: "var(--chart-1)" }}
          />
          Inspections Triggered:{" "}
          <span className="font-mono font-semibold text-foreground">
            {triggered.value}
          </span>
        </p>
      )}
    </div>
  );
};

interface TagScanChartProps {
  data: DailyTagScanDataPoint[];
}

export function TagScanChart({ data }: TagScanChartProps) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -12 }} barGap={2}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.5}
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="scans"
          fill="var(--chart-2)"
          radius={[2, 2, 0, 0]}
          name="Tag Scans"
          fillOpacity={0.85}
        />
        <Bar
          dataKey="inspectionsTriggered"
          fill="var(--chart-1)"
          radius={[2, 2, 0, 0]}
          name="Inspections Triggered"
          fillOpacity={0.85}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
