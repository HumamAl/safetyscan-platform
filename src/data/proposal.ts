// Proposal page data — SafetyScan Platform
// All portfolio outcomes are exact text from references/developer-profile.md.
// Never inflate claims.

export const proposalData = {
  hero: {
    name: "Humam",
    valueProp:
      "I build compliance SaaS platforms with audit-grade inspection workflows, OIDC-enforced access control, and reliable notification delivery — and I've already built one for your review in Tab 1.",
    badge: "Built this demo for your project",
    stats: [
      { value: "24+", label: "Projects Shipped" },
      { value: "< 48hr", label: "Demo Turnaround" },
      { value: "15+", label: "Industries" },
    ],
  },

  portfolioProjects: [
    {
      name: "Fleet Maintenance SaaS",
      description:
        "Asset tracking, work orders, preventive maintenance scheduling, inspections, parts inventory, and analytics across a full 6-module SaaS platform. Multi-entity data with relational IDs, scheduled workflows, and inspection status tracking — structurally similar to what you're building.",
      outcome:
        "6-module SaaS covering the full maintenance lifecycle — from asset registry to work orders to parts inventory",
      tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "Recharts"],
      url: null,
      relevance:
        "Direct structural match — asset registry, inspection scheduling, and status tracking are the core loops in both platforms.",
    },
    {
      name: "PayGuard — Transaction Monitor",
      description:
        "Compliance monitoring dashboard with transaction flagging, multi-account linking, alert delivery tracking, and prohibited merchant detection. Built around the idea that silent failures in a monitoring chain are a compliance liability.",
      outcome:
        "Compliance monitoring dashboard with transaction flagging, multi-account linking, and alert delivery tracking",
      tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "Recharts"],
      url: "https://payment-monitor.vercel.app",
      relevance:
        "Same failure-mode thinking your platform requires — if an alert doesn't deliver, the system must surface it, not silently drop it.",
    },
    {
      name: "Auction Violations Monitor",
      description:
        "Compliance monitoring tool tracking violations, seller behavior patterns, and enforcement actions. Violation detection pipeline with structured status tracking and escalation workflows.",
      outcome:
        "Compliance dashboard with violation detection, seller flagging, and enforcement action tracking",
      tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
      url: "https://auction-violations.vercel.app",
      relevance:
        "Enforcement workflow pattern — finding → assign → escalate → close — mirrors your Finding and CAR lifecycle.",
    },
    {
      name: "eBay Pokemon Monitor",
      description:
        "Real-time listing monitor using the eBay Browse API with webhook-based Discord alerts and price trend tracking. Event-driven notification pipeline with delivery confirmation — the same reliability guarantee your Twilio/Resend notification layer needs.",
      outcome:
        "Real-time listing monitor with webhook-based Discord alerts and price trend tracking",
      tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
      url: "https://ebay-pokemon-monitor.vercel.app",
      relevance:
        "Notification reliability pattern — dispatch, confirm delivery, surface failures — directly applicable to your Twilio + Resend stack.",
    },
  ],

  approach: [
    {
      step: "01",
      title: "Audit the System",
      description:
        "Map the existing architecture — auth enforcement boundaries, inspection workflow edges, audit log write paths. Ask the one question that surfaces the highest-risk failure mode before writing a line of code.",
      timeline: "Day 1–2",
    },
    {
      step: "02",
      title: "Harden the Weakest Link",
      description:
        "Working code targeting the critical path first: OIDC token validation at API boundaries, idempotent inspection writes, and atomic audit log entries. Visible progress every 2–3 days. No dark periods.",
      timeline: "Week 1–2",
    },
    {
      step: "03",
      title: "Ship with Documentation",
      description:
        "Production-ready on Vercel with TypeScript strict mode, structured error handling, and a handoff doc covering what changed, why, and what the next engineer needs to know. Clean code you can hand off without apology.",
      timeline: "End of trial",
    },
    {
      step: "04",
      title: "Iterate Safely",
      description:
        "Short feedback cycles with explicit change scoping. New requirements get evaluated against the existing auth and audit model — no shortcuts that create new failure modes downstream.",
      timeline: "Ongoing",
    },
  ],

  skills: [
    {
      category: "Frontend",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    },
    {
      category: "Backend & APIs",
      items: [
        "Node.js",
        "REST API Design",
        "PostgreSQL",
        "Webhook Handling",
        "Queue Systems",
      ],
    },
    {
      category: "Auth & Security",
      items: [
        "Keycloak",
        "OIDC / OAuth2",
        "RBAC",
        "JWT Validation",
        "API Boundary Guards",
      ],
    },
    {
      category: "Infrastructure & Notifications",
      items: ["Vercel", "Cloudflare", "Twilio", "Resend", "AWS"],
    },
  ],

  cta: {
    headline: "Ready to make your inspection chain fail-safe — end to end.",
    body: "The demo in Tab 1 shows the full NFC scan → inspection → audit log flow already working. The trial deliverable is one component hardened with error handling, logging, and a handoff doc — shipped in production-quality TypeScript.",
    action: "Reply on Upwork to start",
    availability: "Currently available for new projects",
  },
};
