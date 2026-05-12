import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://akaar3d.in";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og`;
const SITE_NAME = "AKAAR 3D";

/**
 * Build a consistent Metadata object for a page.
 * Fills in canonical URL, OpenGraph, and Twitter Card automatically.
 */
export function buildMetadata(
  title: string,
  description: string,
  path: string,
  image?: string | null
): Metadata {
  const url = `${BASE_URL}${path}`;
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
