import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCatalog } from "@/lib/catalog";
import { ProductCard } from "@/components/products/ProductCard";

export async function ProductsShowcase() {
  const { products } = await getCatalog({ limit: 3 });

  if (!products.length) return null;

  return (
    <section className="px-4 py-14 sm:px-6 sm:py-18">
      <div className="mx-auto max-w-7xl">
        <div className="luxury-panel rounded-[var(--rad-xl)] px-6 py-8 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl animate-fade-in-up">
              <span className="luxury-kicker">Studio Collection</span>
              <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
                Objects from the AKAAR studio.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
                Figurines, lamps, and functional objects — all printed at the Jaipur studio, shipped across India with free delivery.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
            >
              View full collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                category={product.category ?? ""}
                price={Number(product.price ?? 0)}
                description={product.description ?? undefined}
                imageUrl={product.imageUrl ?? undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
