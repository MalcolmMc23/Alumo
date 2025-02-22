"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import AuthPopup from "@/components/LoginPopup"; // update the path to where your AuthPopup is located

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      // Redirect to the desired page after successful login
      router.push("/");
    }
  }, [status, router]);

  if (status === "authenticated") {
    // If the user is already authenticated, redirect to the desired page
    router.push("/");
    return null;
  }

  return (
    <AuthPopup
      isOpen={true}
      onClose={() => {
        // Optionally do nothing here, or navigate somewhere else after successful login
      }}
    />
  );
}
