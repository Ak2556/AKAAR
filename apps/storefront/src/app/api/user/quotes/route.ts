import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: quotes, error } = await supabase
      .from("quote_requests")
      .select("*, quote_files(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      quotes: (quotes ?? []).map((q) => ({
        id: q.id,
        quoteNumber: q.quote_number,
        status: q.status,
        service: q.service,
        material: q.material,
        quantity: q.quantity,
        notes: q.notes,
        quotedPrice: q.quoted_price == null ? null : Number(q.quoted_price),
        responseNotes: q.response_notes,
        respondedAt: q.responded_at,
        createdAt: q.created_at,
        files: (q.quote_files ?? []).map((f: { id: string; original_filename: string }) => ({
          id: f.id,
          originalFilename: f.original_filename,
        })),
      })),
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}
