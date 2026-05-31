import { cn } from "@/lib/utils";

export function ScoreRing({ score, size = "lg" }: { score: number; size?: "sm" | "lg" }) {
  const dimension = size === "lg" ? "h-36 w-36" : "h-24 w-24";
  const text = size === "lg" ? "text-4xl" : "text-2xl";
  return (
    <div
      className={cn("grid place-items-center rounded-full", dimension)}
      style={{
        background: `conic-gradient(hsl(var(--primary)) ${score * 3.6}deg, hsl(var(--secondary)) 0deg)`
      }}
      aria-label={`Dream Fit Readiness Score ${score}`}
    >
      <div className="grid h-[82%] w-[82%] place-items-center rounded-full bg-white text-slate-950 shadow-sm">
        <div className="text-center">
          <p className={cn("font-bold leading-none", text)}>{score}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-normal text-muted-foreground">Readiness</p>
        </div>
      </div>
    </div>
  );
}
