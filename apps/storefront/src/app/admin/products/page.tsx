import { createAdminClient } from "@/lib/supabase/admin";
import { ProductListTable } from "@/components/admin/ProductListTable";
import { ProductCreatePanel } from "@/components/admin/ProductCreatePanel";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const db = createAdminClient();

  const { data: products } = await db
    .from("products")
    .select("id, name, slug, category, price, image_url, is_active, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const mapped = (products ?? []).map((p) => ({
    id:        p.id,
    name:      p.name,
    slug:      p.slug,
    category:  p.category  ?? null,
    price:     p.price     ?? null,
    imageUrl:  p.image_url ?? null,
    isActive:  p.is_active,
    sortOrder: p.sort_order,
    createdAt: p.created_at,
  }));

  return (
    <div className="min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="luxury-kicker">Admin · Products</p>
          <h1 className="display-font mt-2 text-4xl text-[var(--text-primary)]">Products</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            {mapped.filter((p) => p.isActive).length} live ·{" "}
            {mapped.filter((p) => !p.isActive).length} draft ·{" "}
            {mapped.length} total
          </p>
        </div>
      </div>

      {/* Product list table with inline controls */}
      <ProductListTable products={mapped} />

      {/* Collapsible create form */}
      <div className="mt-10 border-t border-[var(--border)] pt-10">
        <ProductCreatePanel />
      </div>
    </div>
  );
}
