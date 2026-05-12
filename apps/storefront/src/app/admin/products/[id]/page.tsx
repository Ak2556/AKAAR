import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductEditForm } from '@/components/admin/ProductEditForm'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminProductEditPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, mesh_files(*)')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <a
            href="/admin/products"
            className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4"
          >
            ← Products
          </a>
          <p className="luxury-kicker">Admin · Edit Product</p>
          <h1 className="display-font mt-2 text-3xl text-[var(--text-primary)]">Edit Product</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Update details, swap preview images, or attach a 3D model.
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
  );
}
