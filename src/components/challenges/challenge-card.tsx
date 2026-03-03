import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { OutcomeStatement } from "./outcome-statement";

interface ChallengeCardProps {
  title: string;
  description: string;
  outcome?: string;
  index: number;
  visualization: ReactNode;
  className?: string;
}

export function ChallengeCard({
  title,
  description,
  outcome,
  index,
  visualization,
  className,
}: ChallengeCardProps) {
  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      className={cn(
        "bg-card border border-border rounded p-5 space-y-4",
        "shadow-[0_1px_2px_0_rgb(0_0_0/0.06)] hover:shadow-[0_2px_6px_0_rgb(0_0_0/0.10)]",
        "transition-shadow duration-75",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-xs font-bold tabular-nums text-muted-foreground w-5 shrink-0 mt-0.5">
          {stepNumber}
        </span>
        <div>
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {visualization}

      {outcome && <OutcomeStatement outcome={outcome} />}
    </div>
  );
}
