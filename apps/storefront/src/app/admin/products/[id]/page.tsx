import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductEditForm } from '@/components/admin/ProductEditForm'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminProductEditPage({ params }: Props) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin?callbackUrl=%2Fadmin%2Fproducts')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'ADMIN') redirect('/admin/products')

  const { data: product } = await supabase
    .from('products')
    .select('*, mesh_files(*)')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="mb-8">
          <a
            href="/admin/products"
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            ← Back to Products
          </a>
          <h1 className="text-3xl font-bold mt-4 gradient-text">Edit Product</h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Update details, swap the preview image, or attach a 3D model.
          </p>
        </div>

        <ProductEditForm
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            category: product.category ?? '',
            shortDescription: product.short_description ?? '',
            description: product.description ?? '',
            price: product.price,
            isActive: product.is_active,
            imageUrl: product.image_url ?? null,
            images: (product.images as string[] | null) ?? [],
            modelUrl: (product.mesh_files as { storage_path?: string } | null)?.storage_path ?? null,
            modelFilename: (product.mesh_files as { original_filename?: string } | null)?.original_filename ?? null,
          }}
        />
      </div>
    </div>
  )
}
