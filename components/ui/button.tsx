import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-inter  rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary border border-2 border-primary text-white hover:bg-secondary hover:text-primary hover:border-secondary",
        outline:
          "bg-transparent border border-2 border-third text-third hover:bg-third/10 hover:text-third hover:border-third",
        link: "bg-transparent text-primary hover:text-secondary",
        destructive: "bg-destructive text-white hover:bg-destructive-hover",
        muted: "bg-muted text-white hover:bg-muted-hover",
        accent: "bg-accent text-white hover:bg-accent-hover",
        popover: "bg-popover text-white hover:bg-popover-hover",
        card: "bg-card text-white hover:bg-card-hover",
        ghost: "bg-transparent hover:bg-muted/10",
      },
      size: {
        default: "px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
