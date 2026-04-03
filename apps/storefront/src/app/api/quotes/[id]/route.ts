import { prisma } from "@akaar/db";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// GET - Get single quote details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    const quote = await prisma.quoteRequest.findUnique({
      where: { id },
      include: {
        files: true,
      },
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    // Check if user owns this quote (if logged in)
    if (session?.user?.id && quote.userId && quote.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}
