"use client";

import { createElement, useEffect, useState } from "react";
import Script from "next/script";
import { Eye, X } from "lucide-react";

interface ArQuickLookProps {
  modelUrl: string;
  iosSrc?: string | null;
  name: string;
}

export function ArQuickLook({ modelUrl, iosSrc, name }: ArQuickLookProps) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the viewer is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <>
      <Script
        type="module"
        strategy="lazyOnload"
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
      />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-accent)] bg-[var(--bg-secondary)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-highlight)]"
      >
        <Eye className="h-3 w-3 text-[var(--accent)]" />
        View in AR
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} — augmented reality preview`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close AR viewer"
          >
            <X className="h-5 w-5" />
          </button>

          {createElement("model-viewer", {
            src: modelUrl,
            ...(iosSrc ? { "ios-src": iosSrc } : {}),
            alt: name,
            ar: true,
            "ar-modes": "webxr scene-viewer quick-look",
            "camera-controls": true,
            "auto-rotate": true,
            "shadow-intensity": "1",
            exposure: "1",
            style: {
              width: "100%",
              height: "100%",
              maxWidth: "900px",
              maxHeight: "80vh",
              background: "#0a0a0a",
              borderRadius: "1.5rem",
            },
          })}

          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center px-4">
            <div className="rounded-full bg-white/10 px-4 py-2 text-[11px] font-medium text-white/85 backdrop-blur-sm">
              Tap the AR icon to place this in your room
              {!iosSrc ? " · Android works out of the box" : ""}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
