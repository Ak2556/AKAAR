'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Package, Truck, ChevronRight, Search, Filter } from 'lucide-react'

interface OrderItem {
  id: string
  name: string
  quantity: number
}

interface Order {
  id: string
  order_number: string
  email: string
  status: string
  total: number
  created_at: string
  tracking_number: string | null
  order_items: OrderItem[]
}

const STATUS_CONFIG: Record<string, { label: string; tone: string }> = {
  PENDING:    { label: 'Pending',    tone: 'bg-amber-500/10 text-amber-200 border-amber-500/20' },
  CONFIRMED:  { label: 'Confirmed',  tone: 'bg-sky-500/10 text-sky-200 border-sky-500/20' },
  PROCESSING: { label: 'Processing', tone: 'bg-violet-500/10 text-violet-200 border-violet-500/20' },
  SHIPPED:    { label: 'Shipped',    tone: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/20' },
  DELIVERED:  { label: 'Delivered',  tone: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20' },
  CANCELLED:  { label: 'Cancelled',  tone: 'bg-rose-500/10 text-rose-200 border-rose-500/20' },
}

export default function AdminOrdersPage() {
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? 'all')

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = orders.filter((o) => {
    const matchSearch = o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="luxury-kicker">Admin · Orders</p>
        <h1 className="display-font mt-2 text-4xl text-[var(--text-primary)]">Orders</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Update status, add tracking numbers, and notify customers.
        </p>
      </div>

      <div>
        {/* Filters */}
        <div className="luxury-card p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search order number or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="luxury-input w-full rounded-full py-3 pl-11 pr-4 text-sm"
            />
          </div>
          <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
            <Filter className="h-4 w-4 text-[var(--text-muted)]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-[var(--text-primary)] focus:outline-none"
            >
              <option value="all">All statuses</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = orders.filter((o) => o.status === key).length
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
                className={`rounded-[var(--rad-sm)] border px-3 py-3 text-center transition-all hover:border-[var(--accent)]/40 ${statusFilter === key ? cfg.tone : 'border-[var(--border)] bg-[var(--bg-secondary)]'}`}
              >
                <p className="text-xl font-bold text-[var(--text-primary)]">{count}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{cfg.label}</p>
              </button>
            )
          })}
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-[84px] rounded-[var(--rad-lg)]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="luxury-card p-12 text-center">
            <Package className="h-10 w-10 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING
              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="luxury-card luxury-card-interactive p-5 flex flex-col sm:flex-row sm:items-center gap-4 block"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[var(--rad-sm)] bg-[var(--bg-primary)]">
                      <Package className="h-5 w-5 text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-medium text-[var(--text-primary)]">{order.order_number}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{order.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-[var(--text-muted)]">{order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">₹{Number(order.total).toLocaleString('en-IN')}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium ${cfg.tone}`}>
                      {cfg.label}
                    </span>
                    {order.tracking_number && (
                      <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs text-cyan-200">
                        <Truck className="h-3 w-3" /> {order.tracking_number}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
