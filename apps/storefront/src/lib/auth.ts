import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@akaar/db";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { Provider } from "next-auth/providers";
import { authConfig } from "./auth.config";
import {
  getLocalUserByEmail,
  getLocalUserById,
  upsertLocalOAuthUser,
} from "@/lib/local-data-store";
import { getServerEnv, isLocalDataMode } from "@/lib/local-runtime";

const localDataMode = isLocalDataMode();

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const user = localDataMode
        ? await getLocalUserByEmail(credentials.email as string)
        : await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

      if (!user || !user.password) {
        return null;
      }

      const isValid = await bcrypt.compare(
        credentials.password as string,
        user.password
      );

      if (!isValid) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      };
    },
  }),
];

// Only add OAuth providers if credentials are configured
const googleClientId = getServerEnv("GOOGLE_CLIENT_ID");
const googleClientSecret = getServerEnv("GOOGLE_CLIENT_SECRET");
const githubClientId = getServerEnv("GITHUB_CLIENT_ID");
const githubClientSecret = getServerEnv("GITHUB_CLIENT_SECRET");

if (googleClientId && googleClientSecret) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  );
}

if (githubClientId && githubClientSecret) {
  providers.push(
    GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  ...(localDataMode ? {} : { adapter: PrismaAdapter(prisma) }),
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || session.user.id;
        if (typeof token.name === "string") {
          session.user.name = token.name;
        }
        if (typeof token.email === "string") {
          session.user.email = token.email;
        }
        if (token.role) {
          session.user.role = token.role;
        }
      }

      return session;
    },
    async jwt({ token, user, account, trigger, session }) {
      const nextUser = user as
        | {
            role?: "CUSTOMER" | "ADMIN";
            name?: string | null;
            email?: string | null;
          }
        | undefined;

      if (nextUser?.name) {
        token.name = nextUser.name;
      }
      if (nextUser?.email) {
        token.email = nextUser.email;
      }
      if (nextUser?.role) {
        token.role = nextUser.role;
      }

      if (trigger === "update" && session) {
        if (typeof session.name === "string") {
          token.name = session.name;
        }
      }

      if (
        localDataMode &&
        account?.provider &&
        account.provider !== "credentials" &&
        typeof token.email === "string"
      ) {
        const localUser = await upsertLocalOAuthUser({
          email: token.email,
          name: typeof token.name === "string" ? token.name : null,
          image: typeof user?.image === "string" ? user.image : null,
        });

        token.sub = localUser.id;
        token.role = localUser.role;
        token.name = localUser.name ?? token.name;
        token.email = localUser.email;
      }

      if ((!token.role || localDataMode) && token.sub) {
        const currentUser = localDataMode
          ? await getLocalUserById(token.sub)
          : await prisma.user.findUnique({
              where: { id: token.sub },
              select: { role: true, name: true, email: true },
            });

        if (currentUser?.role) {
          token.role = currentUser.role;
        }
        if (currentUser?.name) {
          token.name = currentUser.name;
        }
        if (currentUser?.email) {
          token.email = currentUser.email;
        }
      }

      return token;
    },
  },
});
