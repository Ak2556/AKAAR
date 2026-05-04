"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProductCreateFormProps {
  existingProducts: Array<{
    id: string;
    name: string;
    slug: string;
    category: string | null;
    imageUrl: string | null;
    isActive: boolean;
    createdAt: string;
  }>;
}

export function ProductCreateForm({
  existingProducts,
}: ProductCreateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    name: string;
    slug: string;
  } | null>(null);
  const [modelName, setModelName] = useState("");
  const [imageName, setImageName] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      setSuccess({
        name: data.product.name,
        slug: data.product.slug,
      });
      form.reset();
      setModelName("");
      setImageName("");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] gap-8">
      <form
        onSubmit={handleSubmit}
        className="border border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)] p-6 md:p-8 space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold">Create Product</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            Upload a product card image plus a GLB or GLTF model. The model
            becomes the interactive product preview on the storefront.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              {success.name} created successfully.
            </div>
            <Link
              href={`/products/${success.slug}`}
              className="inline-flex mt-2 text-[var(--accent)] hover:underline"
            >
              Open product page
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="Gyro Mount v2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="gyro-mount-v2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              name="category"
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="Robotics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price (INR) *</label>
            <input
              type="number"
              name="price"
              required
              min="1"
              step="0.01"
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="2499"
            />
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input
              id="isActive"
              type="checkbox"
              name="isActive"
              value="true"
              defaultChecked
              className="w-4 h-4 accent-[var(--accent)]"
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Product is live on the storefront
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <input
              type="text"
              name="shortDescription"
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="Compact bracket for rapid prototyping."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Full Description</label>
            <textarea
              name="description"
              rows={5}
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] resize-y"
              placeholder="Explain use case, materials, and fitment details."
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <label className="block rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-primary)] p-5 cursor-pointer hover:border-[var(--accent)]/60 transition-colors">
            <span className="flex items-center gap-2 text-sm font-medium mb-2">
              <Upload className="w-4 h-4 text-[var(--accent)]" />
              Preview Image
            </span>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              Optional. PNG, JPG, WEBP, or AVIF up to 10 MB.
            </p>
            <input
              type="file"
              name="previewImage"
              accept=".png,.jpg,.jpeg,.webp,.avif"
              className="hidden"
              onChange={(event) =>
                setImageName(event.target.files?.[0]?.name || "")
              }
            />
            <span className="text-sm text-[var(--text-muted)]">
              {imageName || "Choose an image file"}
            </span>
          </label>

          <label className="block rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-primary)] p-5 cursor-pointer hover:border-[var(--accent)]/60 transition-colors">
            <span className="flex items-center gap-2 text-sm font-medium mb-2">
              <Upload className="w-4 h-4 text-[var(--accent)]" />
              3D Preview Model *
            </span>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              Required. GLB or GLTF up to 50 MB. These render interactively on
              the product page.
            </p>
            <input
              type="file"
              name="modelFile"
              accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
              required
              className="hidden"
              onChange={(event) =>
                setModelName(event.target.files?.[0]?.name || "")
              }
            />
            <span className="text-sm text-[var(--text-muted)]">
              {modelName || "Choose a GLB or GLTF model"}
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end">
          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Product...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>

      <aside className="border border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)] p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold">Latest Products</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Current marketplace items from Prisma.
            </p>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            {existingProducts.length} total
          </span>
        </div>

        <div className="space-y-3">
          {existingProducts.length === 0 ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-5 text-sm text-[var(--text-secondary)]">
              No products yet. Create your first marketplace listing from this page.
            </div>
          ) : (
            existingProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3 hover:border-[var(--accent)]/60 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">No image</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">
                    /products/{product.slug}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="rounded-full bg-[var(--bg-tertiary)] px-2 py-1 text-[var(--text-muted)]">
                      {product.category || "Uncategorized"}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 ${
                        product.isActive
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-amber-500/15 text-amber-200"
                      }`}
                    >
                      {product.isActive ? "Live" : "Draft"}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
