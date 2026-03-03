"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { inspectionSchedules, sites } from "@/data/mock-data";
import type { InspectionSchedule, ScheduleStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Download,
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CalendarX,
  SkipForward,
} from "lucide-react";

// ─── Status Badge ─────────────────────────────────────────────────────────────

type StatusConfig = {
  label: string;
  colorClass: string;
  icon: React.ReactNode;
};

function ScheduleStatusBadge({ status }: { status: ScheduleStatus }) {
  const config: Record<ScheduleStatus, StatusConfig> = {
    scheduled: {
      label: "Scheduled",
      colorClass: "text-muted-foreground bg-muted",
      icon: <CalendarClock className="w-3 h-3" />,
    },
    due_today: {
      label: "Due Today",
      colorClass:
        "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
      icon: <Clock className="w-3 h-3" />,
    },
    overdue: {
      label: "Overdue",
      colorClass: "text-destructive bg-destructive/10",
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    completed: {
      label: "Completed",
      colorClass:
        "text-[color:var(--success)] bg-[color:var(--success)]/10",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    skipped: {
      label: "Skipped",
      colorClass: "text-muted-foreground bg-muted",
      icon: <SkipForward className="w-3 h-3" />,
    },
  };

  const { label, colorClass, icon } = config[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border-0 rounded-sm gap-1 whitespace-nowrap",
        colorClass
      )}
    >
      {icon}
      {label}
    </Badge>
  );
}

// ─── Date display helpers ─────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverdue(scheduledDate: string, status: ScheduleStatus): boolean {
  return status === "overdue";
}

function getSiteLabel(siteId: string): string {
  const site = sites.find((s) => s.id === siteId);
  if (!site) return siteId;
  return site.name.split(" — ")[0];
}

function frequencyLabel(freq: string): string {
  const map: Record<string, string> = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    quarterly: "Quarterly",
    semi_annual: "Semi-Annual",
    annual: "Annual",
    pre_use: "Pre-Use",
  };
  return map[freq] ?? freq;
}

// ─── Status stats bar ─────────────────────────────────────────────────────────

function StatusSummaryBar({
  data,
}: {
  data: InspectionSchedule[];
}) {
  const counts = {
    overdue: data.filter((s) => s.status === "overdue").length,
    due_today: data.filter((s) => s.status === "due_today").length,
    scheduled: data.filter((s) => s.status === "scheduled").length,
    completed: data.filter((s) => s.status === "completed").length,
    skipped: data.filter((s) => s.status === "skipped").length,
  };

  const pills = [
    {
      label: "Overdue",
      count: counts.overdue,
      colorClass: "text-destructive bg-destructive/10 border-destructive/20",
    },
    {
      label: "Due Today",
      count: counts.due_today,
      colorClass:
        "text-[color:var(--warning)] bg-[color:var(--warning)]/10 border-[color:var(--warning)]/20",
    },
    {
      label: "Scheduled",
      count: counts.scheduled,
      colorClass: "text-muted-foreground bg-muted border-border",
    },
    {
      label: "Completed",
      count: counts.completed,
      colorClass:
        "text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/20",
    },
  ].filter((p) => p.count > 0);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {pills.map((p) => (
        <div
          key={p.label}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-xs font-medium",
            p.colorClass
          )}
        >
          <span className="tabular-nums font-semibold">{p.count}</span>
          {p.label}
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: ScheduleStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "overdue", label: "Overdue" },
  { value: "due_today", label: "Due Today" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "skipped", label: "Skipped" },
];

const TYPE_OPTIONS = [
  "all",
  "Routine Equipment Inspection",
  "Pre-Operation Check",
  "LOTO Verification Inspection",
  "Fire Safety Walk",
  "PPE Condition Inspection",
  "Pre-Startup Safety Review",
];

export default function InspectionSchedulePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | "all">(
    "all"
  );
  const [typeFilter, setTypeFilter] = useState("all");

  const displayed = useMemo(() => {
    return inspectionSchedules
      .filter((s) => {
        const matchesStatus =
          statusFilter === "all" || s.status === statusFilter;
        const matchesType =
          typeFilter === "all" || s.inspectionType === typeFilter;
        const q = search.toLowerCase();
        const matchesSearch =
          q === "" ||
          s.assetName.toLowerCase().includes(q) ||
          s.assignedInspectorName.toLowerCase().includes(q) ||
          s.inspectionType.toLowerCase().includes(q) ||
          (s.regulatoryStandard ?? "").toLowerCase().includes(q);
        return matchesStatus && matchesType && matchesSearch;
      })
      .sort((a, b) => {
        // Priority: overdue first, then due_today, then by scheduledDate asc
        const priority: Record<ScheduleStatus, number> = {
          overdue: 0,
          due_today: 1,
          scheduled: 2,
          in_progress: 2,
          completed: 3,
          skipped: 4,
        } as Record<ScheduleStatus, number>;
        const pa = priority[a.status] ?? 5;
        const pb = priority[b.status] ?? 5;
        if (pa !== pb) return pa - pb;
        return (
          new Date(a.scheduledDate).getTime() -
          new Date(b.scheduledDate).getTime()
        );
      });
  }, [search, statusFilter, typeFilter]);

  // Group by date for display
  const grouped = useMemo(() => {
    const groups: Record<string, InspectionSchedule[]> = {};
    for (const s of displayed) {
      const dateKey = s.scheduledDate;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(s);
    }
    return Object.entries(groups).sort(([a], [b]) =>
      new Date(a).getTime() - new Date(b).getTime()
    );
  }, [displayed]);

  function dateGroupLabel(dateStr: string): string {
    const TODAY = "2026-03-02";
    const YESTERDAY = "2026-03-01";
    if (dateStr === TODAY) return "Today — " + formatDate(dateStr);
    if (dateStr < TODAY)
      return "Past Due — " + formatDate(dateStr);
    return formatDate(dateStr);
  }

  function isGroupOverdue(dateStr: string): boolean {
    return dateStr < "2026-03-02";
  }

  return (
    <div className="p-4 space-y-4">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Inspection Schedule
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Upcoming and overdue inspections across all sites and assets.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
          <Download className="w-3.5 h-3.5" />
          Export Schedule
        </Button>
      </div>

      {/* ── Status Summary ── */}
      <StatusSummaryBar data={inspectionSchedules} />

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search assets, inspectors, types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as ScheduleStatus | "all")}
        >
          <SelectTrigger className="h-8 w-40 text-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-8 w-56 text-sm">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>
                {t === "all" ? "All Inspection Types" : t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
          {displayed.length} of {inspectionSchedules.length} inspections
        </span>
      </div>

      {/* ── Grouped List ── */}
      {displayed.length === 0 ? (
        <div className="rounded-sm border border-border flex items-center justify-center h-28 text-sm text-muted-foreground">
          No inspections match this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(([dateKey, rows]) => (
            <div key={dateKey}>
              {/* Date group header */}
              <div
                className={cn(
                  "flex items-center gap-2 mb-1 px-1",
                  isGroupOverdue(dateKey)
                    ? "text-destructive"
                    : dateKey === "2026-03-02"
                    ? "text-[color:var(--warning)]"
                    : "text-muted-foreground"
                )}
              >
                {isGroupOverdue(dateKey) && (
                  <CalendarX className="w-3.5 h-3.5" />
                )}
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {dateGroupLabel(dateKey)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({rows.length})
                </span>
              </div>

              <div className="rounded-sm border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Asset
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Inspection Type
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Frequency
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Assigned Inspector
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Last Completed
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Site
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Std.
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((sched) => (
                      <TableRow
                        key={sched.id}
                        className={cn(
                          "hover:bg-[color:var(--surface-hover)] transition-colors duration-75 text-sm",
                          sched.status === "overdue" && "bg-destructive/4"
                        )}
                      >
                        <TableCell className="text-xs font-medium max-w-[200px]">
                          <span className="line-clamp-2">{sched.assetName}</span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[180px]">
                          <span className="line-clamp-1">
                            {sched.inspectionType}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {frequencyLabel(sched.frequency)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {sched.assignedInspectorName}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                          {sched.lastCompletedAt
                            ? formatDate(sched.lastCompletedAt)
                            : <span className="italic text-muted-foreground/60">Never</span>}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {getSiteLabel(sched.siteId)}
                        </TableCell>
                        <TableCell>
                          <ScheduleStatusBadge status={sched.status} />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap">
                          {sched.regulatoryStandard ?? "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
