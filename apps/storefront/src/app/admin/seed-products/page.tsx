import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SeedProductsClient } from "./SeedProductsClient";

export const dynamic = "force-dynamic";

export default async function SeedProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin?callbackUrl=%2Fadmin%2Fseed-products");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "ADMIN") {
    return (
      <div className="min-h-screen pt-28 pb-20 px-6">
        <p className="text-amber-400">Admin access required.</p>
      </div>
    );
  }

  return <SeedProductsClient />;
}
