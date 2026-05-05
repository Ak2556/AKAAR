'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">Error</p>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Something went wrong</h2>
        <p className="text-[var(--text-secondary)] mb-8">
          We ran into an unexpected error. Please try again or return home.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)]"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
