import Link from "next/link";
import type { ExecutiveSummaryData } from "@/data/challenges";

interface ExecutiveSummaryProps {
  data: ExecutiveSummaryData;
}

export function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  const { commonApproach, differentApproach, accentWord } = data;

  const renderDifferentApproach = () => {
    if (!accentWord) return <span>{differentApproach}</span>;
    const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = differentApproach.split(new RegExp(`(${escaped})`, "i"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === accentWord.toLowerCase() ? (
            <span key={i} className="text-primary font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div
      className="relative overflow-hidden rounded p-5 md:p-6"
      style={{
        background: "oklch(0.12 0.04 245)",
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, oklch(0.28 0.08 245 / 0.20), transparent 60%)",
        borderLeft: "3px solid oklch(0.28 0.08 245)",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
        Approach Overview
      </p>
      <p className="text-sm leading-relaxed text-white/55">{commonApproach}</p>
      <div className="my-3 border-t border-white/10" />
      <p className="text-sm md:text-base leading-relaxed font-medium text-white/90">
        {renderDifferentApproach()}
      </p>
      <p className="text-xs text-white/35 mt-4">
        &larr;{" "}
        <Link
          href="/"
          className="hover:text-white/60 transition-colors duration-75 underline underline-offset-2"
        >
          Back to the live demo
        </Link>
      </p>
    </div>
  );
}
