import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use lightweight auth config for edge middleware (no Prisma/bcrypt)
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/account/:path*"],
};
