import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@akaar/db";
import { getOptionalSession } from "@/lib/auth-helpers";
import { getRuntimeCapabilities } from "@/lib/runtime-capabilities";
import {
  createLocalAddress,
  listLocalAddressesForUser,
} from "@/lib/local-data-store";
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

    const addresses = isLocalDataMode()
      ? await listLocalAddressesForUser(session.user.id)
      : await prisma.address.findMany({
          where: {
            userId: session.user.id,
          },
          orderBy: {
            isDefault: "desc",
          },
        });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Addresses unavailable" },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const address = isLocalDataMode()
      ? await createLocalAddress(session.user.id, {
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
          if (body.isDefault) {
            await prisma.address.updateMany({
              where: { userId: session.user.id },
              data: { isDefault: false },
            });
          }

          return prisma.address.create({
            data: {
              userId: session.user.id,
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

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Addresses unavailable" },
      { status: 503 }
    );
  }
}
