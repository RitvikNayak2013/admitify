import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "border border-cyan-700/20 bg-gradient-to-b from-cyan-600 to-cyan-800 text-primary-foreground shadow-cyan-900/15 hover:from-cyan-500 hover:to-cyan-800",
        secondary: "border border-white/70 bg-white/80 text-secondary-foreground shadow-metal backdrop-blur hover:bg-white",
        outline: "border border-slate-300/80 bg-white/[0.65] text-slate-900 shadow-none backdrop-blur hover:border-cyan-700/35 hover:bg-white",
        ghost: "bg-transparent shadow-none hover:bg-slate-950/5",
        accent: "border border-amber-300/50 bg-gradient-to-b from-amber-300 to-amber-500 text-accent-foreground shadow-amber-900/15 hover:from-amber-200 hover:to-amber-500",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-5 text-base",
        icon: "h-10 w-10 px-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
