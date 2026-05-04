import { NextResponse } from "next/server";
import { prisma } from "@akaar/db";
import bcrypt from "bcryptjs";
import { registerSchema, validateRequest } from "@/lib/validations";
import { withRateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { createAuditLog, getAuditContext } from "@/lib/audit";
import {
  countLocalAdminUsers,
  createLocalUser,
  getLocalUserByEmail,
} from "@/lib/local-data-store";
import { isLocalDataMode } from "@/lib/local-runtime";

export async function POST(request: Request) {
  try {
    const localDataMode = isLocalDataMode();

    // Rate limit: 10 requests per minute
    const rateLimitError = await withRateLimit(request, rateLimitPresets.standard);
    if (rateLimitError) return rateLimitError;

    const body = await request.json();
    const validation = validateRequest(registerSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = localDataMode
      ? await getLocalUserByEmail(email)
      : await prisma.user.findUnique({
          where: { email },
        });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const adminUserCount =
      process.env.NODE_ENV !== "production"
        ? localDataMode
          ? await countLocalAdminUsers()
          : await prisma.user.count({ where: { role: "ADMIN" } })
        : 1;

    // Create user
    const user = localDataMode
      ? await createLocalUser({
          name,
          email,
          password: hashedPassword,
          role: adminUserCount === 0 ? "ADMIN" : "CUSTOMER",
        })
      : await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: adminUserCount === 0 ? "ADMIN" : "CUSTOMER",
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        });

    // Audit log: successful registration
    const auditContext = getAuditContext(request);
    await createAuditLog({
      userId: user.id,
      action: "REGISTER",
      entityType: "User",
      entityId: user.id,
      ...auditContext,
      metadata: { email: user.email },
    });

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
