import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@akaar/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quotes = await prisma.quoteRequest.findMany({
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
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}
