"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

// existingProducts kept for backwards-compat but no longer rendered (list moved to ProductListTable)
interface ProductCreateFormProps {
  existingProducts?: unknown[];
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProductCreateForm({ existingProducts: _ }: ProductCreateFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [stage, setStage] = useState<UploadStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ name: string; slug: string } | null>(
    null
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
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

      // ── 1. Upload preview images (optional, multiple) ───────────────────
      let imageUrl: string | null = null;
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        setStage("uploading-image");
        imageUrls = await Promise.all(
          imageFiles.map((file, i) => {
            const ext = file.name.split(".").pop() ?? "jpg";
            const suffix = i === 0 ? "" : `-${i + 1}`;
            const path = `images/${timestamp}-${slugify(name)}${suffix}.${ext}`;
            return uploadToStorage(supabase, "product-assets", path, file);
          })
        );
        imageUrl = imageUrls[0];
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
          images: imageUrls.length > 0 ? imageUrls : undefined,
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
      setImageFiles([]);
      setModelFile(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
      setStage("idle");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="border border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)] p-6 md:p-8 space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold">Create Product</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Upload images and an optional GLB/GLTF model. The model renders interactively on the product page.
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
          {/* Image upload — multiple */}
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-primary)] p-5 space-y-3">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Upload className="w-4 h-4 text-[var(--accent)]" />
              Preview Images
            </span>
            <p className="text-xs text-[var(--text-secondary)]">
              Optional. Select multiple photos — the first becomes the cover. PNG, JPG, WEBP, AVIF up to 10 MB each.
            </p>

            {imageFiles.length > 0 && (
              <ul className="space-y-1">
                {imageFiles.map((f, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 text-xs text-[var(--text-secondary)] rounded-lg bg-[var(--bg-secondary)] px-3 py-2">
                    <span className="truncate flex-1">{f.name}</span>
                    {i === 0 && <span className="shrink-0 rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[var(--accent)] text-[10px]">cover</span>}
                    <button
                      type="button"
                      onClick={() => setImageFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="shrink-0 text-[var(--text-muted)] hover:text-red-400 transition-colors ml-1"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--accent)] hover:underline">
              <Upload className="w-3.5 h-3.5" />
              {imageFiles.length > 0 ? "Add more photos" : "Choose photos"}
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.avif"
                multiple
                className="hidden"
                onChange={(e) => {
                  const picked = Array.from(e.target.files ?? []);
                  setImageFiles((prev) => [...prev, ...picked]);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

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
  );
}
