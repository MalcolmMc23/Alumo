"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Login</h1>
      <button
        onClick={() =>
          signIn("google", { callbackUrl: "/api/auth/callback/google" })
        }
      >
        Sign in with Google
      </button>{" "}
    </div>
  );
}
