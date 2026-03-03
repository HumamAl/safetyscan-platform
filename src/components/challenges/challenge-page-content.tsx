"use client";

import type { ReactNode } from "react";
import type { Challenge } from "@/lib/types";
import { ChallengeCard } from "./challenge-card";
import { InspectionWorkflowViz } from "./inspection-workflow-viz";
import { AuthEnforcementViz } from "./auth-enforcement-viz";
import { AuditIntegrityViz } from "./audit-integrity-viz";

interface ChallengePageContentProps {
  challenges: Challenge[];
}

export function ChallengePageContent({ challenges }: ChallengePageContentProps) {
  const visualizations: Record<string, ReactNode> = {
    "challenge-1": <InspectionWorkflowViz />,
    "challenge-2": <AuthEnforcementViz />,
    "challenge-3": <AuditIntegrityViz />,
  };

  return (
    <div className="flex flex-col gap-4">
      {challenges.map((challenge, index) => (
        <ChallengeCard
          key={challenge.id}
          title={challenge.title}
          description={challenge.description}
          outcome={challenge.outcome}
          index={index}
          visualization={visualizations[challenge.id]}
        />
      ))}
    </div>
  );
}
