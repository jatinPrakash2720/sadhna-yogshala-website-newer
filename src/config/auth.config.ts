/**
 * Yogshala LMS — Auth.js Edge-Compatible Configuration
 * Providers, callbacks, and pages configuration.
 * This file is imported by both auth.ts and proxy.ts (Edge runtime).
 */

import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { UserRole } from "@/constants";

/**
 * Edge-compatible auth configuration.
 * Does NOT include database adapter (not available on Edge).
 */
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Authorize is handled in auth.ts where we have DB access.
       * This placeholder is required for the Edge-compatible config.
       */
      async authorize() {
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    /**
     * JWT callback — embed custom fields into the token.
     */
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as Record<string, unknown>).role || UserRole.STUDENT;
        token.profileCompleted = (user as Record<string, unknown>).profileCompleted ?? true;
      }

      // Allow session updates (e.g., after profile completion)
      if (trigger === "update" && session) {
        token.role = session.role || token.role;
        token.profileCompleted = session.profileCompleted ?? token.profileCompleted;
      }

      return token;
    },

    /**
     * Session callback — expose custom fields in the client session.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).profileCompleted = token.profileCompleted;
      }
      return session;
    },

    /**
     * Authorized callback — used by proxy.ts for route protection.
     */
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
};

export const { auth: edgeAuth } = NextAuth(authConfig);

export default authConfig;
