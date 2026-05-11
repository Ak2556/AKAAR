export function ProductCardSkeleton() {
  return (
    <div className="luxury-card flex h-full flex-col overflow-hidden rounded-[2.1rem]">
      {/* Image area */}
      <div className="relative aspect-[1.05/1] overflow-hidden px-5 py-5">
        <div className="skeleton absolute inset-5 rounded-[1.7rem]" />
      </div>
      {/* Info strip */}
      <div className="border-t border-[var(--border)] px-4 py-4 sm:px-5 sm:py-5">
        <div className="skeleton mb-2 h-5 w-3/4 rounded-full" />
        <div className="skeleton h-4 w-1/3 rounded-full" />
      </div>
    </div>
  );
}
