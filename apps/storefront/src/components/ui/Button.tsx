"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full font-medium tracking-[0.01em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50";

    const variants = {
      primary:
        "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-[0_20px_50px_-30px_rgba(255,255,255,0.35)] hover:-translate-y-0.5 hover:shadow-[0_25px_60px_-30px_rgba(255,255,255,0.4)]",
      secondary:
        "luxury-card text-[var(--text-primary)] hover:-translate-y-0.5",
      outline:
        "border border-[var(--border-accent)] bg-transparent text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--surface-highlight)]",
      ghost:
        "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]",
    };

    const sizes = {
      sm: "px-4 py-2.5 text-sm",
      md: "px-6 py-3 text-sm sm:text-base",
      lg: "px-7 py-3.5 text-base sm:px-8 sm:py-4",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: props.disabled ? 0 : -1 }}
        whileTap={{ scale: props.disabled ? 1 : 0.985 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          glow && "ring-1 ring-[var(--accent)]/25",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
