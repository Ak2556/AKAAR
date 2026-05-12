import { createClient } from '@/lib/supabase/server'
import { ProductCreateForm } from '@/components/admin/ProductCreateForm'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: existingProducts } = await supabase
    .from('products')
    .select('id, name, slug, category, image_url, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="luxury-kicker">Admin · Products</p>
        <h1 className="display-font mt-2 text-4xl text-[var(--text-primary)]">Manage Products</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Add marketplace products with preview images and interactive 3D models.
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
  )
}
