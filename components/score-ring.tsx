import { cn } from "@/lib/utils";

export function ScoreRing({ score, size = "lg" }: { score: number; size?: "sm" | "lg" }) {
  const dimension = size === "lg" ? "h-36 w-36" : "h-24 w-24";
  const text = size === "lg" ? "text-4xl" : "text-2xl";
  return (
    <div
      className={cn("grid place-items-center rounded-full", dimension)}
      style={{
        background: `conic-gradient(#0e7490 0deg, #22d3ee ${Math.max(0, score * 2.5)}deg, #f59e0b ${score * 3.6}deg, rgba(226, 232, 240, 0.82) 0deg)`
      }}
      aria-label={`Dream Fit Readiness Score ${score}`}
    >
      <div className="grid h-[82%] w-[82%] place-items-center rounded-full border border-white/70 bg-white text-slate-950 shadow-metal">
        <div className="text-center">
          <p className={cn("font-bold leading-none", text)}>{score}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-normal text-muted-foreground">Readiness</p>
        </div>
      </div>
    </div>
  );
}
