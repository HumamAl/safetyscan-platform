import { ExternalLink, TrendingUp, CheckCircle } from "lucide-react";
import { APP_CONFIG } from "@/lib/config";
import { proposalData } from "@/data/proposal";

export default function ProposalPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">

      {/* ── Section 1: Hero — Project Brief ── */}
      <section
        className="rounded overflow-hidden"
        style={{ background: "oklch(0.10 0.02 var(--primary-h, 245))" }}
      >
        {/* Header panel */}
        <div className="px-8 py-8 space-y-5">
          {/* Effort badge */}
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span className="text-xs text-white/60 tracking-wider uppercase font-mono">
              {proposalData.hero.badge}
            </span>
          </div>

          {/* Role prefix */}
          <p className="text-xs font-mono tracking-widest uppercase text-white/40">
            Full-Stack Developer · Compliance SaaS Specialist
          </p>

          {/* Name headline */}
          <h1 className="text-4xl md:text-5xl tracking-tight leading-none">
            <span className="font-light text-white/70">Hi, I&apos;m</span>{" "}
            <span className="font-bold text-white">{proposalData.hero.name}</span>
          </h1>

          {/* Tailored value prop */}
          <p className="text-base text-white/65 max-w-2xl leading-relaxed">
            {proposalData.hero.valueProp}
          </p>
        </div>

        {/* Stats shelf */}
        <div className="border-t border-white/10 bg-white/5 px-8 py-4">
          <div className="grid grid-cols-3 gap-6">
            {proposalData.hero.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Proof of Work ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
            Proof of Work
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">Relevant Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Selected for domain overlap with {APP_CONFIG.projectName}.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {proposalData.portfolioProjects.map((project) => (
            <div
              key={project.name}
              className="bg-card border border-border shadow-[var(--card-shadow)] rounded p-4 space-y-3 hover:border-primary/30 transition-colors"
              style={{ transitionDuration: "var(--dur-fast)" }}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold">{project.name}</h3>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary shrink-0 transition-colors"
                    style={{ transitionDuration: "var(--dur-fast)" }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {/* Outcome — exact from developer-profile.md */}
              <div className="flex items-start gap-2 text-xs text-[color:var(--success)]">
                <TrendingUp className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{project.outcome}</span>
              </div>

              {/* Relevance note */}
              {project.relevance && (
                <p className="text-xs text-primary/70 border-t border-border/60 pt-2">
                  {project.relevance}
                </p>
              )}

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded border border-border/60 text-xs font-mono text-muted-foreground bg-muted/40"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: How I Work ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
            Process
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>

        <h2 className="text-xl font-semibold tracking-tight">How I Work</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {proposalData.approach.map((step) => (
            <div
              key={step.step}
              className="bg-card border border-border shadow-[var(--card-shadow)] rounded p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
                  Step {step.step}
                </span>
                <span className="text-xs font-mono text-muted-foreground/60">
                  {step.timeline}
                </span>
              </div>
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Skills Grid ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground">
            Tech Stack
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>

        <h2 className="text-xl font-semibold tracking-tight">What I Build With</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {proposalData.skills.map((category) => (
            <div
              key={category.category}
              className="bg-card border border-border shadow-[var(--card-shadow)] rounded p-3 space-y-2"
            >
              <p className="text-xs font-mono text-muted-foreground tracking-wide">
                {category.category}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded border border-border/60 text-xs font-mono text-foreground/80 bg-muted/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: CTA ── */}
      <section
        className="rounded overflow-hidden"
        style={{ background: "oklch(0.10 0.02 var(--primary-h, 245))" }}
      >
        <div className="px-8 py-8 space-y-4">
          {/* Pulsing availability indicator */}
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[color:var(--success)]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
            </span>
            <span
              className="text-xs"
              style={{ color: "color-mix(in oklch, var(--success) 80%, white)" }}
            >
              {proposalData.cta.availability}
            </span>
          </div>

          {/* Headline — tailored to compliance SaaS trial */}
          <h2 className="text-xl font-semibold text-white leading-snug max-w-xl">
            {proposalData.cta.headline}
          </h2>

          {/* Body — specific to this demo and trial context */}
          <p className="text-sm text-white/60 max-w-lg leading-relaxed">
            {proposalData.cta.body}
          </p>

          {/* Compliance credibility signal */}
          <div className="flex items-start gap-2 text-xs text-white/50 max-w-lg">
            <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[color:var(--success)]/70" />
            <span>
              Done = one critical component (auth enforcement, inspection workflow, or audit log
              integrity) hardened with error handling, logging, and test coverage — plus a handoff
              doc so another engineer can read what changed and why.
            </span>
          </div>

          {/* Primary action — text, not a dead button */}
          <p className="text-base font-semibold text-white pt-2">
            {proposalData.cta.action}
          </p>

          {/* Back link to demo */}
          <a
            href="/"
            className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/60 transition-colors"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            ← Back to the demo
          </a>

          {/* Signature */}
          <p className="text-xs text-white/30 pt-4 border-t border-white/10">
            — Humam
          </p>
        </div>
      </section>

    </div>
  );
}
