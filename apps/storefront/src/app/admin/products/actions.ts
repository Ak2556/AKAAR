"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "ADMIN") throw new Error("Forbidden");
}

/** Toggle a product's active/inactive state */
export async function toggleProductActive(
  id: string,
  isActive: boolean
): Promise<void> {
  await requireAdmin();
  const db = createAdminClient();
  const { error } = await db
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/products"); // bust storefront ISR cache too
}

/** Permanently delete a product (and its mesh_file via cascade) */
export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();
  const db = createAdminClient();
  const { error } = await db.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

/**
 * Move a product one position up or down in the sorted list.
 * Normalises sort_order values for all products if they're all 0 (fresh inserts).
 */
export async function moveProduct(
  id: string,
  direction: "up" | "down"
): Promise<void> {
  await requireAdmin();
  const db = createAdminClient();

  // Fetch all products with a stable two-key sort
  const { data: all } = await db
    .from("products")
    .select("id, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (!all || all.length < 2) return;

  // Normalise: assign 0,1,2,… if everyone is at default 0
  const needsNorm = new Set(all.map((p) => p.sort_order)).size < all.length;
  if (needsNorm) {
    await Promise.all(
      all.map((p, i) =>
        db.from("products").update({ sort_order: i }).eq("id", p.id)
      )
    );
    all.forEach((p, i) => (p.sort_order = i));
  }

  const idx = all.findIndex((p) => p.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return;

  const a = all[idx];
  const b = all[swapIdx];
  // Swap their sort_order values
  await Promise.all([
    db.from("products").update({ sort_order: b.sort_order }).eq("id", a.id),
    db.from("products").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
