import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ProductIndexPage, type ProductSearchParams } from "./products/ProductIndexPage";

export const metadata: Metadata = buildMetadata(
  "Shop 3D Printed Products | AKAAR 3D",
  "Explore ready-to-ship 3D printed products from AKAAR's Jaipur studio, then request a custom build when you need something specific.",
  "/"
);

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<ProductSearchParams>;
}) {
  return <ProductIndexPage searchParams={await searchParams} />;
}
