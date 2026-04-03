"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  href?: string;
}

const sizeConfig = {
  sm: {
    icon: "w-8 h-8",
    iconText: "text-lg",
    brandText: "text-lg",
    taglineText: "text-[10px]",
    gap: "gap-2",
  },
  md: {
    icon: "w-10 h-10",
    iconText: "text-xl",
    brandText: "text-xl",
    taglineText: "text-xs",
    gap: "gap-3",
  },
  lg: {
    icon: "w-12 h-12",
    iconText: "text-2xl",
    brandText: "text-2xl",
    taglineText: "text-sm",
    gap: "gap-3",
  },
};

export function Logo({
  size = "md",
  showText = true,
  showTagline = true,
  className,
  href = "/",
}: LogoProps) {
  const config = sizeConfig[size];

  const logoContent = (
    <div className={cn("flex items-center group", config.gap, className)}>
      {/* Icon Mark - Stylized 'A' with gradient */}
      <div className="relative">
        <div
          className={cn(
            config.icon,
            "bg-gradient-to-br from-[#0ea5e9] via-[#3b82f6] to-[#2563eb] rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 shadow-lg"
          )}
        >
          {/* Inner 'A' shape */}
          <div className="relative">
            <span className={cn("text-white font-bold", config.iconText)}>
              A
            </span>
            {/* Small 3D indicator */}
            <span className="absolute -bottom-0.5 -right-1 text-[8px] font-bold text-white/80">
              3D
            </span>
          </div>
        </div>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] rounded-lg blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={cn("font-bold tracking-wide", config.brandText)}>
            AKAAR{" "}
            <span className="text-[var(--accent)] font-extrabold">3D</span>
          </span>
          {showTagline && (
            <span
              className={cn(
                "text-[var(--text-muted)] -mt-0.5 tracking-wide",
                config.taglineText
              )}
            >
              Giving AKAAR to Ideas
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
