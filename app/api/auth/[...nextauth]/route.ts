import NextAuth from "next-auth"
import { authOptions } from "@/lib/authOptions"

// The new pattern: NextAuth returns a standard handler function.
// We then export it for GET and POST:
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
