export default function AccountLoading() {
  return (
    <div className="min-h-screen animate-pulse px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-[var(--bg-secondary)] p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[var(--bg-tertiary)]" />
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="h-5 w-32 rounded bg-[var(--bg-tertiary)]" />
                  <div className="h-4 w-44 rounded bg-[var(--bg-tertiary)]" />
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] bg-[var(--bg-secondary)] p-3 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-11 rounded-[1.2rem] bg-[var(--bg-tertiary)]" />
              ))}
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-[var(--bg-secondary)] p-6 sm:p-7">
              <div className="h-4 w-20 rounded bg-[var(--bg-tertiary)] mb-3" />
              <div className="h-9 w-56 rounded-lg bg-[var(--bg-tertiary)] mb-6" />
              <div className="grid gap-5 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-28 rounded bg-[var(--bg-tertiary)]" />
                    <div className="h-11 w-full rounded-full bg-[var(--bg-tertiary)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
