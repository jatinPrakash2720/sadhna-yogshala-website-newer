/**
 * Yogshala LMS — Full Auth.js Configuration
 * Includes MongoDB adapter + complete Credentials authorize logic.
 * NOT Edge-compatible — only used in Node.js runtime (API routes, server components).
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { connectToDatabase } from "@/config/database";
import User from "@/models/User.model";
import { UserRole, AuthProvider } from "@/constants";
import { authConfig } from "@/config/auth.config";
import { comparePassword } from "@/utils/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // Override providers to include full authorize logic (needs DB access)
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectToDatabase();

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        // Find user with password field included (normally select: false)
        const user = await User.findOne({ email }).select("+password").lean();

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (user.status !== "active") {
          throw new Error("Your account has been suspended. Contact support.");
        }

        if (!user.password) {
          throw new Error("Please login with Google or set a password first");
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Update last login
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          profileCompleted: user.profileCompleted,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    /**
     * Sign-in callback — handle Google OAuth user creation/linking.
     */
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();

        const existingUser = await User.findOne({
          email: user.email?.toLowerCase().trim(),
        });

        if (existingUser) {
          // Update last login and image if changed
          await User.findByIdAndUpdate(existingUser._id, {
            lastLogin: new Date(),
            ...(user.image && { image: user.image }),
          });
          // Attach existing user data to the user object for JWT callback
          user.id = existingUser._id.toString();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (user as any).role = existingUser.role;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (user as any).profileCompleted = existingUser.profileCompleted;
        } else {
          // Create new user from Google data
          const newUser = await User.create({
            name: user.name ?? "Google User",
            email: (user.email ?? "").toLowerCase().trim(),
            image: user.image ?? undefined,
            authProvider: AuthProvider.GOOGLE,
            isVerified: true,
            profileCompleted: false, // Missing phone & password
            role: UserRole.STUDENT,
            lastLogin: new Date(),
          });
          user.id = newUser._id.toString();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (user as any).role = newUser.role;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (user as any).profileCompleted = false;
        }
      }
      return true;
    },
  },
});
