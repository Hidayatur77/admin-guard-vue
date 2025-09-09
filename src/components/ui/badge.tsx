import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-status-green text-white hover:bg-status-green/80",
        warning: "border-transparent bg-status-yellow text-status-yellow-bg hover:bg-status-yellow/80",
        danger: "border-transparent bg-status-red text-white hover:bg-status-red/80",
        "success-outline": "border-status-green text-status-green bg-status-green-bg hover:bg-status-green/10",
        "warning-outline": "border-status-yellow text-status-yellow bg-status-yellow-bg hover:bg-status-yellow/10",
        "danger-outline": "border-status-red text-status-red bg-status-red-bg hover:bg-status-red/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
