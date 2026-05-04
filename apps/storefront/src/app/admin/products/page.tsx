import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@akaar/db";
import { ProductCreateForm } from "@/components/admin/ProductCreateForm";
import { auth } from "@/lib/auth";
import {
  getLocalUserById,
  listLocalAdminProducts,
} from "@/lib/local-data-store";
import { isLocalDataMode } from "@/lib/local-runtime";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=%2Fadmin%2Fproducts");
  }

  const user = isLocalDataMode()
    ? await getLocalUserById(session.user.id)
    : await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, name: true },
      });

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-200">
              Merchant Access
            </p>
            <h1 className="text-3xl font-bold mt-3 mb-4">
              Admin permissions required
            </h1>
            <p className="text-[var(--text-secondary)]">
              This product management surface is only available to admin users.
              In local development, the first registered account is promoted to
              admin automatically.
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
              >
                Back to marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const existingProducts = isLocalDataMode()
    ? await listLocalAdminProducts(24)
    : await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 24,
        select: {
          id: true,
          name: true,
          slug: true,
          category: true,
          imageUrl: true,
          isActive: true,
          createdAt: true,
        },
      });

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-10">
          <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
            Merchant Console
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
            <span className="gradient-text">Manage Products</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl">
            Add new marketplace products with locally hosted preview images and
            interactive GLB or GLTF assets. Uploaded files are stored under the
            storefront public directory for local and self-hosted environments.
          </p>
        </div>

        <ProductCreateForm
          existingProducts={existingProducts.map((product) => ({
            ...product,
            createdAt:
              typeof product.createdAt === "string"
                ? product.createdAt
                : product.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
