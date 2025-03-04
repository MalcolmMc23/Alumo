"use client";

import { User, Mail, X, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import ProfileDetailsPopup from "./ProfileDetailsPopup";

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePopup({ isOpen, onClose }: ProfilePopupProps) {
  const [isProfileDetailsOpen, setIsProfileDetailsOpen] = useState(false);

  // Close popup when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileDetailsOpen(true);
    // Don't close the parent popup right away
    // This allows the ProfileDetailsPopup to fully mount
    setTimeout(onClose, 50);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Contact clicked");
    onClose();
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    signOut({ callbackUrl: "/login" })
      .then(() => {
        console.log("User logged out");
        onClose();
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  // Always render the ProfileDetailsPopup even if parent is not open
  // This allows it to maintain state between transitions
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50" onClick={onClose}>
          <div
            className="absolute right-4 top-16 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <User size={18} className="text-purple-600" />
                <span className="font-medium">Profile</span>
              </button>

              <button
                onClick={handleContactClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Mail size={18} className="text-purple-600" />
                <span className="font-medium">Contact</span>
              </button>

              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} className="text-red-600" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <ProfileDetailsPopup
        isOpen={isProfileDetailsOpen}
        onClose={() => setIsProfileDetailsOpen(false)}
      />
    </>
  );
}
