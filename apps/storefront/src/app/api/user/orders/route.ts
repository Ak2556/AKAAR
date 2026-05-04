import { NextResponse } from "next/server";
import { prisma } from "@akaar/db";
import { getOptionalSession } from "@/lib/auth-helpers";
import { getRuntimeCapabilities } from "@/lib/runtime-capabilities";
import { isLocalDataMode } from "@/lib/local-runtime";
import { listLocalOrdersForUser } from "@/lib/local-data-store";

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

    const orders = isLocalDataMode()
      ? await listLocalOrdersForUser(session.user.id)
      : await prisma.order.findMany({
          where: {
            userId: session.user.id,
          },
          include: {
            items: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Orders unavailable" },
      { status: 503 }
    );
  }
}
