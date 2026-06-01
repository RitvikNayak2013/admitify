import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur", {
  variants: {
    variant: {
      default: "border-cyan-700/20 bg-cyan-700 text-white",
      secondary: "border-slate-300/70 bg-white/70 text-slate-700",
      outline: "border-slate-300/80 bg-white/50 text-slate-700",
      success: "border-emerald-200 bg-emerald-50 text-emerald-800",
      warning: "border-amber-200 bg-amber-50 text-amber-900",
      info: "border-cyan-200 bg-cyan-50 text-cyan-900",
      rose: "border-rose-200 bg-rose-50 text-rose-800"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
