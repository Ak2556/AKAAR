'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Truck, CheckCircle, Clock, XCircle, Loader2, ArrowLeft, Mail } from 'lucide-react'

interface OrderItem {
  id: string
  name: string
  quantity: number
  unit_price: number
  total_price: number
  material: string | null
  slug: string | null
}

interface Order {
  id: string
  order_number: string
  email: string
  phone: string | null
  status: string
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  shipping_method: string | null
  shipping_address: Record<string, string>
  tracking_number: string | null
  tracking_url: string | null
  status_notes: string | null
  notes: string | null
  created_at: string
  order_items: OrderItem[]
}

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const STATUS_CONFIG: Record<string, { label: string; tone: string }> = {
  PENDING:    { label: 'Pending',    tone: 'bg-amber-500/10 text-amber-200 border-amber-500/20' },
  CONFIRMED:  { label: 'Confirmed',  tone: 'bg-sky-500/10 text-sky-200 border-sky-500/20' },
  PROCESSING: { label: 'Processing', tone: 'bg-violet-500/10 text-violet-200 border-violet-500/20' },
  SHIPPED:    { label: 'Shipped',    tone: 'bg-cyan-500/10 text-cyan-200 border-cyan-500/20' },
  DELIVERED:  { label: 'Delivered',  tone: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20' },
  CANCELLED:  { label: 'Cancelled',  tone: 'bg-rose-500/10 text-rose-200 border-rose-500/20' },
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [status, setStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingUrl, setTrackingUrl] = useState('')
  const [statusNotes, setStatusNotes] = useState('')

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.order) {
          setOrder(d.order)
          setStatus(d.order.status)
          setTrackingNumber(d.order.tracking_number ?? '')
          setTrackingUrl(d.order.tracking_url ?? '')
          setStatusNotes(d.order.status_notes ?? '')
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber, trackingUrl, statusNotes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update')
      setOrder(data.order)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Order not found.</p>
      </div>
    )
  }

  const addr = order.shipping_address ?? {}
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        <Link href="/admin/orders" className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
          <ArrowLeft className="h-4 w-4" /> All Orders
        </Link>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="luxury-kicker">Admin · Order</p>
            <h1 className="display-font mt-2 text-3xl font-mono text-[var(--text-primary)]">{order.order_number}</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <span className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-medium ${cfg.tone}`}>
            {cfg.label}
          </span>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">

          {/* Left — order info */}
          <div className="space-y-5">

            {/* Items */}
            <div className="luxury-card rounded-[1.8rem] overflow-hidden">
              <div className="px-6 py-5 border-b border-[var(--border)]">
                <p className="luxury-kicker">Order Items</p>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {order.order_items.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-[0.7rem] bg-[var(--bg-primary)]">
                        <Package className="h-4 w-4 text-[var(--accent)]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{item.name}</p>
                        {item.material && <p className="text-xs text-[var(--text-muted)]">{item.material}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--text-primary)]">×{item.quantity}</p>
                      <p className="text-xs text-[var(--text-muted)]">₹{Number(item.total_price).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-secondary)] space-y-1">
                <div className="flex justify-between text-sm text-[var(--text-muted)]">
                  <span>Subtotal</span><span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--text-muted)]">
                  <span>Shipping</span><span>₹{Number(order.shipping_cost).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--text-muted)]">
                  <span>Tax</span><span>₹{Number(order.tax).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[var(--text-primary)] pt-2 border-t border-[var(--border)]">
                  <span>Total</span><span>₹{Number(order.total).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Customer */}
            <div className="luxury-card rounded-[1.8rem] p-6">
              <p className="luxury-kicker mb-5">Customer</p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[var(--text-muted)]" />
                  <a href={`mailto:${order.email}`} className="text-[var(--accent)] hover:underline">{order.email}</a>
                </div>
                {order.phone && (
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-muted)]">📞</span>
                    <span className="text-[var(--text-primary)]">{order.phone}</span>
                  </div>
                )}
              </div>

              <p className="luxury-kicker mt-6 mb-3">Shipping Address</p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {addr.firstName} {addr.lastName}<br />
                {addr.address}{addr.apartment ? `, ${addr.apartment}` : ''}<br />
                {addr.city}, {addr.state} {addr.zip}<br />
                {addr.country}
              </p>

              {/* Google Maps embed */}
              {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (addr.address || addr.city) && (() => {
                const fullAddress = [
                  addr.address,
                  addr.apartment,
                  addr.city,
                  addr.state,
                  addr.zip,
                  addr.country || 'India',
                ].filter(Boolean).join(', ')
                const mapsUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(fullAddress)}&zoom=15`
                return (
                  <div className="mt-4 rounded-xl overflow-hidden border border-[var(--border)]">
                    <iframe
                      src={mapsUrl}
                      width="100%"
                      height="220"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Delivery location"
                    />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2 text-xs text-[var(--accent)] hover:underline bg-[var(--bg-secondary)]"
                    >
                      Open in Google Maps ↗
                    </a>
                  </div>
                )
              })()}
              {order.notes && (
                <>
                  <p className="luxury-kicker mt-6 mb-2">Customer Notes</p>
                  <p className="text-sm text-[var(--text-secondary)]">{order.notes}</p>
                </>
              )}
            </div>
          </div>

          {/* Right — update panel */}
          <div className="space-y-5">
            <div className="luxury-card rounded-[1.8rem] p-6 space-y-5">
              <p className="luxury-kicker">Update Order</p>

              {/* Status */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map((s) => {
                    const c = STATUS_CONFIG[s]
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`rounded-full border px-3 py-2 text-xs font-medium transition-all ${status === s ? c.tone : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]'}`}
                      >
                        {c.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tracking */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. 1Z999AA10123456784"
                  className="luxury-input w-full rounded-full py-3 px-4 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Tracking URL</label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://track.delhivery.com/..."
                  className="luxury-input w-full rounded-full py-3 px-4 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Internal Notes</label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Notes visible only to you…"
                  rows={3}
                  className="luxury-input w-full rounded-[1rem] py-3 px-4 text-sm resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-300 rounded-[1rem] bg-red-500/10 border border-red-500/20 px-4 py-3">{error}</p>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--text-primary)] px-6 py-3.5 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</>
                ) : saved ? (
                  <><CheckCircle className="mr-2 h-4 w-4 text-emerald-400" />Saved & Email Sent</>
                ) : (
                  'Save & Notify Customer'
                )}
              </button>

              <p className="text-xs text-[var(--text-muted)] text-center">
                An email is sent to the customer on status change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
