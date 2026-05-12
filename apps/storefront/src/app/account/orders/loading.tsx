export default function OrdersLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="rounded-[2rem] bg-[var(--bg-secondary)] p-6 sm:p-7">
        <div className="h-4 w-16 rounded bg-[var(--bg-tertiary)] mb-3" />
        <div className="h-9 w-40 rounded-lg bg-[var(--bg-tertiary)]" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-[2rem] bg-[var(--bg-secondary)] overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-4 gap-4 border-b border-[var(--border)] px-6 py-4">
          {["Order", "Date", "Status", "Total"].map((col) => (
            <div key={col} className="h-4 w-16 rounded bg-[var(--bg-tertiary)]" />
          ))}
        </div>
        {/* Data rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-4 border-b border-[var(--border)] px-6 py-5"
          >
            <div className="h-5 w-28 rounded bg-[var(--bg-tertiary)]" />
            <div className="h-5 w-24 rounded bg-[var(--bg-tertiary)]" />
            <div className="h-6 w-20 rounded-full bg-[var(--bg-tertiary)]" />
            <div className="h-5 w-16 rounded bg-[var(--bg-tertiary)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
