"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

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

type UploadStage =
  | "idle"
  | "uploading-image"
  | "uploading-model"
  | "saving"
  | "done";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uploadToStorage(
  supabase: ReturnType<typeof createClient>,
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: true,
  });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function ProductCreateForm({
  existingProducts,
}: ProductCreateFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [stage, setStage] = useState<UploadStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ name: string; slug: string } | null>(
    null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);

  const isSubmitting = stage !== "idle" && stage !== "done";

  const stageLabel: Record<UploadStage, string> = {
    idle: "Create Product",
    "uploading-image": "Uploading image…",
    "uploading-model": "Uploading 3D model…",
    saving: "Saving product…",
    done: "Create Product",
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const form = event.currentTarget;
    const fd = new FormData(form);

    const name = (fd.get("name") as string)?.trim();
    const rawPrice = fd.get("price") as string;
    if (!name) { setError("Product name is required"); return; }
    const price = Number(rawPrice);
    if (!Number.isFinite(price) || price <= 0) { setError("Price must be a positive number"); return; }

    try {
      const supabase = createClient();
      const timestamp = Date.now();

      // ── 1. Upload preview image (optional) ──────────────────────────────
      let imageUrl: string | null = null;
      if (imageFile) {
        setStage("uploading-image");
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const path = `images/${timestamp}-${slugify(name)}.${ext}`;
        imageUrl = await uploadToStorage(supabase, "product-assets", path, imageFile);
      }

      // ── 2. Upload 3D model (optional) ────────────────────────────────────
      let modelUrl: string | null = null;
      let modelFilename: string | null = null;
      let modelSize: number | null = null;
      if (modelFile) {
        setStage("uploading-model");
        const ext = modelFile.name.split(".").pop() ?? "glb";
        const path = `models/${timestamp}-${slugify(name)}.${ext}`;
        modelUrl = await uploadToStorage(supabase, "product-assets", path, modelFile);
        modelFilename = modelFile.name;
        modelSize = modelFile.size;
      }

      // ── 3. Save product via API ──────────────────────────────────────────
      setStage("saving");
      const isActiveRaw = fd.get("isActive");

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: (fd.get("slug") as string)?.trim() || undefined,
          category: (fd.get("category") as string)?.trim() || undefined,
          shortDescription: (fd.get("shortDescription") as string)?.trim() || undefined,
          description: (fd.get("description") as string)?.trim() || undefined,
          price,
          isActive: isActiveRaw === "true",
          imageUrl,
          modelUrl,
          modelFilename,
          modelSize,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create product");

      setSuccess({ name: data.product.name, slug: data.product.slug });
      setStage("done");
      form.reset();
      setImageFile(null);
      setModelFile(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
      setStage("idle");
    }
  };

  return (
    <div className="grid xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] gap-8">
      <form
        ref={formRef}
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
            <label className="block text-sm font-medium mb-2">
              Product Name *
            </label>
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
            <label className="block text-sm font-medium mb-2">
              Price (INR) *
            </label>
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
            <label className="block text-sm font-medium mb-2">
              Short Description
            </label>
            <input
              type="text"
              name="shortDescription"
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              placeholder="Compact bracket for rapid prototyping."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Full Description
            </label>
            <textarea
              name="description"
              rows={5}
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] resize-y"
              placeholder="Explain use case, materials, and fitment details."
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Image upload */}
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
              accept=".png,.jpg,.jpeg,.webp,.avif"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            <span className="text-sm text-[var(--text-muted)]">
              {imageFile ? imageFile.name : "Choose an image file"}
            </span>
          </label>

          {/* Model upload */}
          <label className="block rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-primary)] p-5 cursor-pointer hover:border-[var(--accent)]/60 transition-colors">
            <span className="flex items-center gap-2 text-sm font-medium mb-2">
              <Upload className="w-4 h-4 text-[var(--accent)]" />
              3D Preview Model
            </span>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              Optional. GLB or GLTF up to 50 MB. Renders interactively on the
              product page.
            </p>
            <input
              type="file"
              accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
              className="hidden"
              onChange={(e) => setModelFile(e.target.files?.[0] ?? null)}
            />
            <span className="text-sm text-[var(--text-muted)]">
              {modelFile ? modelFile.name : "Choose a GLB or GLTF model"}
            </span>
          </label>
        </div>

        {/* Upload progress pill */}
        {isSubmitting && (
          <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-3 text-sm text-[var(--accent)] flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
            {stageLabel[stage]}
          </div>
        )}

        <div className="flex items-center justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {stageLabel[stage]}
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
              Click any product to edit it.
            </p>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            {existingProducts.length} total
          </span>
        </div>

        <div className="space-y-3">
          {existingProducts.length === 0 ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-5 text-sm text-[var(--text-secondary)]">
              No products yet. Create your first marketplace listing from this
              page.
            </div>
          ) : (
            existingProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
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
                    <span className="text-xs text-[var(--text-muted)]">
                      No image
                    </span>
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
