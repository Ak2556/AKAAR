import { NextResponse } from "next/server";
import { sendContactFormEmail } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, company, department, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await sendContactFormEmail({ name, email, company, department, subject, message });

  return NextResponse.json({ success: true });
}
