"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { auditLog, sites } from "@/data/mock-data";
import type { AuditLogEntry, AuditLogAction } from "@/lib/types";
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
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

// ─── Event type config ─────────────────────────────────────────────────────────

type EventCategory = "scan" | "inspection" | "finding" | "car" | "asset" | "user" | "audit";

const ACTION_CONFIG: Record<
  AuditLogAction,
  { label: string; category: EventCategory; colorClass: string }
> = {
  tag_scan: {
    label: "Tag Scan",
    category: "scan",
    colorClass: "text-primary bg-primary/10",
  },
  tag_scan_location_mismatch: {
    label: "Scan — Location Mismatch",
    category: "scan",
    colorClass: "text-destructive bg-destructive/10",
  },
  inspection_created: {
    label: "Inspection Created",
    category: "inspection",
    colorClass: "text-muted-foreground bg-muted",
  },
  inspection_completed: {
    label: "Inspection Completed",
    category: "inspection",
    colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
  },
  inspection_overdue: {
    label: "Inspection Overdue",
    category: "inspection",
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
  },
  finding_created: {
    label: "Finding Created",
    category: "finding",
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
  },
  finding_escalated: {
    label: "Finding Escalated",
    category: "finding",
    colorClass: "text-destructive bg-destructive/10",
  },
  finding_closed: {
    label: "Finding Closed",
    category: "finding",
    colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
  },
  finding_waived: {
    label: "Finding Waived",
    category: "finding",
    colorClass: "text-muted-foreground bg-muted",
  },
  car_created: {
    label: "CAR Created",
    category: "car",
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
  },
  car_closed: {
    label: "CAR Closed",
    category: "car",
    colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
  },
  car_overdue: {
    label: "CAR Overdue",
    category: "car",
    colorClass: "text-destructive bg-destructive/10",
  },
  asset_status_changed: {
    label: "Asset Status Changed",
    category: "asset",
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
  },
  user_login: {
    label: "User Login",
    category: "user",
    colorClass: "text-muted-foreground bg-muted",
  },
  user_role_changed: {
    label: "Role Changed",
    category: "user",
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
  },
  audit_report_exported: {
    label: "Audit Report Exported",
    category: "audit",
    colorClass: "text-primary bg-primary/10",
  },
};

const CATEGORY_LABELS: Record<EventCategory, string> = {
  scan: "Tag Scan Events",
  inspection: "Inspection Events",
  finding: "Finding Events",
  car: "Corrective Actions",
  asset: "Asset Changes",
  user: "User Events",
  audit: "Audit Events",
};

// ─── Event Type Badge ─────────────────────────────────────────────────────────

function EventTypeBadge({ action }: { action: AuditLogAction }) {
  const config = ACTION_CONFIG[action] ?? {
    label: action,
    category: "inspection" as EventCategory,
    colorClass: "text-muted-foreground bg-muted",
  };
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border-0 rounded-sm whitespace-nowrap",
        config.colorClass
      )}
    >
      {config.label}
    </Badge>
  );
}

// ─── Tamper verification indicator ───────────────────────────────────────────

function TamperIndicator({ verified }: { verified: boolean }) {
  return verified ? (
    <div
      className="flex items-center gap-1 text-[color:var(--success)] text-[11px] font-medium"
      title="Cryptographically verified — tamper-evident record"
    >
      <ShieldCheck className="w-3 h-3" />
      <span className="hidden sm:inline">Verified</span>
    </div>
  ) : (
    <div
      className="flex items-center gap-1 text-destructive text-[11px] font-medium"
      title="Verification failed — record may have been altered"
    >
      <ShieldAlert className="w-3 h-3" />
      <span className="hidden sm:inline">Unverified</span>
    </div>
  );
}

// ─── Timestamp formatting ─────────────────────────────────────────────────────

function formatTimestamp(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return { date, time };
}

function getSiteLabel(siteId: string): string {
  const site = sites.find((s) => s.id === siteId);
  if (!site) return siteId;
  return site.name.split(" — ")[0];
}

// ─── Actor role display ───────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  inspector: "Inspector",
  safety_manager: "Safety Manager",
  site_admin: "Site Admin",
  auditor: "Auditor",
  executive: "Executive",
};

// ─── Event type options for filter ───────────────────────────────────────────

const CATEGORY_OPTIONS: { value: EventCategory | "all"; label: string }[] = [
  { value: "all", label: "All Event Types" },
  { value: "scan", label: "Tag Scan Events" },
  { value: "inspection", label: "Inspection Events" },
  { value: "finding", label: "Finding Events" },
  { value: "car", label: "Corrective Actions" },
  { value: "asset", label: "Asset Changes" },
  { value: "audit", label: "Audit Events" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "all">(
    "all"
  );
  const [siteFilter, setSiteFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sort entries newest first
  const sortedLog = useMemo(
    () =>
      [...auditLog].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    []
  );

  const displayed = useMemo(() => {
    return sortedLog.filter((entry) => {
      const config = ACTION_CONFIG[entry.action];
      const matchesCategory =
        categoryFilter === "all" ||
        (config && config.category === categoryFilter);
      const matchesSite =
        siteFilter === "all" || entry.siteId === siteFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        q === "" ||
        entry.actorName.toLowerCase().includes(q) ||
        entry.entityLabel.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.entityId.toLowerCase().includes(q);
      return matchesCategory && matchesSite && matchesSearch;
    });
  }, [sortedLog, search, categoryFilter, siteFilter]);

  const verifiedCount = displayed.filter((e) => e.tamperVerified).length;
  const flaggedCount = displayed.filter((e) => !e.tamperVerified).length;
  const mismatchCount = displayed.filter(
    (e) => e.action === "tag_scan_location_mismatch"
  ).length;

  const uniqueSites = useMemo(() => {
    const seen = new Set<string>();
    const result: { id: string; name: string }[] = [];
    for (const entry of sortedLog) {
      if (!seen.has(entry.siteId)) {
        seen.add(entry.siteId);
        result.push({
          id: entry.siteId,
          name: getSiteLabel(entry.siteId),
        });
      }
    }
    return result;
  }, [sortedLog]);

  return (
    <div className="p-4 space-y-4">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Audit Log</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Immutable, tamper-evident record of all scan events, inspection
            submissions, and system actions.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
          <Download className="w-3.5 h-3.5" />
          Export Log
        </Button>
      </div>

      {/* ── Integrity Summary ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[color:var(--success)]/10 border border-[color:var(--success)]/20 text-[color:var(--success)] text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="tabular-nums">{verifiedCount}</span> verified entries
        </div>
        {flaggedCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="tabular-nums">{flaggedCount}</span> unverified
          </div>
        )}
        {mismatchCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[color:var(--warning)]/10 border border-[color:var(--warning)]/20 text-[color:var(--warning)] text-xs font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="tabular-nums">{mismatchCount}</span> location
            mismatch scans — pending review
          </div>
        )}
        <div className="flex items-center gap-1 text-muted-foreground text-xs ml-auto">
          <CheckCircle2 className="w-3 h-3 text-[color:var(--success)]" />
          Tamper-evident audit trail active
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search events, actors, entities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(v) =>
            setCategoryFilter(v as EventCategory | "all")
          }
        >
          <SelectTrigger className="h-8 w-44 text-sm">
            <SelectValue placeholder="All Event Types" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={siteFilter} onValueChange={setSiteFilter}>
          <SelectTrigger className="h-8 w-48 text-sm">
            <SelectValue placeholder="All Sites" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sites</SelectItem>
            {uniqueSites.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
          {displayed.length} of {auditLog.length} entries
        </span>
      </div>

      {/* ── Log Table ── */}
      <div className="rounded-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Timestamp
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Event Type
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Entity / Subject
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Actor
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Site
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Integrity
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-28 text-center text-sm text-muted-foreground"
                  >
                    No audit log entries match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((entry) => {
                  const { date, time } = formatTimestamp(entry.timestamp);
                  const isExpanded = expandedId === entry.id;
                  const isMismatch =
                    entry.action === "tag_scan_location_mismatch";

                  return (
                    <>
                      <TableRow
                        key={entry.id}
                        className={cn(
                          "cursor-pointer hover:bg-[color:var(--surface-hover)] transition-colors duration-75",
                          isMismatch && "bg-destructive/4",
                          isExpanded && "bg-[color:var(--surface-hover)]"
                        )}
                        onClick={() =>
                          setExpandedId(isExpanded ? null : entry.id)
                        }
                      >
                        {/* Timestamp */}
                        <TableCell className="whitespace-nowrap">
                          <div className="font-mono text-xs text-foreground tabular-nums">
                            {time}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 tabular-nums">
                            {date}
                          </div>
                        </TableCell>

                        {/* Event Type */}
                        <TableCell>
                          <EventTypeBadge action={entry.action} />
                        </TableCell>

                        {/* Entity / Subject */}
                        <TableCell className="max-w-[280px]">
                          <div className="text-xs text-foreground line-clamp-1 font-medium leading-snug">
                            {entry.entityLabel}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                            {entry.description}
                          </div>
                        </TableCell>

                        {/* Actor */}
                        <TableCell className="whitespace-nowrap">
                          <div className="text-xs text-foreground">
                            {entry.actorName}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {ROLE_LABELS[entry.actorRole] ?? entry.actorRole}
                          </div>
                        </TableCell>

                        {/* Site */}
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {getSiteLabel(entry.siteId)}
                        </TableCell>

                        {/* Integrity */}
                        <TableCell>
                          <TamperIndicator verified={entry.tamperVerified} />
                        </TableCell>
                      </TableRow>

                      {/* Expanded metadata */}
                      {isExpanded && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="bg-muted/30 border-t border-border/60 p-4"
                          >
                            <div className="text-xs space-y-2">
                              <div className="flex items-start gap-6 flex-wrap">
                                <div>
                                  <span className="font-medium text-foreground">
                                    Entry ID:
                                  </span>{" "}
                                  <span className="font-mono text-muted-foreground">
                                    {entry.id}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-foreground">
                                    Entity ID:
                                  </span>{" "}
                                  <span className="font-mono text-muted-foreground">
                                    {entry.entityId}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-foreground">
                                    Entity Type:
                                  </span>{" "}
                                  <span className="text-muted-foreground capitalize">
                                    {entry.entityType.replace("_", " ")}
                                  </span>
                                </div>
                              </div>
                              {entry.metadata &&
                                Object.keys(entry.metadata).length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-border/40">
                                    <span className="font-medium text-foreground block mb-1">
                                      Event Metadata:
                                    </span>
                                    <div className="flex gap-4 flex-wrap">
                                      {Object.entries(entry.metadata).map(
                                        ([k, v]) => (
                                          <div key={k}>
                                            <span className="text-muted-foreground">
                                              {k}:{" "}
                                            </span>
                                            <span className="font-mono text-foreground">
                                              {v}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
