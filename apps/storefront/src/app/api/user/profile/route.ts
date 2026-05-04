import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@akaar/db";
import { getOptionalSession } from "@/lib/auth-helpers";
import { getRuntimeCapabilities } from "@/lib/runtime-capabilities";
import { getLocalUserById, updateLocalUser } from "@/lib/local-data-store";
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

    const user = isLocalDataMode()
      ? await getLocalUserById(session.user.id)
      : await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Profile unavailable" },
      { status: 503 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();

    const user = isLocalDataMode()
      ? await updateLocalUser({
          id: session.user.id,
          name: body.name || null,
        })
      : await prisma.user.update({
          where: { id: session.user.id },
          data: {
            name: body.name || undefined,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Profile unavailable" },
      { status: 503 }
    );
  }
}
