"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, X, ZoomIn } from "lucide-react";

interface ImageLightboxProps {
  images: string[];
  startIndex: number;
  alt: string;
  open: boolean;
  onClose: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;
const DOUBLE_TAP_ZOOM = 2.5;

export function ImageLightbox({
  images,
  startIndex,
  alt,
  open,
  onClose,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Drag state lives in refs so we don't re-render on every pointer move
  const dragState = useRef({
    dragging: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });

  // Pinch-to-zoom state for touch
  const pinchState = useRef<{
    pointers: Map<number, { x: number; y: number }>;
    startDistance: number;
    startZoom: number;
  }>({ pointers: new Map(), startDistance: 0, startZoom: 1 });

  const lastTap = useRef<number>(0);

  // Resync index whenever the consumer opens the lightbox at a new image
  useEffect(() => {
    if (open) {
      setIndex(startIndex);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [open, startIndex]);

  // Lock body scroll while the lightbox is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [images.length]);

  // Keyboard controls
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
      else if (e.key === "-") setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));
      else if (e.key === "0") {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext, onClose]);

  // Reset pan offset when zoom returns to 1
  useEffect(() => {
    if (zoom === 1) setOffset({ x: 0, y: 0 });
  }, [zoom]);

  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));

  // ── Pointer handlers (mouse + touch unified) ────────────────────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const now = Date.now();
    const isTouch = e.pointerType === "touch";

    if (isTouch) {
      pinchState.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinchState.current.pointers.size === 2) {
        const [p1, p2] = Array.from(pinchState.current.pointers.values());
        pinchState.current.startDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        pinchState.current.startZoom = zoom;
        dragState.current.dragging = false;
        return;
      }

      // Detect double-tap on a single pointer to toggle zoom
      if (now - lastTap.current < 280) {
        setZoom((z) => (z > 1 ? 1 : DOUBLE_TAP_ZOOM));
        lastTap.current = 0;
        return;
      }
      lastTap.current = now;
    }

    if (zoom <= 1) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragState.current = {
      dragging: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Pinch-to-zoom
    if (pinchState.current.pointers.has(e.pointerId)) {
      pinchState.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinchState.current.pointers.size === 2 && pinchState.current.startDistance > 0) {
        const [p1, p2] = Array.from(pinchState.current.pointers.values());
        const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        const ratio = distance / pinchState.current.startDistance;
        const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, pinchState.current.startZoom * ratio));
        setZoom(+next.toFixed(2));
        return;
      }
    }

    if (!dragState.current.dragging || e.pointerId !== dragState.current.pointerId) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset({
      x: dragState.current.startOffsetX + dx,
      y: dragState.current.startOffsetY + dy,
    });
  };

  const endPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    pinchState.current.pointers.delete(e.pointerId);
    if (pinchState.current.pointers.size < 2) {
      pinchState.current.startDistance = 0;
    }
    if (e.pointerId === dragState.current.pointerId) {
      dragState.current.dragging = false;
      dragState.current.pointerId = -1;
    }
  };

  // Mouse wheel zoom
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey && !e.metaKey && Math.abs(e.deltaY) < 8) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, +(z + delta).toFixed(2))));
  };

  if (!open || images.length === 0) return null;

  const currentImage = images[Math.min(index, images.length - 1)];
  const canPaginate = images.length > 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — zoomable image viewer`}
      onClick={(e) => {
        // Only close when the backdrop itself is clicked
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top toolbar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3 sm:p-5">
        <div className="pointer-events-auto rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
          {index + 1} / {images.length} · {Math.round(zoom * 100)}%
        </div>
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-40"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-40"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Prev / next */}
      {canPaginate && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-5"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-5"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Stage */}
      <div
        className="relative h-full w-full touch-none select-none overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onPointerLeave={endPointer}
        onWheel={onWheel}
        style={{ cursor: zoom > 1 ? (dragState.current.dragging ? "grabbing" : "grab") : "zoom-in" }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform"
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`,
            transformOrigin: "center center",
            transitionDuration: dragState.current.dragging ? "0ms" : "150ms",
            willChange: "transform",
          }}
        >
          <div className="relative h-full w-full">
            <Image
              src={currentImage}
              alt={alt}
              fill
              sizes="100vw"
              draggable={false}
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Hint footer */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center px-3 sm:bottom-6">
        <div className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/80 backdrop-blur-sm">
          <span className="inline-flex items-center gap-1.5">
            <ZoomIn className="h-3 w-3" />
            <span className="hidden sm:inline">Scroll or +/− to zoom · drag to pan · Esc to close</span>
            <span className="sm:hidden">Double-tap to zoom · pinch to scale</span>
          </span>
        </div>
      </div>
    </div>
  );
}
