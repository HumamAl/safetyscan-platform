"use client";

import { useState, type ElementType } from "react";
import {
  Database,
  Bell,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Scenario = "partial-failure" | "atomic-write";

interface ScenarioStep {
  id: string;
  label: string;
  detail: string;
  icon: ElementType;
  status: "success" | "failed" | "skipped" | "neutral";
}

const PROBLEM_STEPS: ScenarioStep[] = [
  {
    id: "inspection-write",
    label: "Inspection record written",
    detail: "Postgres: inspections table",
    icon: Database,
    status: "success",
  },
  {
    id: "notification",
    label: "Twilio SMS dispatched",
    detail: "Twilio API → delivery failure",
    icon: Bell,
    status: "failed",
  },
  {
    id: "audit-log",
    label: "Audit log entry",
    detail: "Never executed — exception thrown",
    icon: ShieldCheck,
    status: "skipped",
  },
];

const SOLUTION_STEPS: ScenarioStep[] = [
  {
    id: "tx-open",
    label: "DB transaction opened",
    detail: "BEGIN — inspection + audit log",
    icon: Database,
    status: "success",
  },
  {
    id: "inspection-write",
    label: "Inspection record queued",
    detail: "Staged within transaction",
    icon: Database,
    status: "success",
  },
  {
    id: "audit-write",
    label: "Audit log entry queued",
    detail: "Staged within same transaction",
    icon: ShieldCheck,
    status: "success",
  },
  {
    id: "tx-commit",
    label: "Transaction committed",
    detail: "COMMIT — both records written atomically",
    icon: Database,
    status: "success",
  },
  {
    id: "notification",
    label: "Twilio SMS dispatched",
    detail: "Post-commit — failure is non-fatal",
    icon: Bell,
    status: "failed",
  },
  {
    id: "audit-preserved",
    label: "Audit log intact",
    detail: "Notification failure does not affect record",
    icon: ShieldCheck,
    status: "success",
  },
];

const STATUS_STYLES: Record<string, string> = {
  success:
    "border-[color-mix(in_oklch,var(--success)_30%,transparent)] bg-[color-mix(in_oklch,var(--success)_6%,transparent)] text-[color:var(--success)]",
  failed:
    "border-destructive/30 bg-destructive/6 text-destructive",
  skipped:
    "border-border/40 bg-muted/40 text-muted-foreground opacity-60",
  neutral:
    "border-border bg-card text-foreground",
};

function ScenarioStep({ step }: { step: ScenarioStep }) {
  return (
    <div className={cn("border rounded px-3 py-2 flex items-start gap-2.5", STATUS_STYLES[step.status])}>
      {step.status === "success" ? (
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
      ) : step.status === "failed" ? (
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
      ) : (
        <step.icon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
      )}
      <div>
        <p className="text-xs font-medium leading-none">{step.label}</p>
        <p className="text-[10px] mt-0.5 opacity-70 leading-none">{step.detail}</p>
      </div>
      {step.status === "skipped" && (
        <span className="ml-auto text-[10px] font-medium text-destructive bg-destructive/10 px-1.5 py-0.5 rounded shrink-0">
          orphaned
        </span>
      )}
    </div>
  );
}

export function AuditIntegrityViz() {
  const [scenario, setScenario] = useState<Scenario>("partial-failure");

  const steps =
    scenario === "partial-failure" ? PROBLEM_STEPS : SOLUTION_STEPS;

  return (
    <div className="space-y-3">
      {/* Scenario selector */}
      <div className="flex items-center gap-1 bg-muted/60 rounded p-0.5 w-fit">
        <button
          onClick={() => setScenario("partial-failure")}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded transition-colors duration-75",
            scenario === "partial-failure"
              ? "bg-card text-foreground shadow-sm border border-border/60"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Without Atomicity
        </button>
        <button
          onClick={() => setScenario("atomic-write")}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded transition-colors duration-75",
            scenario === "atomic-write"
              ? "bg-card text-foreground shadow-sm border border-border/60"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          With Atomic Transaction
        </button>
      </div>

      {/* Step chain */}
      <div className="space-y-1.5">
        {steps.map((step, i) => (
          <div key={step.id}>
            <ScenarioStep step={step} />
            {i < steps.length - 1 && (
              <div className="flex justify-start pl-4">
                <ArrowDown className="w-3 h-3 text-border my-0.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Verdict */}
      {scenario === "partial-failure" && (
        <div
          className="flex items-start gap-2 rounded px-3 py-2"
          style={{
            backgroundColor:
              "color-mix(in oklch, var(--destructive) 8%, transparent)",
            borderColor:
              "color-mix(in oklch, var(--destructive) 18%, transparent)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-destructive" />
          <span className="text-xs text-destructive leading-relaxed">
            <span className="font-semibold">Compliance gap:</span> Inspection record shows &quot;Completed&quot; but audit log has no entry for this submission. During an ISO 45001 audit, this gap is an NCR — a documented non-conformance.
          </span>
        </div>
      )}
      {scenario === "atomic-write" && (
        <div
          className="flex items-start gap-2 rounded px-3 py-2"
          style={{
            backgroundColor:
              "color-mix(in oklch, var(--success) 8%, transparent)",
            borderColor:
              "color-mix(in oklch, var(--success) 18%, transparent)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[color:var(--success)]" />
          <span className="text-xs text-[color:var(--success)] leading-relaxed">
            <span className="font-semibold">Audit-complete:</span> Twilio failure does not affect record integrity. Both the inspection record and the audit log entry were committed in the same transaction — the compliance trail is intact.
          </span>
        </div>
      )}
    </div>
  );
}
