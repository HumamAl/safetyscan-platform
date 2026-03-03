import type { Metadata } from "next";
import { challenges, executiveSummary } from "@/data/challenges";
import { ExecutiveSummary } from "@/components/challenges/executive-summary";
import { ChallengePageContent } from "@/components/challenges/challenge-page-content";
import { CtaCloser } from "@/components/challenges/cta-closer";

export const metadata: Metadata = {
  title: "My Approach | SafetyScan",
};

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 space-y-6">
        {/* Page heading */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            My Engineering Approach
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            How I would tackle the three hardest problems in this platform — the
            failure modes, auth gaps, and audit constraints that separate a
            compliance-grade system from a CRUD app with roles.
          </p>
        </div>

        {/* Executive summary — dark banner */}
        <ExecutiveSummary data={executiveSummary} />

        {/* Challenge cards with visualizations */}
        <ChallengePageContent challenges={challenges} />

        {/* CTA closer */}
        <CtaCloser />
      </div>
    </div>
  );
}
