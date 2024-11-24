import { compare } from "bcrypt-ts";
import NextAuth, { User, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { getUser, createUser } from "@/db/queries";

import { authConfig } from "./auth.config";

declare module "next-auth" {
  interface User {
    sub?: string;
  }
}

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        let users = await getUser(email);
        if (users.length === 0) return null;
        let passwordsMatch = await compare(password, users[0].password!);
        if (passwordsMatch) return users[0] as any;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          sub: profile.sub,
          email: profile.email,
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && token.email) {
        const [dbUser] = await getUser(token.email as string);
        if (dbUser) {
          token.id = dbUser.id;
        }
      } else if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          // Check if user exists
          const [existingUser] = await getUser(user.email);

          if (!existingUser && user.sub) {
            await createUser(user.email, undefined, user.sub);
          }

          return true; // Allow sign in
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false; // Block sign in on error
        }
      }

      return true; // Allow sign in for other providers
    },
  },
});
