"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, CheckCircle2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  isActive: boolean;
  imageUrl: string | null;
  images: string[];
  modelUrl: string | null;
  modelFilename: string | null;
}

interface ProductEditFormProps {
  product: Product;
}

type Stage = "idle" | "uploading-image" | "uploading-model" | "saving" | "done";

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
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function ProductEditForm({ product }: ProductEditFormProps) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Existing images — starts from product.images (or falls back to imageUrl)
  const initialImages = product.images?.length
    ? product.images
    : product.imageUrl
    ? [product.imageUrl]
    : [];
  const [existingImages, setExistingImages] = useState<string[]>(initialImages);
  const [removedUrls, setRemovedUrls] = useState<Set<string>>(new Set());

  // New image files the admin is adding
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  // 3D model state (single file, unchanged logic)
  const [newModelFile, setNewModelFile] = useState<File | null>(null);
  const [clearModel, setClearModel] = useState(false);

  const isSubmitting = stage !== "idle" && stage !== "done";

  const stageLabel: Record<Stage, string> = {
    idle: "Save Changes",
    "uploading-image": "Uploading image…",
    "uploading-model": "Uploading 3D model…",
    saving: "Saving…",
    done: "Save Changes",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string)?.trim();
    const rawPrice = fd.get("price") as string;
    const price = Number(rawPrice);
    if (!name) { setError("Product name is required"); return; }
    if (!Number.isFinite(price) || price <= 0) { setError("Price must be a positive number"); return; }

    try {
      const supabase = createClient();
      const timestamp = Date.now();

      // ── Upload new images if any were added ─────────────────────────────
      const keptImages = existingImages.filter((u) => !removedUrls.has(u));
      let newlyUploadedUrls: string[] = [];
      if (newImageFiles.length > 0) {
        setStage("uploading-image");
        newlyUploadedUrls = await Promise.all(
          newImageFiles.map((file, i) => {
            const ext = file.name.split(".").pop() ?? "jpg";
            const suffix = i === 0 && keptImages.length === 0 ? "" : `-${timestamp}-${i + 1}`;
            const path = `images/${timestamp}-${slugify(name)}${suffix}.${ext}`;
            return uploadToStorage(supabase, "product-assets", path, file);
          })
        );
      }
      const finalImages = [...keptImages, ...newlyUploadedUrls];
      const imageUrl: string | null = finalImages[0] ?? null;

      // ── Upload new model if chosen ──────────────────────────────────────
      let modelUrl: string | null | undefined = undefined;
      let modelFilename: string | null | undefined = undefined;
      let modelSize: number | null | undefined = undefined;
      if (newModelFile) {
        setStage("uploading-model");
        const ext = newModelFile.name.split(".").pop() ?? "glb";
        const path = `models/${timestamp}-${slugify(name)}.${ext}`;
        modelUrl = await uploadToStorage(supabase, "product-assets", path, newModelFile);
        modelFilename = newModelFile.name;
        modelSize = newModelFile.size;
      } else if (clearModel) {
        modelUrl = null;
        modelFilename = null;
        modelSize = null;
      }

      // ── PATCH product ───────────────────────────────────────────────────
      setStage("saving");
      const body: Record<string, unknown> = {
        id: product.id,
        name,
        slug: (fd.get("slug") as string)?.trim() || slugify(name),
        category: (fd.get("category") as string)?.trim() || null,
        shortDescription: (fd.get("shortDescription") as string)?.trim() || null,
        description: (fd.get("description") as string)?.trim() || null,
        price,
        isActive: fd.get("isActive") === "true",
        imageUrl,
        images: finalImages,
      };

      if (modelUrl !== undefined) {
        body.modelUrl = modelUrl;
        body.modelFilename = modelFilename ?? null;
        body.modelSize = modelSize ?? null;
      }

      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      setSaved(true);
      setStage("done");
      // Update local state to reflect what was just saved
      setExistingImages(finalImages);
      setRemovedUrls(new Set());
      setNewImageFiles([]);
      setNewModelFile(null);
      setClearModel(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
      setStage("idle");
    }
  };

  const currentModelLabel = clearModel
    ? "No model"
    : newModelFile
    ? newModelFile.name
    : product.modelFilename ?? (product.modelUrl ? "Existing model" : "No model attached");

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)] p-6 md:p-8 space-y-6"
    >
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Product updated successfully.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            required
            defaultValue={product.name}
            className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Slug</label>
          <input
            type="text"
            name="slug"
            defaultValue={product.slug}
            className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <input
            type="text"
            name="category"
            defaultValue={product.category}
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
            defaultValue={product.price}
            className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
          />
        </div>

        <div className="flex items-center gap-3 pt-8">
          <input
            id="isActive"
            type="checkbox"
            name="isActive"
            value="true"
            defaultChecked={product.isActive}
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
            defaultValue={product.shortDescription}
            className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
            placeholder="Compact bracket for rapid prototyping."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Full Description</label>
          <textarea
            name="description"
            rows={5}
            defaultValue={product.description}
            className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] resize-y"
            placeholder="Explain use case, materials, and fitment details."
          />
        </div>
      </div>

      {/* ── Assets ─────────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Preview Images — multi-photo */}
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-primary)] p-5 space-y-3">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Upload className="w-4 h-4 text-[var(--accent)]" />
            Preview Images
          </span>

          {/* Existing images grid */}
          {existingImages.filter((u) => !removedUrls.has(u)).length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {existingImages.map((url) =>
                removedUrls.has(url) ? null : (
                  <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--border)] group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setRemovedUrls((prev) => new Set(prev).add(url))}
                      className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"
                      title="Remove photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {url === existingImages.filter((u) => !removedUrls.has(u))[0] && (
                      <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] text-white">cover</span>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {/* New files queued for upload */}
          {newImageFiles.length > 0 && (
            <ul className="space-y-1">
              {newImageFiles.map((f, i) => (
                <li key={i} className="flex items-center justify-between gap-2 text-xs text-[var(--text-secondary)] rounded-lg bg-[var(--bg-secondary)] px-3 py-2">
                  <span className="truncate flex-1">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => setNewImageFiles((prev) => prev.filter((_, j) => j !== i))}
                    className="shrink-0 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--accent)] hover:underline">
            <Upload className="w-3.5 h-3.5" />
            {existingImages.filter((u) => !removedUrls.has(u)).length > 0 || newImageFiles.length > 0
              ? "Add more photos"
              : "Upload photos"}
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.avif"
              multiple
              className="hidden"
              onChange={(e) => {
                const picked = Array.from(e.target.files ?? []);
                setNewImageFiles((prev) => [...prev, ...picked]);
                e.target.value = "";
              }}
            />
          </label>
          <p className="text-xs text-[var(--text-muted)]">PNG, JPG, WEBP or AVIF · max 10 MB each · first photo = cover</p>
        </div>

        {/* 3D Model */}
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-primary)] p-5 space-y-3">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Upload className="w-4 h-4 text-[var(--accent)]" />
            3D Preview Model
          </span>

          <div
            className={`rounded-lg px-4 py-3 text-sm border flex items-center justify-between gap-2 ${
              currentModelLabel === "No model"
                ? "border-[var(--border)] text-[var(--text-muted)]"
                : "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
            }`}
          >
            <span className="truncate">{currentModelLabel}</span>
            {currentModelLabel !== "No model" && (
              <button
                type="button"
                onClick={() => { setClearModel(true); setNewModelFile(null); }}
                className="flex-shrink-0 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                title="Remove model"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--accent)] hover:underline">
            <Upload className="w-3.5 h-3.5" />
            {product.modelUrl && !clearModel ? "Replace model" : "Upload model"}
            <input
              type="file"
              accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
              className="hidden"
              onChange={(e) => {
                setNewModelFile(e.target.files?.[0] ?? null);
                setClearModel(false);
              }}
            />
          </label>
          <p className="text-xs text-[var(--text-muted)]">GLB or GLTF · max 50 MB · renders interactively</p>
        </div>
      </div>

      {isSubmitting && (
        <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-3 text-sm text-[var(--accent)] flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          {stageLabel[stage]}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <a
          href={`/products/${product.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
        >
          View on storefront ↗
        </a>
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {stageLabel[stage]}
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
