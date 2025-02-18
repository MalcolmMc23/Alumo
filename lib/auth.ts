// lib/auth.ts
import { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { useSession } from 'next-auth/react'
import { redirect } from "next/navigation"
import { useRouter } from 'next/navigation'
import { getServerSession } from 'next-auth'


export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}



// Function to check if a user session exists on the **server-side**
export async function loginIsRequiredServer() {
  // Retrieve the user's session using NextAuth's getServerSession function
  const session = await getServerSession(authOptions);

  // If there is no active session, redirect the user to the home page ("/")
  if (!session) return redirect("/");
}

// Function to check if a user session exists on the **client-side**
export function loginIsRequiredClient() {
  // Ensure this check runs only in the browser (client-side)
  if (typeof window !== "undefined") {
    // Retrieve the user's session using the useSession() hook (likely from NextAuth)
    const session = useSession();

    // Initialize the Next.js router to enable navigation
    const router = useRouter();

    // If the user is not logged in, redirect them to the login page ("/login")
    if (!session) router.push("/login");
  }
}
