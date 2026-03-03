"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wifi,
  ShieldAlert,
} from "lucide-react";
import {
  dashboardStats,
  findings,
  inspectionSchedules,
  inspectionCompletionByMonth,
  tagScanActivity7d,
} from "@/data/mock-data";
import type { Finding, InspectionSchedule } from "@/lib/types";

// ── SSR-safe chart imports ────────────────────────────────────────────────────

const ComplianceTrendChart = dynamic(
  () =>
    import("@/components/dashboard/compliance-trend-chart").then(
      (m) => m.ComplianceTrendChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] bg-muted/30 animate-pulse rounded" />
    ),
  }
);

const TagScanChart = dynamic(
  () =>
    import("@/components/dashboard/tag-scan-chart").then(
      (m) => m.TagScanChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[140px] bg-muted/30 animate-pulse rounded" />
    ),
  }
);

// ── useCountUp hook ───────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 900, isFloat = false) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;
            setCount(
              isFloat ? Math.round(current * 10) / 10 : Math.floor(current)
            );
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, isFloat]);

  return { count, ref };
}

// ── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  isFloat?: boolean;
  change?: number;
  description?: string;
  indicator?: "leading" | "lagging";
  severity?: "normal" | "warning" | "critical" | "success";
  index: number;
}

function StatCard({
  title,
  value,
  suffix = "",
  isFloat = false,
  change,
  description,
  indicator,
  severity = "normal",
  index,
}: StatCardProps) {
  const { count, ref } = useCountUp(value, 900 + index * 80, isFloat);
  const displayValue = isFloat ? count.toFixed(1) : count.toLocaleString();

  const leftBorder = {
    normal: "",
    warning: "border-l-2 border-l-warning",
    critical: "border-l-2 border-l-destructive",
    success: "border-l-2 border-l-success",
  }[severity];

  return (
    <div
      ref={ref}
      className={cn("linear-card p-4 animate-fade-up-in", leftBorder)}
      style={{
        animationDelay: `${index * 50}ms`,
        animationDuration: "150ms",
        animationFillMode: "both",
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <p className="text-xs font-medium text-muted-foreground leading-snug">
          {title}
        </p>
        {indicator && (
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-mono shrink-0 pt-0.5">
            {indicator}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-bold font-mono tabular-nums text-foreground leading-none">
          {displayValue}
          {suffix}
        </span>
        {change !== undefined && (
          <span
            className={cn(
              "text-xs font-mono mb-0.5 flex items-center gap-0.5",
              change > 0 ? "text-destructive" : "text-success"
            )}
          >
            {change > 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change > 0 ? "+" : ""}
            {isFloat ? change.toFixed(1) : change}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
          {description}
        </p>
      )}
    </div>
  );
}

// ── Status badge helpers ──────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: Finding["severity"] }) {
  const cfg = {
    critical: {
      label: "Critical",
      cls: "bg-destructive/10 text-destructive border-destructive/20",
    },
    high: {
      label: "High",
      cls: "bg-warning/10 text-warning border-warning/20",
    },
    medium: {
      label: "Medium",
      cls: "bg-muted text-muted-foreground border-border",
    },
    low: {
      label: "Low",
      cls: "bg-muted text-muted-foreground/70 border-border",
    },
  }[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold border uppercase tracking-wide",
        cfg.cls
      )}
    >
      {cfg.label}
    </span>
  );
}

function FindingStatusBadge({ status }: { status: Finding["status"] }) {
  const map: Record<Finding["status"], { label: string; cls: string }> = {
    open: {
      label: "Open",
      cls: "bg-destructive/10 text-destructive border-destructive/20",
    },
    assigned: {
      label: "Assigned",
      cls: "bg-warning/10 text-warning border-warning/20",
    },
    in_progress: {
      label: "In Progress",
      cls: "bg-primary/10 text-primary border-primary/20",
    },
    pending_verification: {
      label: "Pending Verif.",
      cls: "bg-muted text-muted-foreground border-border",
    },
    closed: {
      label: "Closed",
      cls: "bg-success/10 text-success border-success/20",
    },
    escalated: {
      label: "Escalated",
      cls: "bg-destructive/10 text-destructive border-destructive/20 font-bold",
    },
    waived: {
      label: "Waived",
      cls: "bg-muted text-muted-foreground/60 border-border",
    },
  };
  const c = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold border",
        c.cls
      )}
    >
      {c.label}
    </span>
  );
}

function ScheduleStatusBadge({
  status,
}: {
  status: InspectionSchedule["status"];
}) {
  const map: Record<
    InspectionSchedule["status"],
    { label: string; cls: string }
  > = {
    overdue: {
      label: "Overdue",
      cls: "bg-destructive/10 text-destructive border-destructive/20 font-bold",
    },
    due_today: {
      label: "Due Today",
      cls: "bg-warning/10 text-warning border-warning/20 font-bold",
    },
    scheduled: {
      label: "Scheduled",
      cls: "bg-muted text-muted-foreground border-border",
    },
    completed: {
      label: "Completed",
      cls: "bg-success/10 text-success border-success/20",
    },
    skipped: {
      label: "Skipped",
      cls: "bg-muted text-muted-foreground/60 border-border",
    },
  };
  const c = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold border",
        c.cls
      )}
    >
      {c.label}
    </span>
  );
}

// ── Period filter type ────────────────────────────────────────────────────────

type Period = "3m" | "6m" | "12m";

// ── Page component ────────────────────────────────────────────────────────────

export default function InspectionDashboardPage() {
  const [period, setPeriod] = useState<Period>("12m");
  const [activeTab, setActiveTab] = useState<"findings" | "schedules">(
    "findings"
  );

  const chartData = useMemo(() => {
    if (period === "3m") return inspectionCompletionByMonth.slice(-3);
    if (period === "6m") return inspectionCompletionByMonth.slice(-6);
    return inspectionCompletionByMonth;
  }, [period]);

  const urgentFindings = useMemo(
    () =>
      findings
        .filter(
          (f) =>
            f.status === "open" ||
            f.status === "escalated" ||
            (f.severity === "critical" && !f.carRaised)
        )
        .sort((a, b) => {
          const ord = { critical: 0, high: 1, medium: 2, low: 3 };
          if (a.severity !== b.severity)
            return ord[a.severity] - ord[b.severity];
          return b.daysOpen - a.daysOpen;
        })
        .slice(0, 6),
    []
  );

  const overdueSchedules = useMemo(
    () =>
      inspectionSchedules
        .filter((s) => s.status === "overdue" || s.status === "due_today")
        .sort((a, b) => {
          if (a.status === "overdue" && b.status !== "overdue") return -1;
          if (b.status === "overdue" && a.status !== "overdue") return 1;
          return 0;
        })
        .slice(0, 6),
    []
  );

  const stats = dashboardStats;

  return (
    <div className="p-4 space-y-4">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Inspection Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            All sites · YTD (Jan–Mar 2026) · Last updated Mar 2, 2026
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[11px] text-muted-foreground font-mono">
            Live
          </span>
        </div>
      </div>

      {/* ── Primary KPI Row (5 metrics) ──────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          title="Inspection Completion Rate"
          value={stats.inspectionCompletionRate}
          suffix="%"
          isFloat
          change={stats.inspectionCompletionRateChange}
          description={`Target 90% · ${stats.inspectionCompletionRateChange > 0 ? "Improving" : "Declining"} vs. last period`}
          indicator="leading"
          severity={
            stats.inspectionCompletionRate >= 90
              ? "success"
              : stats.inspectionCompletionRate >= 80
              ? "normal"
              : "warning"
          }
          index={0}
        />
        <StatCard
          title="Open Findings"
          value={stats.openFindings}
          change={stats.openFindingsChange}
          description={`${stats.criticalOpenFindings} critical · ${stats.openFindingsChange > 0 ? "+" + stats.openFindingsChange : stats.openFindingsChange} vs. last period`}
          severity={
            stats.criticalOpenFindings > 0
              ? "critical"
              : stats.openFindings > 40
              ? "warning"
              : "normal"
          }
          index={1}
        />
        <StatCard
          title="Overdue CARs"
          value={stats.overdueCorrectiveActions}
          change={stats.overdueCorrectiveActionsChange}
          description={`Past due date · Escalation threshold: 5`}
          severity={
            stats.overdueCorrectiveActions >= 5
              ? "critical"
              : stats.overdueCorrectiveActions > 0
              ? "warning"
              : "success"
          }
          index={2}
        />
        <StatCard
          title="Compliance Score"
          value={stats.complianceScore}
          suffix="%"
          isFloat
          change={stats.complianceScoreChange}
          description={`Audit-ready ≥ 90% · ${stats.complianceScore >= 90 ? "Audit-ready" : "Below audit threshold"}`}
          indicator="leading"
          severity={
            stats.complianceScore >= 90
              ? "success"
              : stats.complianceScore >= 80
              ? "normal"
              : "warning"
          }
          index={3}
        />
        <StatCard
          title="Tag Scans (24h)"
          value={stats.tagScanActivity24h}
          description={`NFC proof-of-presence events`}
          severity="normal"
          index={4}
        />
      </div>

      {/* ── Secondary KPI Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Asset Coverage Rate"
          value={stats.assetCoverageRate}
          suffix="%"
          isFloat
          description={`Assets inspected within required frequency`}
          indicator="leading"
          severity={
            stats.assetCoverageRate >= 90
              ? "success"
              : stats.assetCoverageRate >= 75
              ? "normal"
              : "warning"
          }
          index={5}
        />
        <StatCard
          title="TRIR (YTD)"
          value={stats.trir}
          isFloat
          change={stats.trirChange}
          description={`OSHA mfg avg: 2.5 · Lower is better`}
          indicator="lagging"
          severity={
            stats.trir < 2.0
              ? "success"
              : stats.trir < 2.5
              ? "normal"
              : "warning"
          }
          index={6}
        />
        <StatCard
          title="Near-Miss Reports (30d)"
          value={stats.nearMissReports30d}
          description={`Good cultures report more near-misses`}
          indicator="leading"
          severity="normal"
          index={7}
        />
        <StatCard
          title="LOTO Procedures Due Review"
          value={stats.lotoProceduresDueForReview}
          description={`Of ${stats.lotoProceduresActive} active · OSHA 1910.147 annual`}
          severity={
            stats.lotoProceduresDueForReview > 10 ? "warning" : "normal"
          }
          index={8}
        />
      </div>

      {/* ── Main content grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attention Required queue ─────────────────────────────── */}
        <div className="lg:col-span-2 linear-card overflow-hidden">
          <div className="px-4 pt-3 pb-3 border-b border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
              <h2 className="text-sm font-semibold text-foreground">
                Attention Required
              </h2>
              {urgentFindings.length + overdueSchedules.length > 0 && (
                <span className="inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded text-[10px] font-bold bg-destructive text-primary-foreground">
                  {urgentFindings.length + overdueSchedules.length}
                </span>
              )}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("findings")}
                className={cn(
                  "px-2.5 py-1 text-xs rounded border transition-colors duration-[60ms]",
                  activeTab === "findings"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:bg-muted/50"
                )}
              >
                Findings ({urgentFindings.length})
              </button>
              <button
                onClick={() => setActiveTab("schedules")}
                className={cn(
                  "px-2.5 py-1 text-xs rounded border transition-colors duration-[60ms]",
                  activeTab === "schedules"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:bg-muted/50"
                )}
              >
                Overdue Inspections ({overdueSchedules.length})
              </button>
            </div>
          </div>

          {activeTab === "findings" && (
            <div className="divide-y divide-border">
              {urgentFindings.map((f) => (
                <div
                  key={f.id}
                  className="px-4 py-2.5 flex items-start gap-3 linear-hover cursor-pointer"
                >
                  <div className="mt-0.5 shrink-0">
                    {f.severity === "critical" || f.status === "escalated" ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <p className="text-xs font-medium text-foreground leading-snug">
                        {f.title}
                      </p>
                      {!f.carRaised && (
                        <span className="text-[9px] uppercase tracking-wide font-bold text-destructive bg-destructive/10 px-1 py-0.5 rounded shrink-0">
                          No CAR
                        </span>
                      )}
                      {f.isRepeatFinding && (
                        <span className="text-[9px] uppercase tracking-wide font-bold text-warning bg-warning/10 px-1 py-0.5 rounded shrink-0">
                          Repeat ×{f.repeatCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {f.assetName} · {f.inspectorName}
                      {f.escalatedTo && (
                        <> · Escalated to {f.escalatedTo}</>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <SeverityBadge severity={f.severity} />
                    <FindingStatusBadge status={f.status} />
                    <span className="text-[11px] font-mono text-muted-foreground w-8 text-right">
                      {f.daysOpen}d
                    </span>
                  </div>
                </div>
              ))}
              {urgentFindings.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <CheckCircle2 className="h-5 w-5 text-success mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No open findings — all assets are in compliance.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "schedules" && (
            <div className="divide-y divide-border">
              {overdueSchedules.map((s) => (
                <div
                  key={s.id}
                  className="px-4 py-2.5 flex items-start gap-3 linear-hover cursor-pointer"
                >
                  <div className="mt-0.5 shrink-0">
                    <Clock className="h-3.5 w-3.5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground leading-snug">
                      {s.assetName}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {s.inspectionType} · {s.assignedInspectorName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ScheduleStatusBadge status={s.status} />
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {s.scheduledDate}
                    </span>
                  </div>
                </div>
              ))}
              {overdueSchedules.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <CheckCircle2 className="h-5 w-5 text-success mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No inspections scheduled for this period.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Compliance trend chart */}
          <div className="linear-card overflow-hidden">
            <div className="px-4 pt-3 pb-2 border-b border-border flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Inspection Completion Rate
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Monthly trend vs. 90% target
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                {(["3m", "6m", "12m"] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      "px-1.5 py-0.5 text-[11px] rounded border transition-colors duration-[60ms]",
                      period === p
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-3 py-3">
              <ComplianceTrendChart data={chartData} />
            </div>
          </div>

          {/* Tag scan activity */}
          <div className="linear-card overflow-hidden">
            <div className="px-4 pt-3 pb-2 border-b border-border flex items-center gap-2">
              <Wifi className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Tag Scan Activity
                </h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  NFC proof-of-presence · Last 7 days
                </p>
              </div>
            </div>
            <div className="px-3 pt-3 pb-2">
              <TagScanChart data={tagScanActivity7d} />
              <div className="flex items-center gap-4 mt-2 px-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: "var(--chart-2)" }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    Tag Scans
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: "var(--chart-1)" }}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    Inspections Triggered
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform activity summary */}
          <div className="linear-card px-4 py-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Platform Activity
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Active Sites
                </span>
                <span className="text-xs font-mono font-semibold text-foreground">
                  5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  LOTO Procedures Active
                </span>
                <span className="text-xs font-mono font-semibold text-foreground">
                  {stats.lotoProceduresActive}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  LOTO Due Annual Inspection
                </span>
                <span
                  className={cn(
                    "text-xs font-mono font-semibold",
                    stats.lotoProceduresDueForReview > 10
                      ? "text-warning"
                      : "text-foreground"
                  )}
                >
                  {stats.lotoProceduresDueForReview}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  TRIR (YTD)
                </span>
                <span
                  className={cn(
                    "text-xs font-mono font-semibold",
                    stats.trir < 2.0
                      ? "text-success"
                      : stats.trir < 2.5
                      ? "text-foreground"
                      : "text-warning"
                  )}
                >
                  {stats.trir.toFixed(1)}
                  <span className="font-normal text-muted-foreground ml-1">
                    (mfg avg 2.5)
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Proposal Banner ──────────────────────────────────────────── */}
      <div className="linear-card p-4 border-l-2 border-l-primary bg-primary/[0.03] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">
            This is a live demo built for {APP_CONFIG.projectName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Humam · Full-Stack Developer · Available now
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/challenges"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-[60ms]"
          >
            My Approach →
          </a>
          <a
            href="/proposal"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded hover:bg-primary/90 transition-colors duration-[60ms]"
          >
            Work with me
          </a>
        </div>
      </div>
    </div>
  );
}
