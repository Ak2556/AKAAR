export default function CheckoutLoading() {
  return (
    <div className="min-h-screen animate-pulse px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Back link skeleton */}
        <div className="mb-8 h-5 w-40 rounded-full bg-[var(--bg-secondary)]" />

        {/* Hero panel */}
        <div className="mb-10 overflow-hidden rounded-[2.35rem] bg-[var(--bg-secondary)] px-6 py-10 sm:px-8 lg:px-10">
          <div className="grid gap-8 xl:grid-cols-2">
            <div className="space-y-6">
              <div className="h-4 w-24 rounded bg-[var(--bg-tertiary)]" />
              <div className="space-y-2">
                <div className="h-12 w-52 rounded-lg bg-[var(--bg-tertiary)]" />
                <div className="h-12 w-64 rounded-lg bg-[var(--bg-tertiary)]" />
              </div>
              <div className="h-5 w-full max-w-lg rounded bg-[var(--bg-tertiary)]" />
            </div>
            <div className="h-48 rounded-[2rem] bg-[var(--bg-tertiary)]" />
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
          {/* Form skeleton */}
          <div className="space-y-8">
            <div className="rounded-[2rem] bg-[var(--bg-secondary)] p-6 sm:p-7 space-y-6">
              <div className="h-4 w-20 rounded bg-[var(--bg-tertiary)]" />
              <div className="h-8 w-48 rounded-lg bg-[var(--bg-tertiary)]" />
              <div className="grid gap-5 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 rounded bg-[var(--bg-tertiary)]" />
                    <div className="h-11 w-full rounded-full bg-[var(--bg-tertiary)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary skeleton */}
          <div className="space-y-4">
            <div className="rounded-[2rem] bg-[var(--bg-secondary)] p-6 sm:p-7 space-y-5">
              <div className="h-4 w-28 rounded bg-[var(--bg-tertiary)]" />
              <div className="h-8 w-40 rounded-lg bg-[var(--bg-tertiary)]" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-4 rounded-[1.4rem] border border-[var(--border)] p-4">
                  <div className="h-16 w-16 rounded-[1rem] bg-[var(--bg-tertiary)] flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 rounded bg-[var(--bg-tertiary)]" />
                    <div className="h-4 w-20 rounded bg-[var(--bg-tertiary)]" />
                  </div>
                </div>
              ))}
              <div className="space-y-px overflow-hidden rounded-[1.5rem] border border-[var(--border)]">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between bg-[var(--bg-secondary)] px-4 py-4">
                    <div className="h-4 w-20 rounded bg-[var(--bg-tertiary)]" />
                    <div className="h-4 w-16 rounded bg-[var(--bg-tertiary)]" />
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
