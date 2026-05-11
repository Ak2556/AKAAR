"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRAND_TAGLINE_SHORT } from "@/lib/brand";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  href?: string;
}

const sizeConfig = {
  sm: {
    crest: "h-10 w-10",
    brand: "text-base",
    tagline: "text-[10px]",
    gap: "gap-2.5",
    markImage: "h-10 w-10",
    fullImage: "h-10 w-auto",
  },
  md: {
    crest: "h-11 w-11",
    brand: "text-lg",
    tagline: "text-xs",
    gap: "gap-3",
    markImage: "h-11 w-11",
    fullImage: "h-12 w-auto",
  },
  lg: {
    crest: "h-14 w-14",
    brand: "text-2xl",
    tagline: "text-sm",
    gap: "gap-4",
    markImage: "h-14 w-14",
    fullImage: "h-16 w-auto",
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
  const showFullLogo = showTagline;

  const content = (
    <div className={cn("flex items-center", config.gap, className)}>
      {showFullLogo ? (
        <Image
          src="/brand/akaar-logo-full.png"
          alt="AKAAR 3D"
          width={320}
          height={80}
          className={cn("block", config.fullImage)}
          style={{ width: "auto" }}
          priority
        />
      ) : (
        <>
          <div
            className={cn(
              "relative flex items-center justify-center overflow-hidden rounded-[1.2rem] border border-[var(--border-accent)] bg-[var(--bg-primary)] shadow-[0_22px_55px_-40px_rgba(0,0,0,0.8)]",
              config.crest
            )}
          >
            <Image
              src="/brand/akaar-logo-mark.png"
              alt="AKAAR mark"
              width={48}
              height={48}
              className={cn("block object-contain p-1.5", config.markImage)}
              priority
            />
          </div>

          {showText ? (
            <div className="flex flex-col leading-none">
              <span className={cn("display-font font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)]", config.brand)}>
                AKAAR
              </span>
              {showTagline ? (
                <span className={cn("mt-1 font-mono uppercase tracking-[0.18em] text-[var(--text-muted)]", config.tagline)}>
                  {BRAND_TAGLINE_SHORT}
                </span>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="inline-flex">
      {content}
    </Link>
  );
}
