import type { Challenge } from "@/lib/types";

export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most developers treat compliance platforms as CRUD apps with roles bolted on — happy-path implementations where NFC scan triggers a form, the form submits to the database, and a notification fires. Silent failures, partial writes, and orphaned audit records are handled as afterthoughts, if at all.",
  differentApproach:
    "I approach this as a system where every step in the chain — scan, inspect, write, notify, audit — must either complete reliably or fail observably with a guaranteed recovery path. Idempotency, atomic audit writes, and boundary-enforced RBAC are constraints I build in from day one, not patched in later.",
  accentWord: "fail observably",
};

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "End-to-End Inspection Workflow Reliability",
    description:
      "The NFC scan → inspection → API write → database → notification → audit chain spans multiple services. Any silent failure mid-chain leaves inspection records in an inconsistent state — a compliance gap that may not surface until an external audit.",
    visualizationType: "flow",
    outcome:
      "Could reduce broken inspection chains from silent failures to observable, retry-handled events — so every scan either produces a complete audit record or a clearly flagged exception visible in the operations dashboard.",
  },
  {
    id: "challenge-2",
    title: "Auth Enforcement Gaps Across Protected Routes",
    description:
      "OIDC token validation and RBAC guards applied only at the frontend layer leave API boundaries unprotected. An inspector-role user can craft requests that reach Safety Manager or Site Admin endpoints directly — a real risk in a multi-tenant compliance platform.",
    visualizationType: "before-after",
    outcome:
      "Could eliminate unauthorized role access by enforcing OIDC token validation and RBAC guards at every API boundary — so frontend route guards become a UX convenience, not the only security layer.",
  },
  {
    id: "challenge-3",
    title: "Audit Log Integrity Under Partial Failures",
    description:
      "Audit log entries written outside the inspection transaction can be lost or orphaned when a downstream step (e.g., Twilio notification) fails. A finding created, a notification dropped, and an audit log entry never written produces a compliance record that doesn't match reality.",
    visualizationType: "architecture",
    outcome:
      "Could ensure audit records are written atomically with inspection state changes — so a failed Twilio SMS or Resend email never results in a missing or inconsistent log entry in the compliance audit trail.",
  },
];
