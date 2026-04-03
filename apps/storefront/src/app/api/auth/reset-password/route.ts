import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@akaar/db";
import bcrypt from "bcryptjs";
import { resetPasswordSchema, validateRequest } from "@/lib/validations";
import { withRateLimit, rateLimitPresets } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 requests per minute (strict)
    const rateLimitError = await withRateLimit(request, rateLimitPresets.strict);
    if (rateLimitError) return rateLimitError;

    const body = await request.json();
    const validation = validateRequest(resetPasswordSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { token, password } = validation.data;

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid reset token" },
        { status: 400 }
      );
    }

    if (resetToken.expires < new Date()) {
      // Clean up expired token
      await prisma.passwordResetToken.delete({
        where: { token },
      });
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the used token
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
