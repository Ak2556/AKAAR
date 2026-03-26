import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use lightweight auth config for edge middleware (no Prisma/bcrypt)
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/account/:path*"],
};
