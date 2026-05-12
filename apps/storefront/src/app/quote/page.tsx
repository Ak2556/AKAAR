import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import QuoteClient from "./QuoteClient";

export const metadata: Metadata = buildMetadata(
  "Request a Custom 3D Print Quote | AKAAR 3D",
  "Upload your 3D file, pick a material, and get a reviewed quote from AKAAR within 48 hours. No minimum order quantity. PLA, ABS, TPU, PETG.",
  "/quote"
);

export default function QuotePage() {
  return <QuoteClient />;
}
