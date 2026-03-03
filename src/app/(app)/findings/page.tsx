"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { findings, correctiveActions } from "@/data/mock-data";
import type {
  Finding,
  FindingStatus,
  FindingSeverity,
  CorrectiveAction,
  CorrectiveActionStatus,
} from "@/lib/types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Download,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─── Severity Badge ───────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: FindingSeverity }) {
  const config: Record<
    FindingSeverity,
    { label: string; colorClass: string }
  > = {
    critical: {
      label: "Critical",
      colorClass: "text-destructive bg-destructive/10 font-semibold",
    },
    high: {
      label: "High",
      colorClass:
        "text-[color:var(--warning)] bg-[color:var(--warning)]/10 font-semibold",
    },
    medium: {
      label: "Medium",
      colorClass: "text-foreground bg-muted",
    },
    low: {
      label: "Low",
      colorClass: "text-muted-foreground bg-muted",
    },
  };

  const { label, colorClass } = config[severity];
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs border-0 rounded-sm whitespace-nowrap",
        colorClass
      )}
    >
      {label}
    </Badge>
  );
}

// ─── Finding Status Badge ─────────────────────────────────────────────────────

function FindingStatusBadge({ status }: { status: FindingStatus }) {
  const config: Record<FindingStatus, { label: string; colorClass: string }> =
    {
      open: {
        label: "Open",
        colorClass: "text-destructive bg-destructive/10",
      },
      assigned: {
        label: "Assigned",
        colorClass:
          "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
      },
      in_progress: {
        label: "In Progress",
        colorClass:
          "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
      },
      pending_verification: {
        label: "Pending Verification",
        colorClass: "text-foreground bg-muted",
      },
      closed: {
        label: "Closed",
        colorClass:
          "text-[color:var(--success)] bg-[color:var(--success)]/10",
      },
      escalated: {
        label: "Escalated",
        colorClass: "text-destructive bg-destructive/10 font-semibold",
      },
      waived: {
        label: "Waived",
        colorClass: "text-muted-foreground bg-muted",
      },
    };

  const { label, colorClass } = config[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border-0 rounded-sm whitespace-nowrap",
        colorClass
      )}
    >
      {label}
    </Badge>
  );
}

// ─── CAR Status Badge ─────────────────────────────────────────────────────────

function CARStatusBadge({ status }: { status: CorrectiveActionStatus }) {
  const config: Record<
    CorrectiveActionStatus,
    { label: string; colorClass: string }
  > = {
    open: { label: "Open", colorClass: "text-destructive bg-destructive/10" },
    assigned: {
      label: "Assigned",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    },
    in_progress: {
      label: "In Progress",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    },
    pending_verification: {
      label: "Pending Verification",
      colorClass: "text-foreground bg-muted",
    },
    closed: {
      label: "Closed",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    },
    overdue: {
      label: "Overdue",
      colorClass: "text-destructive bg-destructive/10 font-semibold",
    },
    escalated: {
      label: "Escalated",
      colorClass: "text-destructive bg-destructive/10 font-semibold",
    },
  };

  const { label, colorClass } = config[status];
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border-0 rounded-sm whitespace-nowrap",
        colorClass
      )}
    >
      {label}
    </Badge>
  );
}

// ─── Severity sort order ──────────────────────────────────────────────────────

const SEVERITY_ORDER: Record<FindingSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Open Findings Tab ────────────────────────────────────────────────────────

const OPEN_STATUSES: FindingStatus[] = [
  "open",
  "assigned",
  "in_progress",
  "escalated",
];

function OpenFindingsTab() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<FindingSeverity | "all">(
    "all"
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const openFindings = useMemo(
    () => findings.filter((f) => OPEN_STATUSES.includes(f.status)),
    []
  );

  const displayed = useMemo(() => {
    return openFindings
      .filter((f) => {
        const matchesSeverity =
          severityFilter === "all" || f.severity === severityFilter;
        const q = search.toLowerCase();
        const matchesSearch =
          q === "" ||
          f.title.toLowerCase().includes(q) ||
          f.assetName.toLowerCase().includes(q) ||
          f.inspectorName.toLowerCase().includes(q);
        return matchesSeverity && matchesSearch;
      })
      .sort((a, b) => {
        const sa = SEVERITY_ORDER[a.severity];
        const sb = SEVERITY_ORDER[b.severity];
        if (sa !== sb) return sa - sb;
        return b.daysOpen - a.daysOpen;
      });
  }, [search, severityFilter, openFindings]);

  const criticalNoCar = displayed.filter(
    (f) => f.severity === "critical" && !f.carRaised
  );

  return (
    <div className="space-y-3 pt-3">
      {/* Critical alert banner */}
      {criticalNoCar.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-destructive/8 border border-destructive/25 text-destructive text-xs font-medium">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {criticalNoCar.length} critical finding
          {criticalNoCar.length > 1 ? "s" : ""} with no CAR assigned —
          immediate action required
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search findings, assets, inspectors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Select
          value={severityFilter}
          onValueChange={(v) =>
            setSeverityFilter(v as FindingSeverity | "all")
          }
        >
          <SelectTrigger className="h-8 w-36 text-sm">
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
          {displayed.length} of {openFindings.length} open findings
        </span>
      </div>

      {/* Table */}
      <div className="rounded-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Severity
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Finding
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Asset
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Inspector
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
                  Days Open
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  CAR
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No open findings match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((f) => (
                  <>
                    <TableRow
                      key={f.id}
                      className={cn(
                        "cursor-pointer hover:bg-[color:var(--surface-hover)] transition-colors duration-75",
                        f.severity === "critical" && "bg-destructive/4",
                        expandedId === f.id && "bg-[color:var(--surface-hover)]"
                      )}
                      onClick={() =>
                        setExpandedId(expandedId === f.id ? null : f.id)
                      }
                    >
                      <TableCell>
                        <SeverityBadge severity={f.severity} />
                      </TableCell>
                      <TableCell className="text-xs font-medium max-w-[240px]">
                        <div className="flex items-start gap-1.5">
                          {f.isRepeatFinding && (
                            <RotateCcw className="w-3 h-3 text-[color:var(--warning)] mt-0.5 shrink-0" aria-label="Repeat finding" />
                          )}
                          <span className="line-clamp-2 leading-snug">
                            {f.title}
                          </span>
                        </div>
                        {f.isRepeatFinding && (
                          <span className="text-[11px] text-[color:var(--warning)] mt-0.5 block">
                            Repeat × {f.repeatCount} — RCA required
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[180px]">
                        <span className="line-clamp-1">{f.assetName}</span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {f.inspectorName}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        <span
                          className={cn(
                            "text-xs font-mono font-semibold",
                            f.daysOpen > 14
                              ? "text-destructive"
                              : f.daysOpen > 7
                              ? "text-[color:var(--warning)]"
                              : "text-muted-foreground"
                          )}
                        >
                          {f.daysOpen}d
                        </span>
                      </TableCell>
                      <TableCell>
                        <FindingStatusBadge status={f.status} />
                      </TableCell>
                      <TableCell>
                        {f.carRaised ? (
                          <span className="text-xs text-muted-foreground font-mono">
                            {f.correctiveActionId ?? "—"}
                          </span>
                        ) : (
                          <span className="text-xs text-destructive font-medium">
                            No CAR
                          </span>
                        )}
                      </TableCell>
                    </TableRow>

                    {/* Expanded detail */}
                    {expandedId === f.id && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="bg-muted/30 border-t border-border/60 p-4"
                        >
                          <div className="text-xs space-y-2">
                            <p className="text-foreground leading-relaxed">
                              {f.description}
                            </p>
                            <div className="flex gap-6 text-muted-foreground mt-2 flex-wrap">
                              <span>
                                <span className="font-medium text-foreground">Created:</span>{" "}
                                {formatDate(f.createdAt)}
                              </span>
                              <span>
                                <span className="font-medium text-foreground">Photo Evidence:</span>{" "}
                                {f.photoAttached ? "Attached" : "None"}
                              </span>
                              {f.escalatedTo && (
                                <span>
                                  <span className="font-medium text-foreground">Escalated to:</span>{" "}
                                  {f.escalatedTo}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// ─── Corrective Actions Tab ───────────────────────────────────────────────────

function CorrectiveActionsTab() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    CorrectiveActionStatus | "all"
  >("all");

  const openCARs = useMemo(
    () =>
      correctiveActions.filter(
        (c) => c.status !== "closed"
      ),
    []
  );

  const displayed = useMemo(() => {
    return openCARs
      .filter((c) => {
        const matchesStatus =
          statusFilter === "all" || c.status === statusFilter;
        const q = search.toLowerCase();
        const matchesSearch =
          q === "" ||
          c.findingTitle.toLowerCase().includes(q) ||
          c.assetName.toLowerCase().includes(q) ||
          c.assigneeName.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        // Overdue / escalated first
        const urgency: Record<string, number> = {
          overdue: 0,
          escalated: 1,
          open: 2,
          assigned: 3,
          in_progress: 4,
          pending_verification: 5,
        };
        const ua = urgency[a.status] ?? 9;
        const ub = urgency[b.status] ?? 9;
        if (ua !== ub) return ua - ub;
        return a.daysUntilDue - b.daysUntilDue;
      });
  }, [search, statusFilter, openCARs]);

  const overdueCount = openCARs.filter((c) => c.status === "overdue").length;

  return (
    <div className="space-y-3 pt-3">
      {overdueCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-destructive/8 border border-destructive/25 text-destructive text-xs font-medium">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {overdueCount} corrective action{overdueCount > 1 ? "s" : ""} past
          due date — escalation may be required
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search CARs, assets, assignees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) =>
            setStatusFilter(v as CorrectiveActionStatus | "all")
          }
        >
          <SelectTrigger className="h-8 w-44 text-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="pending_verification">
              Pending Verification
            </SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
          {displayed.length} of {openCARs.length} open CARs
        </span>
      </div>

      <div className="rounded-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  CAR ID
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Finding / Asset
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Assignee
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Raised By
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Due Date
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-right">
                  Days Until Due
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    All corrective actions are closed.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((car) => (
                  <TableRow
                    key={car.id}
                    className={cn(
                      "hover:bg-[color:var(--surface-hover)] transition-colors duration-75",
                      car.status === "overdue" && "bg-destructive/4"
                    )}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {car.id}
                    </TableCell>
                    <TableCell className="text-xs max-w-[240px]">
                      <div className="font-medium line-clamp-1 text-foreground leading-snug">
                        {car.findingTitle}
                      </div>
                      <div className="text-muted-foreground mt-0.5 line-clamp-1">
                        {car.assetName}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {car.assigneeName}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {car.raisedByName}
                    </TableCell>
                    <TableCell className="text-xs tabular-nums whitespace-nowrap text-muted-foreground">
                      {formatDate(car.dueDate)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      <span
                        className={cn(
                          "text-xs font-mono font-semibold",
                          car.daysUntilDue < 0
                            ? "text-destructive"
                            : car.daysUntilDue <= 3
                            ? "text-[color:var(--warning)]"
                            : "text-muted-foreground"
                        )}
                      >
                        {car.daysUntilDue < 0
                          ? `${Math.abs(car.daysUntilDue)}d overdue`
                          : `${car.daysUntilDue}d`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <CARStatusBadge status={car.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// ─── Closed (30d) Tab ─────────────────────────────────────────────────────────

function ClosedFindingsTab() {
  const [search, setSearch] = useState("");

  const closedFindings = useMemo(
    () =>
      findings
        .filter(
          (f) => f.status === "closed" || f.status === "waived"
        )
        .filter((f) => {
          const q = search.toLowerCase();
          return (
            q === "" ||
            f.title.toLowerCase().includes(q) ||
            f.assetName.toLowerCase().includes(q) ||
            f.inspectorName.toLowerCase().includes(q)
          );
        }),
    [search]
  );

  return (
    <div className="space-y-3 pt-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search closed findings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
          {closedFindings.length} findings
        </span>
      </div>

      <div className="rounded-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Severity
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Finding
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Asset
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Inspector
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Created
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Resolution
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {closedFindings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-sm text-muted-foreground"
                  >
                    No closed findings match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                closedFindings.map((f) => (
                  <TableRow
                    key={f.id}
                    className="hover:bg-[color:var(--surface-hover)] transition-colors duration-75"
                  >
                    <TableCell>
                      <SeverityBadge severity={f.severity} />
                    </TableCell>
                    <TableCell className="text-xs max-w-[240px]">
                      <span className="line-clamp-2 leading-snug">
                        {f.title}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[160px]">
                      <span className="line-clamp-1">{f.assetName}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {f.inspectorName}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                      {formatDate(f.createdAt)}
                    </TableCell>
                    <TableCell>
                      <FindingStatusBadge status={f.status} />
                      {f.status === "waived" && f.waivedBy && (
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          Waived by {f.waivedBy}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FindingsPage() {
  const openCount = findings.filter((f) =>
    OPEN_STATUSES.includes(f.status)
  ).length;
  const carOpenCount = correctiveActions.filter(
    (c) => c.status !== "closed"
  ).length;
  const closedCount = findings.filter(
    (f) => f.status === "closed" || f.status === "waived"
  ).length;

  return (
    <div className="p-4 space-y-4">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Findings &amp; CARs
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Open findings, corrective action requests, and closed records (last
            30 days).
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="open">
        <TabsList className="h-8 rounded-sm">
          <TabsTrigger value="open" className="text-xs rounded-sm h-6 gap-1.5">
            Open Findings
            <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-sm text-[10px] font-semibold bg-destructive text-white leading-none">
              {openCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="cars" className="text-xs rounded-sm h-6 gap-1.5">
            Corrective Actions
            <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-sm text-[10px] font-semibold bg-[color:var(--warning)] text-white leading-none">
              {carOpenCount}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="closed"
            className="text-xs rounded-sm h-6 gap-1.5"
          >
            Closed (30d)
            <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-sm text-[10px] font-semibold bg-muted text-muted-foreground leading-none">
              {closedCount}
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="open">
          <OpenFindingsTab />
        </TabsContent>
        <TabsContent value="cars">
          <CorrectiveActionsTab />
        </TabsContent>
        <TabsContent value="closed">
          <ClosedFindingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
