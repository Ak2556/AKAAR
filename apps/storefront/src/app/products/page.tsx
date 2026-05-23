import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ProductIndexPage, type ProductSearchParams } from "./ProductIndexPage";

export const metadata: Metadata = buildMetadata(
  "Shop 3D Printed Products | AKAAR 3D",
  "Browse handcrafted 3D printed products from AKAAR's studio in Jaipur. FDM printed in PLA, ABS, TPU, and PETG. Ready to ship across India.",
  "/products"
);

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductSearchParams>;
}) {
  return <ProductIndexPage searchParams={await searchParams} />;
}
