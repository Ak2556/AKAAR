import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Stub MSG91 / Twilio bridge. Activates when MSG91_AUTH_KEY +
// MSG91_TEMPLATE_ID are set. Until then this endpoint returns a
// 503 so the UI can show a friendly "phone login coming soon"
// state without crashing.
//
// To enable:
//   1. Set MSG91_AUTH_KEY and MSG91_TEMPLATE_ID in your env.
//   2. Verify the endpoint URLs against the MSG91 dashboard.
//   3. Wire send-otp + verify-otp into Supabase by creating a
//      passwordless user with the verified phone, mirroring the
//      flow Supabase uses for magic links.

interface Body {
  phone?: string;
}

function hasMsg91Creds(): boolean {
  return Boolean(process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID);
}

export async function POST(request: Request) {
  if (!hasMsg91Creds()) {
    return NextResponse.json(
      { error: "Phone login is not configured yet" },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as Body;
    const phone = (body.phone || "").replace(/\D/g, "");
    if (!/^\d{10,12}$/.test(phone)) {
      return NextResponse.json({ error: "Enter a valid mobile number" }, { status: 400 });
    }

    const res = await fetch("https://control.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authkey: process.env.MSG91_AUTH_KEY!,
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: phone.startsWith("91") ? phone : `91${phone}`,
        otp_length: 6,
        otp_expiry: 5,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("MSG91 send-otp failed:", detail);
      return NextResponse.json({ error: "Could not send OTP" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("send-otp error:", error);
    return NextResponse.json({ error: "Could not send OTP" }, { status: 500 });
  }
}
