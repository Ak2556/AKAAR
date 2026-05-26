"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { parseStl, type GeometrySummary } from "@/lib/stl-geometry";
import {
  formatBuildTime,
  formatVolume,
  MATERIALS,
  FINISHES,
  PRINTER_BUILD_VOLUME_MM,
  priceFromGeometry,
  type PriceBreakdown,
} from "@/lib/pricing";
import { useSettings } from "@/context/SettingsContext";

interface QuickQuoteEstimatorProps {
  defaultMaterialId?: string;
  quantity?: number;
  onChange?: (state: {
    file: File | null;
    geometry: GeometrySummary | null;
    breakdown: PriceBreakdown | null;
    materialId: string;
    finishId: string;
    infillPct: number;
  }) => void;
}

export function QuickQuoteEstimator({
  defaultMaterialId = "pla",
  quantity = 1,
  onChange,
}: QuickQuoteEstimatorProps) {
  const { formatPrice } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [geometry, setGeometry] = useState<GeometrySummary | null>(null);
  const [materialId, setMaterialId] = useState(defaultMaterialId);
  const [finishId, setFinishId] = useState("standard");
  const [infillPct, setInfillPct] = useState(
    MATERIALS.find((m) => m.id === defaultMaterialId)?.defaultInfillPct ?? 20
  );

  const breakdown: PriceBreakdown | null = useMemo(() => {
    if (!geometry) return null;
    return priceFromGeometry({
      volumeMm3: geometry.volumeMm3,
      surfaceAreaMm2: geometry.surfaceAreaMm2,
      boundingBoxMm: geometry.boundingBoxMm,
      materialId,
      finishId,
      infillPct,
      quantity,
    });
  }, [geometry, materialId, finishId, infillPct, quantity]);

  const notify = useCallback(() => {
    onChange?.({ file, geometry, breakdown, materialId, finishId, infillPct });
  }, [file, geometry, breakdown, materialId, finishId, infillPct, onChange]);

  // Fire onChange on every meaningful state change
  useEffect(() => {
    notify();
  }, [notify]);

  const handleFile = async (picked: File | null) => {
    setFile(picked);
    setGeometry(null);
    setParseError(null);
    if (!picked) return;

    const ext = picked.name.toLowerCase().split(".").pop();
    if (ext !== "stl") {
      setParseError("Instant quotes are STL-only for now. Use the upload section below for STEP/3MF/etc.");
      return;
    }
    if (picked.size > 50 * 1024 * 1024) {
      setParseError("STL files larger than 50MB time out in the browser — please use the upload below for a manual quote.");
      return;
    }

    setParsing(true);
    try {
      const buffer = await picked.arrayBuffer();
      const summary = parseStl(buffer);
      setGeometry(summary);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Could not parse this STL file");
    } finally {
      setParsing(false);
    }
  };

  const oversize =
    geometry &&
    (geometry.boundingBoxMm.x > PRINTER_BUILD_VOLUME_MM.x ||
      geometry.boundingBoxMm.y > PRINTER_BUILD_VOLUME_MM.y ||
      geometry.boundingBoxMm.z > PRINTER_BUILD_VOLUME_MM.z);

  return (
    <section className="luxury-card rounded-[1.8rem] p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <p className="luxury-kicker">Instant estimate</p>
          <h3 className="display-font mt-1 text-2xl text-[var(--text-primary)]">
            Upload an STL — get a price in seconds
          </h3>
        </div>
      </div>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        Parsed entirely in your browser — your file is not uploaded anywhere until you press
        submit on the form below.
      </p>

      {/* Drop zone */}
      <div className="mt-6 rounded-[1.6rem] border border-dashed border-[var(--border)] bg-[var(--bg-primary)] p-5">
        {file ? (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">{file.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setGeometry(null);
                setParseError(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="text-[var(--text-muted)] hover:text-rose-400"
              aria-label="Remove STL"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center justify-center gap-2 py-4 text-sm text-[var(--accent)] hover:underline">
            <Upload className="h-4 w-4" />
            Choose an STL file
            <input
              ref={fileInputRef}
              type="file"
              accept=".stl"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </div>

      {parsing ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Loader2 className="h-4 w-4 animate-spin" /> Computing volume and bounding box…
        </div>
      ) : null}

      {parseError ? (
        <div className="mt-4 rounded-[1.2rem] border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          <p className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{parseError}</span>
          </p>
        </div>
      ) : null}

      {/* Material + finish + infill controls */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Material">
          <select
            value={materialId}
            onChange={(e) => {
              setMaterialId(e.target.value);
              const next = MATERIALS.find((m) => m.id === e.target.value);
              if (next) setInfillPct(next.defaultInfillPct);
            }}
            className="luxury-input w-full rounded-full px-4 py-2.5 text-sm"
          >
            {MATERIALS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label} — ₹{m.ratePerCm3}/cm³
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            {MATERIALS.find((m) => m.id === materialId)?.description}
          </p>
        </Field>

        <Field label="Finish">
          <select
            value={finishId}
            onChange={(e) => setFinishId(e.target.value)}
            className="luxury-input w-full rounded-full px-4 py-2.5 text-sm"
          >
            {FINISHES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label} — ×{f.multiplier.toFixed(2)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-[var(--text-muted)]">
            {FINISHES.find((f) => f.id === finishId)?.description}
          </p>
        </Field>

        <Field
          label={`Infill — ${materialId === "resin" ? "100% (resin is solid)" : `${infillPct}%`}`}
          className="sm:col-span-2"
        >
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={materialId === "resin" ? 100 : infillPct}
            disabled={materialId === "resin"}
            onChange={(e) => setInfillPct(Number(e.target.value))}
            className="w-full accent-[var(--accent)] disabled:opacity-40"
          />
        </Field>
      </div>

      {/* Geometry + price summary */}
      {geometry && breakdown ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="luxury-metric-label">Geometry</p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <RowKV label="Volume" value={formatVolume(geometry.volumeMm3)} />
              <RowKV
                label="Bounding box"
                value={`${geometry.boundingBoxMm.x.toFixed(0)} × ${geometry.boundingBoxMm.y.toFixed(0)} × ${geometry.boundingBoxMm.z.toFixed(0)} mm`}
              />
              <RowKV label="Surface area" value={`${(geometry.surfaceAreaMm2 / 100).toFixed(1)} cm²`} />
              <RowKV label="Triangles" value={geometry.triangleCount.toLocaleString()} />
              <RowKV label="Est. build time" value={formatBuildTime(breakdown.buildTimeHours)} />
            </dl>
            {oversize ? (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                Larger than our {PRINTER_BUILD_VOLUME_MM.x}×{PRINTER_BUILD_VOLUME_MM.y}×{PRINTER_BUILD_VOLUME_MM.z} mm build volume — we'll split into sub-parts.
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Fits within our build volume
              </div>
            )}
          </Card>

          <Card>
            <p className="luxury-metric-label">Estimated price</p>
            <p className="display-font mt-2 text-3xl text-[var(--text-primary)]">
              {formatPrice(breakdown.unitPrice)}
              <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">/ piece</span>
            </p>
            {breakdown.quantity > 1 ? (
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Line total for {breakdown.quantity}× ·{" "}
                <span className="font-semibold text-[var(--text-primary)]">
                  {formatPrice(breakdown.lineTotal)}
                </span>
                {breakdown.bulkDiscountPct > 0 ? (
                  <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-300">
                    {(breakdown.bulkDiscountPct * 100).toFixed(0)}% bulk off
                  </span>
                ) : null}
              </p>
            ) : null}
            <dl className="mt-4 space-y-1.5 text-xs">
              <RowKV label="Setup fee" value={formatPrice(breakdown.setupFee)} />
              <RowKV label="Material" value={formatPrice(breakdown.materialCost)} />
              <RowKV label="Finish multiplier" value={`×${breakdown.finishMultiplier.toFixed(2)}`} />
              <RowKV label="Infill applied" value={`${breakdown.effectiveInfill}%`} />
            </dl>
            {breakdown.warnings.length > 0 ? (
              <ul className="mt-3 space-y-1.5 text-xs text-amber-200">
                {breakdown.warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {w}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-3 text-[11px] leading-relaxed text-[var(--text-muted)]">
              Estimate based on volume × material rate × finish multiplier. Final price is
              confirmed in writing after we review your file.
            </p>
          </Card>
        </div>
      ) : !file ? (
        <p className="mt-6 rounded-[1.4rem] border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
          Drop an STL above to see a live estimate — runs entirely in your browser.
        </p>
      ) : null}
    </section>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
      {children}
    </div>
  );
}

function RowKV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[var(--text-muted)]">{label}</dt>
      <dd className="font-medium text-[var(--text-primary)]">{value}</dd>
    </div>
  );
}
