import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductDetailClient, type ProductData } from "./ProductDetailClient";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("name, short_description, image_url")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!data) return {};

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://akaar3d.in";
  const title = `${data.name} | AKAAR 3D`;
  const description = (data.short_description as string | null) ?? "Handcrafted 3D printed part from the AKAAR studio, Jaipur.";
  const imageUrl = data.image_url as string | null;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/products/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: imageUrl ? [{ url: imageUrl, alt: data.name as string }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

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

  const product = mapProduct(raw as Record<string, unknown>);
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://akaar3d.in";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription ?? product.description ?? undefined,
    image: product.imageUrl ?? undefined,
    url: `${BASE_URL}/products/${product.slug}`,
    brand: { "@type": "Brand", name: "AKAAR 3D" },
    ...(product.price != null
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `${BASE_URL}/products/${product.slug}`,
            seller: { "@type": "Organization", name: "AKAAR 3D" },
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={(relatedRaw ?? []).map((r) => mapProduct(r as Record<string, unknown>))}
      />
    </>
  );
}
