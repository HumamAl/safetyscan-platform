"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { assets, zones, sites } from "@/data/mock-data";
import type { Asset, AssetStatus } from "@/lib/types";
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
  ChevronUp,
  ChevronDown,
  Download,
  Tag,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

// ─── Status Badge ─────────────────────────────────────────────────────────────

function AssetStatusBadge({ status }: { status: AssetStatus }) {
  const config: Record<AssetStatus, { label: string; colorClass: string }> = {
    active: {
      label: "Active",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    },
    out_of_service: {
      label: "Out of Service",
      colorClass: "text-muted-foreground bg-muted",
    },
    quarantined: {
      label: "Quarantined",
      colorClass: "text-destructive bg-destructive/10",
    },
    untagged: {
      label: "Untagged",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    },
    overdue_inspection: {
      label: "Overdue Inspection",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
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

// ─── Zone lookup helper ───────────────────────────────────────────────────────

function getZoneLabel(zoneId: string): string {
  const zone = zones.find((z) => z.id === zoneId);
  return zone ? zone.name : zoneId;
}

function getSiteLabel(siteId: string): string {
  const site = sites.find((s) => s.id === siteId);
  return site ? site.name : siteId;
}

// ─── Sort helpers ─────────────────────────────────────────────────────────────

type SortKey = "name" | "lastInspectedDaysAgo" | "status" | "openFindingsCount";

function sortAssets(
  data: Asset[],
  key: SortKey,
  dir: "asc" | "desc"
): Asset[] {
  return [...data].sort((a, b) => {
    let av: string | number | null = a[key];
    let bv: string | number | null = b[key];
    // Nulls sink to bottom
    if (av === null) return 1;
    if (bv === null) return -1;
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    if (av < bv) return dir === "asc" ? -1 : 1;
    if (av > bv) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: AssetStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "quarantined", label: "Quarantined" },
  { value: "overdue_inspection", label: "Overdue Inspection" },
  { value: "out_of_service", label: "Out of Service" },
  { value: "untagged", label: "Untagged" },
];

const CATEGORY_OPTIONS = [
  "all",
  "Electrical & Mechanical",
  "Fire & Life Safety",
  "HVAC / Utilities",
  "PPE / Safety Equipment",
];

export default function AssetRegisterPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const displayed = useMemo(() => {
    const filtered = assets.filter((asset) => {
      const matchesStatus =
        statusFilter === "all" || asset.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || asset.category === categoryFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        q === "" ||
        asset.name.toLowerCase().includes(q) ||
        (asset.tagId ?? "").toLowerCase().includes(q) ||
        asset.serialNumber?.toLowerCase().includes(q) ||
        asset.regulatoryStandard?.toLowerCase().includes(q);
      return matchesStatus && matchesCategory && matchesSearch;
    });
    return sortAssets(filtered, sortKey, sortDir);
  }, [search, statusFilter, categoryFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col)
      return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  }

  const criticalCount = displayed.filter((a) => a.hasCriticalFinding).length;

  return (
    <div className="p-4 space-y-4">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Asset Register
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All tagged assets with NFC tag status, inspection currency, and open
            findings.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {criticalCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {criticalCount} with critical finding
            </div>
          )}
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search assets, tag IDs, serial numbers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as AssetStatus | "all")}
        >
          <SelectTrigger className="h-8 w-44 text-sm">
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
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-8 w-52 text-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((c) => (
              <SelectItem key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
          {displayed.length} of {assets.length} assets
        </span>
      </div>

      {/* ── Table ── */}
      <div className="rounded-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors duration-75 w-[280px]"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Asset Name <SortIcon col="name" />
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Location / Zone
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  NFC Tag ID
                </TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("lastInspectedDaysAgo")}
                >
                  <div className="flex items-center gap-1">
                    Last Inspected <SortIcon col="lastInspectedDaysAgo" />
                  </div>
                </TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors duration-75"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status <SortIcon col="status" />
                  </div>
                </TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground transition-colors duration-75 text-right"
                  onClick={() => handleSort("openFindingsCount")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Open Findings <SortIcon col="openFindingsCount" />
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Std.
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-28 text-center text-sm text-muted-foreground"
                  >
                    No assets match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((asset) => (
                  <TableRow
                    key={asset.id}
                    className={cn(
                      "hover:bg-[color:var(--surface-hover)] transition-colors duration-75 text-sm",
                      asset.hasCriticalFinding && "bg-destructive/4"
                    )}
                  >
                    {/* Asset Name */}
                    <TableCell className="font-medium max-w-[280px]">
                      <div className="flex items-start gap-2">
                        {asset.hasCriticalFinding && (
                          <AlertTriangle className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                        )}
                        <div>
                          <span className="text-foreground text-xs leading-snug line-clamp-2">
                            {asset.name}
                          </span>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {asset.category}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Location / Zone */}
                    <TableCell className="text-xs text-muted-foreground max-w-[180px]">
                      <div className="line-clamp-1">{getZoneLabel(asset.zoneId)}</div>
                      <div className="text-[11px] text-muted-foreground/70 mt-0.5 line-clamp-1">
                        {getSiteLabel(asset.siteId).split(" — ")[0]}
                      </div>
                    </TableCell>

                    {/* NFC Tag ID */}
                    <TableCell>
                      {asset.tagId ? (
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-muted-foreground" />
                          <span className="font-mono text-xs text-foreground">
                            {asset.tagId}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Not tagged
                        </span>
                      )}
                    </TableCell>

                    {/* Last Inspected */}
                    <TableCell className="text-xs tabular-nums">
                      {asset.lastInspectedDaysAgo !== null ? (
                        <span
                          className={cn(
                            asset.lastInspectedDaysAgo > 30
                              ? "text-[color:var(--warning)] font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {asset.lastInspectedDaysAgo === 0
                            ? "Today"
                            : `${asset.lastInspectedDaysAgo}d ago`}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60 italic">
                          Never
                        </span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <AssetStatusBadge status={asset.status} />
                    </TableCell>

                    {/* Open Findings */}
                    <TableCell className="text-right">
                      {asset.openFindingsCount > 0 ? (
                        <span
                          className={cn(
                            "font-mono text-xs font-semibold tabular-nums",
                            asset.hasCriticalFinding
                              ? "text-destructive"
                              : "text-[color:var(--warning)]"
                          )}
                        >
                          {asset.openFindingsCount}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">
                          —
                        </span>
                      )}
                    </TableCell>

                    {/* Regulatory Standard */}
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {asset.regulatoryStandard ?? "—"}
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
