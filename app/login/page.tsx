"use client";
import AuthPopup from "@/components/LoginPopup"; // update the path to where your AuthPopup is located

export default function LoginPage() {
  return (
    <AuthPopup
      isOpen={true}
      onClose={() => {
        // Optionally do nothing here, or navigate somewhere else after successful login
      }}
    />
  );
}
