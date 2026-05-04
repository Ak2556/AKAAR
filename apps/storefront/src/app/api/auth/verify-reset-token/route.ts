import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@akaar/db";
import {
  deleteLocalPasswordResetToken,
  getLocalPasswordResetToken,
} from "@/lib/local-data-store";
import { isLocalDataMode } from "@/lib/local-runtime";

export async function GET(request: NextRequest) {
  try {
    const localDataMode = isLocalDataMode();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token is required" },
        { status: 400 }
      );
    }

    const resetToken = localDataMode
      ? await getLocalPasswordResetToken(token)
      : await prisma.passwordResetToken.findUnique({
          where: { token },
        });

    if (!resetToken) {
      return NextResponse.json(
        { valid: false, error: "Invalid reset token" },
        { status: 400 }
      );
    }

    if (new Date(resetToken.expires) < new Date()) {
      // Clean up expired token
      if (localDataMode) {
        await deleteLocalPasswordResetToken(token);
      } else {
        await prisma.passwordResetToken.delete({
          where: { token },
        });
      }
      return NextResponse.json(
        { valid: false, error: "Reset token has expired" },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Verify reset token error:", error);
    return NextResponse.json(
      { valid: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
