import { prisma } from "@akaar/db";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";
import { quoteRequestSchema, validateRequest } from "@/lib/validations";

// GET - List user's quote requests
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const quotes = await prisma.quoteRequest.findMany({
      where: { userId: session.user.id },
      include: {
        files: true,
      },
      orderBy: { createdAt: "desc" },
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

// POST - Create new quote request
export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();

    const validation = validateRequest(quoteRequestSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name, email, company, phone, service, material, quantity, notes, files } =
      validation.data;

    // Generate quote number
    const quoteNumber = `QT-${nanoid(10).toUpperCase()}`;

    // Create quote request
    const quote = await prisma.quoteRequest.create({
      data: {
        quoteNumber,
        userId: session?.user?.id,
        name,
        email,
        company,
        phone,
        service,
        material,
        quantity,
        notes,
        files: files?.length
          ? {
              create: files.map((file) => ({
                originalFilename: file.originalFilename,
                storedFilename: file.s3Key.split("/").pop() || file.originalFilename,
                s3Key: file.s3Key,
                s3Bucket: file.s3Bucket || process.env.AWS_S3_BUCKET || "akaar-uploads",
                fileSize: file.fileSize,
                fileType: file.fileType,
              })),
            }
          : undefined,
      },
      include: {
        files: true,
      },
    });

    return NextResponse.json(
      {
        message: "Quote request submitted successfully",
        quoteNumber: quote.quoteNumber,
        quote,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Failed to create quote request" },
      { status: 500 }
    );
  }
}
