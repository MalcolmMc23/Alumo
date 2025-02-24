"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthPopup({ isOpen, onClose }: AuthPopupProps) {
  // For demonstration, track whether the user is in "Login" or "Sign Up" mode
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (!isOpen) return null;

  // Example handler for the Google authentication flow
  const handleGoogleAuth = () => {
    signIn("google");
    // Integrate your actual Google OAuth logic here (e.g., using NextAuth, Firebase, etc.)
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="relative bg-white rounded-2xl w-full max-w-md p-8 animate-zoom-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isLoginMode ? "Log In" : "Sign Up"} to Alumo
          </h2>
          <p className="text-gray-600">
            {isLoginMode
              ? "Welcome back! Continue with Google or switch to sign up."
              : "Join us! Create an account with Google or switch to log in."}
          </p>
        </div>

        {/* Google Auth Button */}
        <button
          onClick={handleGoogleAuth}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 mb-4 text-black bg-white hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M533.5 278.4c0-15.6-1.3-31.2-3.8-46.4H272v87.8h146.9c-6.3 34.2-24.8 63.2-52.7 82.5l84.4 65.4c49-45 77.3-111.4 77.3-189.3z"
            />
            <path
              fill="#34A853"
              d="M272 544.3c71.4 0 131.4-23.7 175.2-64.4l-84.4-65.4c-23 15.8-52.7 25-90.8 25-69.6 0-128.4-46.9-149.4-109.6H37.1v68.5c43 85.6 131.6 145.4 234.9 145.4z"
            />
            <path
              fill="#FBBC04"
              d="M122.6 330.4c-10.1-30.2-10.1-62.6 0-92.8v-68.5H37.1c-36.2 70.8-36.2 159.1 0 229.9l85.5-68.6z"
            />
            <path
              fill="#EA4335"
              d="M272 107.6c37.8 0 71.7 13 98.4 38l73.8-73.8C413.3 28.7 343.4 0 272 0 168.7 0 80.1 59.8 37.1 145.4l85.5 68.5C143.6 150.7 202.4 107.6 272 107.6z"
            />
          </svg>
          {isLoginMode ? "Continue with Google" : "Sign Up with Google"}
        </button>

        {/* Divider or Additional Form Fields (Optional) */}
        <div className="relative flex items-center justify-center my-4">
          <span className="text-sm text-gray-400">OR</span>
        </div>

        {/* Optional: Switch between Login and Signup */}
        <div className="text-center">
          <p className="text-gray-600">
            {isLoginMode
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-purple-600 hover:underline mt-2"
          >
            {isLoginMode ? "Sign Up" : "Log In"} instead
          </button>
        </div>
      </div>
    </div>
  );
}
