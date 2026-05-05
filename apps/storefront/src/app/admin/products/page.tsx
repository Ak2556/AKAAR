import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductCreateForm } from '@/components/admin/ProductCreateForm'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  if (!supabase) {
    redirect('/auth/signin?callbackUrl=%2Fadmin%2Fproducts')
  }
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin?callbackUrl=%2Fadmin%2Fproducts')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'ADMIN') {
    return (
      <div className="min-h-screen pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-200">Merchant Access</p>
            <h1 className="text-3xl font-bold mt-3 mb-4">Admin permissions required</h1>
            <p className="text-[var(--text-secondary)]">
              This product management surface is only available to admin users.
              The first registered account is promoted to admin automatically.
            </p>
            <div className="mt-6">
              <Link href="/products" className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline">
                Back to marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { data: existingProducts } = await supabase
    .from('products')
    .select('id, name, slug, category, image_url, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(24)

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-10">
          <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">Merchant Console</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
            <span className="gradient-text">Manage Products</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl">
            Add new marketplace products with preview images and interactive GLB/GLTF assets.
          </p>
        </div>

        <ProductCreateForm
          existingProducts={(existingProducts ?? []).map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.category,
            imageUrl: p.image_url,
            isActive: p.is_active,
            createdAt: p.created_at,
          }))}
        />
      </div>
    </div>
  )
}
