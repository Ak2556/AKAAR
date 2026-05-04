import { NextResponse } from "next/server";
import { prisma } from "@akaar/db";
import { getOptionalSession } from "@/lib/auth-helpers";
import { getRuntimeCapabilities } from "@/lib/runtime-capabilities";
import { listLocalQuotesForUser } from "@/lib/local-data-store";
import { isLocalDataMode } from "@/lib/local-runtime";

export async function GET() {
  if (!getRuntimeCapabilities().authAvailable) {
    return NextResponse.json(
      { error: "Authentication unavailable" },
      { status: 503 }
    );
  }

  try {
    const session = await getOptionalSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quotes = isLocalDataMode()
      ? await listLocalQuotesForUser(session.user.id)
      : await prisma.quoteRequest.findMany({
          where: {
            userId: session.user.id,
          },
          include: {
            files: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Quotes unavailable" },
      { status: 503 }
    );
  }
}
