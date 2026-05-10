"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const PRODUCTS = [
  {
    name: "Lord Hanuman Dhyan Mudra Figurine",
    slug: "hanuman-dhyan-mudra",
    category: "Figurine",
    price: 599,
    shortDescription:
      "A meditation-pose Hanuman with 'राम' scripture — white PLA, every bead and drape resolved in print.",
    description:
      "Lord Hanuman sits in Dhyan Mudra — hands resting on folded legs, eyes closed in devotion. The 'राम' scripture plaque rests before him. Every detail is resolved in the print: the crown, mala beads, arm bands, and the fine folds of the dhoti. Printed in pure white PLA with FDM additive manufacturing at the AKAAR studio, Jaipur. Lightweight, desk or altar-ready.",
  },
  {
    name: "Ganesha Temple Mandap",
    slug: "ganesha-temple-mandap",
    category: "Figurine",
    price: 599,
    shortDescription:
      "Saffron mandap with white Ganesha inside — a complete two-piece altar scene, gift-ready.",
    description:
      "A complete altar composition in two parts: the saffron-orange temple pavilion with carved columns, arched gateway, and tiered dome — and the white Ganesha figurine seated inside. Each piece is printed separately and assembled as a scene. The contrast between the warm orange shell and the white figure is intentional. Makes a complete gift or home altar piece.",
  },
  {
    name: "AKAAR Plant Grow Light",
    slug: "plant-grow-light",
    category: "Lamp",
    price: 1999,
    shortDescription:
      "A 3D-printed grow light enclosure with warm LED — clean geometry, desk or windowsill ready.",
    description:
      "A rounded-square enclosure with a warm LED grow light built into the ceiling cavity, illuminating the open planter tray below. Clean white PLA with precise tolerances — the light module sits flush, the base is flat and stable. Works with herbs, wheatgrass, succulents, or any compact indoor plant. Plug it in, add your plants.",
  },
] as const;

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

async function uploadImage(supabase: ReturnType<typeof createClient>, file: File, slug: string) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `images/${Date.now()}-${slug}.${ext}`;
  const { error } = await supabase.storage.from("product-assets").upload(path, file, {
    cacheControl: "31536000",
    upsert: true,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from("product-assets").getPublicUrl(path).data.publicUrl;
}

type Status = "idle" | "uploading" | "saving" | "done" | "error";

function ProductSeedCard({ product }: { product: typeof PRODUCTS[number] }) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [resultSlug, setResultSlug] = useState<string | null>(null);

  const handleSeed = async () => {
    if (imageFiles.length === 0) { setError("Please select at least one image"); return; }
    setError(null);
    try {
      setStatus("uploading");
      const supabase = createClient();
      const urls = await Promise.all(
        imageFiles.map((file, i) =>
          uploadImage(supabase, file, i === 0 ? product.slug : `${product.slug}-${i + 1}`)
        )
      );
      const imageUrl = urls[0];

      setStatus("saving");
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: product.price,
          shortDescription: product.shortDescription,
          description: product.description,
          isActive: true,
          imageUrl,
          images: urls,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      setResultSlug(data.product.slug);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  };

  const busy = status === "uploading" || status === "saving";
  const label = status === "uploading" ? "Uploading images…" : status === "saving" ? "Saving…" : "Seed this product";

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{product.category}</p>
          <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">{product.name}</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">/{product.slug} · ₹{product.price.toLocaleString("en-IN")}</p>
        </div>
        {status === "done" && <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />}
      </div>

      <p className="text-sm leading-6 text-[var(--text-secondary)]">{product.shortDescription}</p>

      {status === "done" ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Seeded.{" "}
          <Link href={`/products/${resultSlug}`} className="underline">
            View product →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 text-sm transition-colors hover:border-[var(--accent)]/60">
            <Upload className="h-4 w-4 text-[var(--accent)]" />
            <span className="text-[var(--text-secondary)]">
              {imageFiles.length > 0
                ? `${imageFiles.length} photo${imageFiles.length > 1 ? "s" : ""} selected`
                : "Pick photos (select multiple)"}
            </span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              className="hidden"
              onChange={(e) => { setImageFiles(Array.from(e.target.files ?? [])); setError(null); }}
            />
          </label>

          <button
            onClick={handleSeed}
            disabled={busy || imageFiles.length === 0}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--text-primary)] px-5 py-3 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {label}
          </button>
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function SeedProductsClient() {
  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <p className="luxury-kicker">Admin · One-time seed</p>
          <h1 className="display-font mt-3 text-4xl text-[var(--text-primary)]">Add new products</h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            Pick the photo for each product and click "Seed". All copy and pricing is pre-filled.
          </p>
        </div>

        <div className="space-y-5">
          {PRODUCTS.map((product) => (
            <ProductSeedCard key={product.slug} product={product} />
          ))}
        </div>

        <div className="rounded-xl border border-[var(--border)] px-5 py-4 text-sm text-[var(--text-muted)]">
          After seeding, visit{" "}
          <Link href="/products" className="text-[var(--accent)] underline">/products</Link>{" "}
          to see the live catalog, or{" "}
          <Link href="/admin/products" className="text-[var(--accent)] underline">/admin/products</Link>{" "}
          to edit them.
        </div>
      </div>
    </div>
  );
}
