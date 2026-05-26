import { NextResponse } from "next/server";
import { checkServiceability } from "@/lib/serviceability";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get("pin") ?? "";
  const result = checkServiceability(pin);
  return NextResponse.json(result);
}
