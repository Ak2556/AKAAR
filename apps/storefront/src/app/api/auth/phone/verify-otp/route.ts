import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface Body {
  phone?: string;
  otp?: string;
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
    const otp = (body.otp || "").trim();
    if (!/^\d{10,12}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid mobile number" }, { status: 400 });
    }
    if (!/^\d{4,8}$/.test(otp)) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    const mobile = phone.startsWith("91") ? phone : `91${phone}`;
    const url = `https://control.msg91.com/api/v5/otp/verify?otp=${otp}&mobile=${mobile}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { authkey: process.env.MSG91_AUTH_KEY! },
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok || result.type === "error") {
      return NextResponse.json({ error: result.message || "Invalid OTP" }, { status: 400 });
    }

    // NOTE: This stub does not yet bind the verified phone to a
    // Supabase session. The next step is to call admin.auth.admin
    // .createUser({ phone, phone_confirm: true }) or sign in with
    // an existing user's phone — wire this up once the storefront
    // is ready to accept phone-only accounts.

    return NextResponse.json({ ok: true, verified: true, phone: mobile });
  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json({ error: "Could not verify OTP" }, { status: 500 });
  }
}
