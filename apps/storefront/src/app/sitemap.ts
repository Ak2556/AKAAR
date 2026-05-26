import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllTeamSlugs } from "@/lib/team-data";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://akaar3d.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`,          priority: 1.0, changeFrequency: "weekly"  },
    { url: `${BASE_URL}/products`,  priority: 0.9, changeFrequency: "daily"   },
    { url: `${BASE_URL}/services`,  priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/about`,     priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/team`,      priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/quote`,     priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/faq`,       priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/contact`,   priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/privacy`,           priority: 0.3, changeFrequency: "yearly" },
    { url: `${BASE_URL}/terms`,             priority: 0.3, changeFrequency: "yearly" },
    { url: `${BASE_URL}/shipping-policy`,   priority: 0.4, changeFrequency: "yearly" },
    { url: `${BASE_URL}/refund-policy`,     priority: 0.4, changeFrequency: "yearly" },
  ];

  // ── Dynamic product pages ───────────────────────────────────────────────
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const db = createAdminClient();
    const { data: products } = await db
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    productRoutes = (products ?? []).map((p) => ({
      url:             `${BASE_URL}/products/${p.slug}`,
      lastModified:    p.updated_at ? new Date(p.updated_at) : undefined,
      priority:        0.9,
      changeFrequency: "weekly" as const,
    }));
  } catch {
    // Graceful degradation — sitemap still works without DB
  }

  // ── Team member pages ───────────────────────────────────────────────────
  const teamRoutes: MetadataRoute.Sitemap = getAllTeamSlugs().map((slug) => ({
    url:             `${BASE_URL}/team/${slug}`,
    priority:        0.5,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...productRoutes, ...teamRoutes];
}
