"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function InfoTip({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("group relative inline-flex align-middle", className)}>
      <button
        type="button"
        aria-label={`What does ${label} mean?`}
        className="focus-ring grid h-5 w-5 place-items-center rounded-full border bg-white text-muted-foreground transition hover:border-primary hover:text-primary"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      <span className="pointer-events-none absolute left-1/2 top-7 z-50 w-64 -translate-x-1/2 rounded-lg border bg-white p-3 text-left text-xs font-normal leading-5 text-slate-700 opacity-0 shadow-soft transition group-hover:opacity-100 group-focus-within:opacity-100">
        <span className="block font-semibold text-slate-950">{label}</span>
        <span className="mt-1 block">{children}</span>
      </span>
    </span>
  );
}

export function Term({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span>{label}</span>
      <InfoTip label={label}>{children}</InfoTip>
    </span>
  );
}
