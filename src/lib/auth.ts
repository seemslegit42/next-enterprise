import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import { env } from "../../env.mjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        // This is a placeholder - in a real app, you would validate against your database
        // For now, we'll use a hardcoded user for testing
        if (parsedCredentials.data.email === "user@example.com" &&
            parsedCredentials.data.password === "password123") {
          return {
            id: "1",
            email: parsedCredentials.data.email,
            name: "Test User",
          };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
        };
      }
      return token;
    },
  },
  secret: env.NEXTAUTH_SECRET,
};
