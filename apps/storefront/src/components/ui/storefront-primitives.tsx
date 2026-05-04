"use client";

import type { LucideIcon } from "lucide-react";

export function FieldBlock({
  label,
  children,
  action,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="luxury-label-row">
        <span className="luxury-label">{label}</span>
        {action}
      </span>
      {children}
      {hint ? <span className="luxury-hint mt-2 block">{hint}</span> : null}
    </label>
  );
}

export function MetricTile({
  label,
  value,
  secondary,
  className = "",
}: {
  label: string;
  value: string;
  secondary?: string;
  className?: string;
}) {
  return (
    <div className={`bg-[var(--bg-secondary)] px-5 py-5 ${className}`.trim()}>
      <p className="luxury-metric-label">{label}</p>
      <p className="luxury-metric-value mt-3">{value}</p>
      {secondary ? <p className="luxury-hint mt-2">{secondary}</p> : null}
    </div>
  );
}

export function SummaryRow({
  label,
  value,
  secondary,
}: {
  label: string;
  value: string;
  secondary?: string;
}) {
  return (
    <div className="bg-[var(--bg-secondary)] px-5 py-5">
      <p className="luxury-metric-label">{label}</p>
      <p className="luxury-summary-value mt-3">{value}</p>
      {secondary ? <p className="luxury-hint mt-2">{secondary}</p> : null}
    </div>
  );
}

export function EmptyStatePanel({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="luxury-card rounded-[2rem] px-6 py-14 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-secondary)]">
        <Icon className="h-10 w-10 text-[var(--text-muted)]" />
      </div>
      <h3 className="display-font mt-6 text-3xl text-[var(--text-primary)]">{title}</h3>
      <p className="mx-auto mt-4 max-w-xl text-[var(--text-secondary)]">{description}</p>
      {action ? <div className="mt-8 inline-flex">{action}</div> : null}
    </div>
  );
}
