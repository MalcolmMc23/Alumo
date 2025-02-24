import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { findOrCreateUser } from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      google_sub?: string;
      // ... other properties ...
    }
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login", // Custom login page
    error: "/login", // Redirect to login on error
    newUser: "/onboarding", // (Optional) Redirect new users
  },
  callbacks: {
    async signIn({ profile }) {
      return await findOrCreateUser(profile); // Calls DB helper function
    },

    async jwt({ token, profile }) {
      if (profile?.sub) {
        token.google_sub = profile.sub;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.google_sub) {
        session.user.google_sub = token.google_sub as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl; // Redirect to the base URL 
    },
  },
};
