import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6 py-12">
          <Skeleton className="h-4 w-16 mb-4" />
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="space-y-6">
              <Skeleton className="h-6 w-24 mb-4" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8">
              <Skeleton className="h-12 w-80" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>

            <Skeleton className="h-4 w-48 mb-6" />

            <ProductGridSkeleton count={9} />
          </div>
        </div>
      </div>
    </div>
  );
}
