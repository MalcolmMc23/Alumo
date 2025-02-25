import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { findOrCreateUser } from "./db";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ profile }) {
      return await findOrCreateUser(profile);
    },

    async session({ session, token }) {
      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl; // Redirect to the base URL 
    },
  },
};
