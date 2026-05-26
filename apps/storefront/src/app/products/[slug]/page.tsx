import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProductDisplayName } from "@/lib/product-names";
import { rankRelated, type ScoredProduct } from "@/lib/recommendations";
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
  const displayName = getProductDisplayName(data.name as string, slug);
  const title = `${displayName} | AKAAR 3D`;
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
      images: imageUrl ? [{ url: imageUrl, alt: displayName }] : [],
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
    name:             getProductDisplayName(p.name as string, p.slug as string),
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

  // Fetch candidates: same category first, then fill from entire catalog
  const [{ data: sameCatRaw }, { data: otherRaw }] = await Promise.all([
    supabase
      .from("products")
      .select("id,name,slug,category,price,image_url,short_description")
      .eq("is_active", true)
      .eq("category", raw.category ?? "")
      .neq("id", raw.id)
      .limit(20),
    supabase
      .from("products")
      .select("id,name,slug,category,price,image_url,short_description")
      .eq("is_active", true)
      .neq("id", raw.id)
      .neq("category", raw.category ?? "")
      .limit(20),
  ]);

  const targetForScoring: ScoredProduct = {
    id: raw.id as string,
    name: raw.name as string,
    slug: raw.slug as string,
    category: (raw.category as string | null) ?? null,
    price: raw.price as number | null,
    imageUrl: (raw.image_url as string | null) ?? null,
  };

  const candidatesForScoring: ScoredProduct[] = [
    ...(sameCatRaw ?? []),
    ...(otherRaw ?? []),
  ].map((p) => ({
    id: p.id as string,
    name: p.name as string,
    slug: p.slug as string,
    category: (p.category as string | null) ?? null,
    price: p.price as number | null,
    imageUrl: (p.image_url as string | null) ?? null,
  }));

  const rankedRelated = rankRelated(targetForScoring, candidatesForScoring, 4);

  // Fetch full product data (with mesh files) for the ranked IDs
  const relatedIds = rankedRelated.map((p) => p.id);
  const { data: relatedRaw } = relatedIds.length > 0
    ? await supabase
        .from("products")
        .select("*, mesh_files(*)")
        .in("id", relatedIds)
    : { data: [] };

  // Preserve ranking order returned by the algorithm
  const relatedOrdered = rankedRelated
    .map((ranked) => relatedRaw?.find((r) => r.id === ranked.id))
    .filter(Boolean) as Record<string, unknown>[];

  const product = mapProduct(raw as Record<string, unknown>);
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://akaar3d.in";

  const allImages = product.images?.length
    ? product.images
    : product.imageUrl
    ? [product.imageUrl]
    : [];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.slug,
    description: product.shortDescription ?? product.description ?? undefined,
    image: allImages.length > 0 ? allImages : undefined,
    url: `${BASE_URL}/products/${product.slug}`,
    category: product.category ?? undefined,
    brand: { "@type": "Brand", name: "AKAAR 3D" },
    manufacturer: { "@type": "Organization", name: "AKAAR 3D", url: BASE_URL },
    ...(product.price != null
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            url: `${BASE_URL}/products/${product.slug}`,
            seller: { "@type": "Organization", name: "AKAAR 3D" },
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "INR" },
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
              deliveryTime: {
                "@type": "ShippingDeliveryTime",
                handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 2, unitCode: "DAY" },
                transitTime:  { "@type": "QuantitativeValue", minValue: 3, maxValue: 7, unitCode: "DAY" },
              },
            },
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "IN",
              returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 7,
              returnMethod: "https://schema.org/ReturnByMail",
              returnFees: "https://schema.org/ReturnShippingFees",
            },
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
        relatedProducts={relatedOrdered.map((r) => mapProduct(r))}
      />
    </>
  );
}
