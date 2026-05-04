import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@akaar/db";
import { getOptionalSession } from "@/lib/auth-helpers";
import { getRuntimeCapabilities } from "@/lib/runtime-capabilities";
import {
  deleteLocalAddress,
  getLocalAddressForUser,
  updateLocalAddress,
} from "@/lib/local-data-store";
import { isLocalDataMode } from "@/lib/local-runtime";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getRuntimeCapabilities().authAvailable) {
    return NextResponse.json(
      { error: "Authentication unavailable" },
      { status: 503 }
    );
  }

  try {
    const session = await getOptionalSession();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Verify ownership
    const existing = isLocalDataMode()
      ? await getLocalAddressForUser(session.user.id, id)
      : await prisma.address.findFirst({
          where: { id, userId: session.user.id },
        });

    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const address = isLocalDataMode()
      ? await updateLocalAddress(session.user.id, id, {
          label: body.label || null,
          type: body.type || "home",
          firstName: body.firstName,
          lastName: body.lastName,
          address: body.address,
          apartment: body.apartment || null,
          city: body.city,
          state: body.state,
          zip: body.zip,
          country: body.country || "India",
          phone: body.phone || null,
          isDefault: body.isDefault || false,
        })
      : await (async () => {
          if (body.isDefault && !existing.isDefault) {
            await prisma.address.updateMany({
              where: { userId: session.user.id, id: { not: id } },
              data: { isDefault: false },
            });
          }

          return prisma.address.update({
            where: { id },
            data: {
              label: body.label || null,
              type: body.type || "home",
              firstName: body.firstName,
              lastName: body.lastName,
              address: body.address,
              apartment: body.apartment || null,
              city: body.city,
              state: body.state,
              zip: body.zip,
              country: body.country || "India",
              phone: body.phone || null,
              isDefault: body.isDefault || false,
            },
          });
        })();

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Addresses unavailable" },
      { status: 503 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getRuntimeCapabilities().authAvailable) {
    return NextResponse.json(
      { error: "Authentication unavailable" },
      { status: 503 }
    );
  }

  try {
    const session = await getOptionalSession();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existing = isLocalDataMode()
      ? await getLocalAddressForUser(session.user.id, id)
      : await prisma.address.findFirst({
          where: { id, userId: session.user.id },
        });

    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (isLocalDataMode()) {
      await deleteLocalAddress(session.user.id, id);
    } else {
      await prisma.address.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Addresses unavailable" },
      { status: 503 }
    );
  }
}
