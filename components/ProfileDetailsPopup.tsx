"use client";

import { useState, useEffect } from "react";
import {
  X,
  User,
  GraduationCap,
  Calendar,
  FileText,
  Loader2,
  MapPin,
  Briefcase,
  Award,
  FileSpreadsheet,
  Linkedin,
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
  bio?: string;
  joinedDate: string;
  location?: string;
  skills?: string[];
  linkedInProfile?: string;
  educationLevel?: string;
  careerGoals?: string;
  hasResume?: boolean;
  userType?: string;
}

export default function ProfileDetailsPopup({
  isOpen,
  onClose,
}: ProfileDetailsPopupProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRendered, setHasRendered] = useState(false);

  // Once the component is mounted, mark it as rendered
  useEffect(() => {
    setHasRendered(true);
  }, []);

  // Add keyboard listener for Escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  // Fetch user data when popup opens
  useEffect(() => {
    if (isOpen && hasRendered) {
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
  }, [isOpen, hasRendered]);

  if (!isOpen) return null;

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl p-8 relative animate-zoom-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
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
                {userData.userType && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                      {userData.userType}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Education Section */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap size={20} className="text-purple-600 mr-2" />
                  Education
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="ml-2">
                      <p className="font-medium text-gray-800">
                        {userData.university}
                      </p>
                      <p className="text-gray-600">{userData.major}</p>
                      {userData.educationLevel && (
                        <p className="text-gray-600">
                          {userData.educationLevel}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Calendar size={18} className="text-purple-600" />
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

              {/* Location */}
              {userData.location && (
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin size={20} className="text-purple-600 mr-2" />
                    Location
                  </h3>
                  <p className="text-gray-700 ml-2">{userData.location}</p>
                </div>
              )}

              {/* Career Goals */}
              {userData.careerGoals && (
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase size={20} className="text-purple-600 mr-2" />
                    Career Goals
                  </h3>
                  <p className="text-gray-700 ml-2">{userData.careerGoals}</p>
                </div>
              )}

              {/* Skills */}
              {userData.skills && userData.skills.length > 0 && (
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Award size={20} className="text-purple-600 mr-2" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2 ml-2">
                    {userData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileSpreadsheet size={20} className="text-purple-600 mr-2" />
                  Resume
                </h3>
                <div className="ml-2">
                  {userData.hasResume ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                      <p className="text-gray-700">Resume uploaded</p>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                      <p className="text-gray-500">No resume uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* LinkedIn Profile */}
              {userData.linkedInProfile && (
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Linkedin size={20} className="text-purple-600 mr-2" />
                    LinkedIn
                  </h3>
                  <a
                    href={userData.linkedInProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 ml-2 inline-flex items-center"
                  >
                    <span className="mr-1">View Profile</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}

              {/* Bio Section */}
              {userData.bio && (
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText size={20} className="text-purple-600 mr-2" />
                    About
                  </h3>
                  <p className="text-gray-700 ml-2">{userData.bio}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No profile information available.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
