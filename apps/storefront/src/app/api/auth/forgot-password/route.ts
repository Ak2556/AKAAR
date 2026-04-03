import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@akaar/db";
import { nanoid } from "nanoid";
import { sendPasswordResetEmail } from "@/lib/email";
import { forgotPasswordSchema, validateRequest } from "@/lib/validations";
import { withRateLimit, rateLimitPresets } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 requests per minute (strict)
    const rateLimitError = await withRateLimit(request, rateLimitPresets.strict);
    if (rateLimitError) return rateLimitError;

    const body = await request.json();
    const validation = validateRequest(forgotPasswordSchema, body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { email } = validation.data;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: user.email },
    });

    // Generate new token
    const token = nanoid(32);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token,
        expires,
      },
    });

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name || undefined,
        resetUrl,
      });
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
