"use client";

import { useState, type ElementType } from "react";
import {
  Wifi,
  ClipboardCheck,
  Server,
  Database,
  Bell,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "idle" | "running" | "success" | "failed" | "retry";

interface WorkflowStep {
  id: string;
  label: string;
  sublabel: string;
  icon: ElementType;
  failPoint?: string;
}

const STEPS: WorkflowStep[] = [
  {
    id: "nfc",
    label: "NFC Scan",
    sublabel: "Tag read + GPS",
    icon: Wifi,
  },
  {
    id: "form",
    label: "Inspection Form",
    sublabel: "Checklist submit",
    icon: ClipboardCheck,
  },
  {
    id: "api",
    label: "API Write",
    sublabel: "Idempotency key",
    icon: Server,
    failPoint: "Network timeout",
  },
  {
    id: "db",
    label: "Database",
    sublabel: "Atomic transaction",
    icon: Database,
    failPoint: "Write conflict",
  },
  {
    id: "notify",
    label: "Notification",
    sublabel: "Twilio / Resend",
    icon: Bell,
    failPoint: "Delivery failure",
  },
  {
    id: "audit",
    label: "Audit Log",
    sublabel: "Immutable entry",
    icon: ShieldCheck,
  },
];

type Mode = "problem" | "solution";

export function InspectionWorkflowViz() {
  const [mode, setMode] = useState<Mode>("problem");
  const [runningStep, setRunningStep] = useState<number | null>(null);
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(
    {}
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const resetAnimation = () => {
    setStepStatuses({});
    setRunningStep(null);
    setIsAnimating(false);
  };

  const runSimulation = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStepStatuses({});
    setRunningStep(null);

    // Problem mode: silent failure at API step — DB and audit never written
    // Solution mode: retry + guaranteed audit
    const steps = STEPS;
    const failAtStep = mode === "problem" ? 2 : -1; // index 2 = API Write in problem mode
    const retryStep = mode === "solution" ? 2 : -1;

    for (let i = 0; i < steps.length; i++) {
      setRunningStep(i);
      await delay(420);

      if (i === failAtStep && mode === "problem") {
        setStepStatuses((prev) => ({ ...prev, [steps[i].id]: "failed" }));
        // Mark remaining as never reached
        await delay(200);
        for (let j = i + 1; j < steps.length; j++) {
          setStepStatuses((prev) => ({ ...prev, [steps[j].id]: "idle" }));
        }
        setRunningStep(null);
        setIsAnimating(false);
        return;
      }

      if (i === retryStep && mode === "solution") {
        // Show transient retry, then success
        setStepStatuses((prev) => ({ ...prev, [steps[i].id]: "retry" }));
        await delay(600);
      }

      setStepStatuses((prev) => ({ ...prev, [steps[i].id]: "success" }));
    }

    setRunningStep(null);
    setIsAnimating(false);
  };

  const getStepStyle = (step: WorkflowStep, index: number) => {
    const status = stepStatuses[step.id];
    const isRunning = runningStep === index;

    if (isRunning) {
      return "border-primary bg-primary/10 text-foreground";
    }
    if (status === "success") {
      return "border-[color:var(--success)] bg-[color-mix(in_oklch,var(--success)_8%,transparent)] text-[color:var(--success)]";
    }
    if (status === "failed") {
      return "border-destructive bg-destructive/8 text-destructive";
    }
    if (status === "retry") {
      return "border-[color:var(--warning)] bg-[color-mix(in_oklch,var(--warning)_8%,transparent)] text-[color:var(--warning)]";
    }
    return "border-border bg-card text-muted-foreground";
  };

  const hasFailure =
    mode === "problem" &&
    Object.values(stepStatuses).some((s) => s === "failed");

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 bg-muted/60 rounded p-0.5 w-fit">
        <button
          onClick={() => {
            setMode("problem");
            resetAnimation();
          }}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded transition-colors duration-75",
            mode === "problem"
              ? "bg-card text-foreground shadow-sm border border-border/60"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Problem State
        </button>
        <button
          onClick={() => {
            setMode("solution");
            resetAnimation();
          }}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded transition-colors duration-75",
            mode === "solution"
              ? "bg-card text-foreground shadow-sm border border-border/60"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          With Reliability Layer
        </button>
      </div>

      {/* Chain steps */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {STEPS.map((step, i) => {
          const status = stepStatuses[step.id];
          const isRunning = runningStep === i;
          const isFailed = status === "failed";
          const isRetrying = status === "retry";
          const isSuccess = status === "success";

          return (
            <div key={step.id} className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex items-center gap-1.5 border rounded px-2.5 py-1.5 transition-all duration-75",
                  getStepStyle(step, i)
                )}
              >
                {isRetrying ? (
                  <RefreshCw className="w-3.5 h-3.5 shrink-0 animate-spin" />
                ) : isFailed ? (
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <step.icon className="w-3.5 h-3.5 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-medium leading-none">{step.label}</p>
                  <p
                    className={cn(
                      "text-[10px] leading-none mt-0.5",
                      isFailed || isRetrying ? "opacity-90" : "opacity-60"
                    )}
                  >
                    {isFailed && step.failPoint
                      ? step.failPoint
                      : isRetrying
                      ? "Retrying..."
                      : step.sublabel}
                  </p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <span
                  className={cn(
                    "text-xs font-mono select-none transition-colors duration-75",
                    isFailed ? "text-destructive" : "text-border"
                  )}
                >
                  {isFailed ? "✗" : "→"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* State label */}
      {hasFailure && (
        <div
          className="flex items-start gap-2 rounded px-3 py-2 text-sm"
          style={{
            backgroundColor: "color-mix(in oklch, var(--destructive) 8%, transparent)",
            borderColor: "color-mix(in oklch, var(--destructive) 18%, transparent)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-destructive" />
          <span className="text-destructive text-xs leading-relaxed">
            <span className="font-semibold">Silent failure:</span> API write timed out. No retry attempted. Database write, notification, and audit log entry were never executed — the inspection chain is broken with no observable signal.
          </span>
        </div>
      )}
      {mode === "solution" &&
        !isAnimating &&
        Object.values(stepStatuses).every((s) => s === "success") &&
        Object.keys(stepStatuses).length === STEPS.length && (
          <div
            className="flex items-start gap-2 rounded px-3 py-2 text-sm"
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
            <span className="text-[color:var(--success)] text-xs leading-relaxed">
              <span className="font-semibold">Chain complete:</span> API retry succeeded on second attempt. Database write, notification, and audit log entry all committed atomically. Full inspection record preserved.
            </span>
          </div>
        )}

      {/* Run button */}
      <button
        onClick={runSimulation}
        disabled={isAnimating}
        className={cn(
          "text-xs font-medium px-3 py-1.5 rounded border transition-colors duration-75",
          isAnimating
            ? "border-border/40 text-muted-foreground cursor-not-allowed"
            : "border-primary/40 text-primary hover:bg-primary/8 bg-primary/4"
        )}
      >
        {isAnimating ? "Simulating..." : "Simulate inspection chain →"}
      </button>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
