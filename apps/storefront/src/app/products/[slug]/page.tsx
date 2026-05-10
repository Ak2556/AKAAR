import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductDetailClient, type ProductData } from "./ProductDetailClient";

export const revalidate = 60;

function mapProduct(p: Record<string, unknown>): ProductData {
  const mf = p.mesh_files as Record<string, unknown> | null;
  return {
    id:               p.id as string,
    name:             p.name as string,
    slug:             p.slug as string,
    category:         (p.category as string | null) ?? null,
    price:            p.price as number | null,
    description:      (p.description as string | null) ?? null,
    shortDescription: (p.short_description as string | null) ?? null,
    imageUrl:         (p.image_url as string | null) ?? null,
    images:           (p.images as string[] | null) ?? [],
    meshFile: mf ? {
      id:               mf.id as string,
      storagePath:      (mf.storage_path as string | null) ?? null,
      s3Key:            (mf.s3_key as string | null) ?? null,
      originalFilename: (mf.original_filename as string) ?? "model.glb",
    } : null,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: raw } = await supabase
    .from("products")
    .select("*, mesh_files(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!raw) notFound();

  const { data: relatedRaw } = await supabase
    .from("products")
    .select("*, mesh_files(*)")
    .eq("is_active", true)
    .eq("category", raw.category ?? "")
    .neq("id", raw.id)
    .limit(4);

  return (
    <ProductDetailClient
      product={mapProduct(raw as Record<string, unknown>)}
      relatedProducts={(relatedRaw ?? []).map((r) => mapProduct(r as Record<string, unknown>))}
    />
  );
}
