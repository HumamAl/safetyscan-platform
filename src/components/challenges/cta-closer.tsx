"use client";

import Link from "next/link";

export function CtaCloser() {
  return (
    <section className="border border-border rounded p-5 bg-card shadow-[0_1px_2px_0_rgb(0_0_0/0.06)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">
            Ready to discuss the approach?
          </h3>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            I&apos;ve thought through the failure modes. Happy to walk through any of
            this in a call — including how the audit atomicity and RBAC patterns
            apply to your specific Keycloak setup.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/proposal"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-75"
          >
            See the proposal &rarr;
          </Link>
          <span className="text-xs font-semibold bg-primary/10 border border-primary/25 text-primary px-3 py-1.5 rounded">
            Reply on Upwork to start
          </span>
        </div>
      </div>
    </section>
  );
}
