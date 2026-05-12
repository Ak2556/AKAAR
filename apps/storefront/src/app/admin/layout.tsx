import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin?callbackUrl=%2Fadmin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name, email")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen">
      <AdminSidebarNav
        user={{ name: profile.name ?? null, email: profile.email }}
      />
      {/* Desktop: offset by sidebar width. Mobile: extra top padding for pill nav strip */}
      <div className="lg:pl-64 pt-10 lg:pt-0">{children}</div>
    </div>
  );
}
