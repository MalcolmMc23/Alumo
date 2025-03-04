"use client";

import { useState, useEffect } from "react";
import {
  X,
  User,
  GraduationCap,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";

interface ProfileDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  name: string;
  image?: string | null;
  university: string;
  major: string;
  graduationYear: string;
  bio: string;
  joinedDate: string;
}

export default function ProfileDetailsPopup({
  isOpen,
  onClose,
}: ProfileDetailsPopupProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchUserData = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch("/api/user");

          if (!response.ok) {
            throw new Error("Failed to fetch profile data");
          }

          const data = await response.json();
          setUserData(data);
        } catch (err) {
          console.error("Error fetching profile data:", err);
          setError("Could not load profile data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative animate-zoom-in">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={40} className="text-purple-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading profile information...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        ) : userData ? (
          <>
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex-shrink-0 bg-purple-100 h-24 w-24 rounded-full flex items-center justify-center overflow-hidden">
                {userData.image ? (
                  <img
                    src={userData.image}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-purple-600" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {userData.name}
                </h2>
                <p className="text-gray-500">
                  Member since {userData.joinedDate}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Education Section */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Education
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <GraduationCap size={20} className="text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-800">
                        {userData.university}
                      </p>
                      <p className="text-gray-600">{userData.major}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Calendar size={20} className="text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-800">
                        Expected Graduation
                      </p>
                      <p className="text-gray-600">{userData.graduationYear}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About
                </h3>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FileText size={20} className="text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-700">{userData.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No profile information available.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
