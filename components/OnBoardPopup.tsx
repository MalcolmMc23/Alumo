"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Upload,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import majorsList from "./majorsList";

// Custom animations style
const animationStyles = `
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .suggestions-dropdown {
    opacity: 0;
    animation: fadeInDown 0.3s ease-out forwards;
  }
  
  .suggestion-item {
    animation: scaleIn 0.2s ease-out forwards;
    animation-delay: calc(var(--index) * 0.03s);
  }
`;

interface OnBoardPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  educationLevel: string;
  major: string; // Will store comma-separated majors
  selectedMajors: string[]; // Array to store selected majors
  graduationYear: string;
  careerGoals: string;
  hasResume: boolean;
  resumeFile: File | null;
  resumeText: string;
  resumeFileName: string;
  resumeFileType: string;
}

const educationLevels = [
  { value: "freshman", label: "Freshman" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "graduate", label: "Graduate Student" },
];

const experienceLevels = [
  { value: "none", label: "No Experience" },
  { value: "some", label: "Some Experience" },
  { value: "experienced", label: "Experienced" },
];

export default function OnBoardPopup({ isOpen, onClose }: OnBoardPopupProps) {
  // Add the animations style to the component
  useEffect(() => {
    // Add the style element only once when component mounts
    const styleElement = document.createElement("style");
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);

    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    educationLevel: "",
    major: "",
    selectedMajors: [],
    graduationYear: "",
    careerGoals: "",
    hasResume: false,
    resumeFile: null,
    resumeText: "",
    resumeFileName: "",
    resumeFileType: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [majorSuggestions, setMajorSuggestions] = useState<string[]>([]);
  const majorInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We'll no longer initialize with suggestions
    // Only show suggestions when user types
    setMajorSuggestions([]);
  }, []);

  if (!isOpen) return null;

  const totalSteps = 3;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Filter major suggestions when typing in the major field
    if (field === "major") {
      if (value.trim() === "") {
        // When input is empty, only show selected majors if any
        setMajorSuggestions(formData.selectedMajors);
      } else {
        // Filter non-selected majors based on input
        const filteredNonSelectedMajors = majorsList.filter(
          (major) =>
            !formData.selectedMajors.includes(major) &&
            major.toLowerCase().includes(value.toLowerCase())
        );

        // Combine with selected majors to ensure they always stay visible
        const combinedSuggestions = [
          ...formData.selectedMajors,
          ...filteredNonSelectedMajors,
        ];

        // Limit suggestions but ensure all selected ones remain
        const finalSuggestions = combinedSuggestions.slice(
          0,
          Math.max(10, formData.selectedMajors.length)
        );

        setMajorSuggestions(finalSuggestions);
      }
    }
  };

  const handleSelectMajor = (major: string) => {
    // Toggle selection - if already selected, remove it; otherwise, add it
    const newSelectedMajors = formData.selectedMajors.includes(major)
      ? formData.selectedMajors.filter((m) => m !== major)
      : [...formData.selectedMajors, major];

    setFormData((prev) => ({
      ...prev,
      selectedMajors: newSelectedMajors,
    }));

    // Keep focus on input
    if (majorInputRef.current) {
      majorInputRef.current.focus();
    }

    // Update suggestions to reflect new selection state
    const nonSelectedMajors = majorsList
      .filter(
        (m) =>
          !newSelectedMajors.includes(m) &&
          (formData.major.trim() === "" ||
            m.toLowerCase().includes(formData.major.toLowerCase()))
      )
      .slice(0, 10 - newSelectedMajors.length);

    setMajorSuggestions([...newSelectedMajors, ...nonSelectedMajors]);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Submit all user data
      submitUserData();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // First, update the UI to show we've selected a file
      setFormData((prev) => ({
        ...prev,
        resumeFile: file,
      }));

      // Process the file
      await processResumeFile(file);
    }
  };

  const processResumeFile = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError("");

      // Create form data for the API call
      const formData = new FormData();
      formData.append("file", file);

      // Call our resume processing API
      const response = await fetch("/api/user/resume", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to process resume");
      }

      // Update form data with the processed resume information
      setFormData((prev) => ({
        ...prev,
        hasResume: true,
        resumeText: result.resumeText,
        resumeFileName: result.filename,
        resumeFileType: result.fileType,
      }));

      setIsUploading(false);
    } catch (error) {
      console.error("Error processing resume:", error);
      setIsUploading(false);
      setUploadError(
        error instanceof Error ? error.message : "Failed to process resume"
      );

      // Clear the file if there was an error
      setFormData((prev) => ({
        ...prev,
        resumeFile: null,
        hasResume: false,
      }));
    }
  };

  const handleSkipResume = () => {
    setFormData((prev) => ({
      ...prev,
      hasResume: false,
      resumeFile: null,
      resumeText: "",
      resumeFileName: "",
      resumeFileType: "",
    }));
    handleNext();
  };

  const submitUserData = async () => {
    try {
      // Combine selected majors into a comma-separated string before submission
      const majorString = formData.selectedMajors.join(", ");

      // Prepare data for submission
      const userData = {
        educationLevel: formData.educationLevel,
        major: majorString, // Use the combined string
        graduationYear: formData.graduationYear,
        careerGoals: formData.careerGoals,
        hasResume: formData.hasResume,
      };

      // Submit to the profile API
      const response = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      // Successfully submitted, close the popup
      console.log("Onboarding complete:", result);
      onClose();
    } catch (error) {
      console.error("Error submitting onboarding data:", error);
      // Show an error message (you might want to add a UI component for this)
      alert("Failed to complete onboarding. Please try again.");
    }
  };

  const clearMajorInput = () => {
    setFormData((prev) => ({ ...prev, major: "" }));

    // When clearing input, only show selected majors
    setMajorSuggestions(formData.selectedMajors);

    if (majorInputRef.current) {
      majorInputRef.current.focus();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What is your current education level?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {educationLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() =>
                      handleInputChange("educationLevel", level.value)
                    }
                    className={`
                      px-4 py-3 rounded-lg border-2 text-left
                      ${
                        formData.educationLevel === level.value
                          ? "border-purple-600 bg-purple-50 text-purple-700"
                          : "border-gray-200 hover:border-purple-200 text-gray-700"
                      }
                    `}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                What are your majors?{" "}
                <span className="text-gray-400">(optional)</span>
              </label>

              <div className="relative">
                {/* Suggestions shown above input - only when typing or with selections */}
                {majorSuggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="w-full mb-2 overflow-hidden suggestions-dropdown"
                  >
                    <div className="flex flex-wrap gap-1.5 p-1">
                      {majorSuggestions.map((major, index) => {
                        const isSelected =
                          formData.selectedMajors.includes(major);
                        return (
                          <button
                            key={index}
                            onClick={() => handleSelectMajor(major)}
                            className={`
                              px-3 py-1.5 rounded-full text-sm font-medium transition-colors suggestion-item
                              ${
                                isSelected
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-100 hover:bg-purple-50 text-gray-700 hover:text-purple-700"
                              }
                            `}
                            style={{ "--index": index } as React.CSSProperties}
                          >
                            {major}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Input field */}
                <div className="relative flex items-center">
                  <input
                    ref={majorInputRef}
                    type="text"
                    value={formData.major}
                    onChange={(e) => handleInputChange("major", e.target.value)}
                    placeholder="Search for majors..."
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
                  />
                  <div className="absolute right-3 flex space-x-1">
                    {formData.major && (
                      <button
                        onClick={clearMajorInput}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Expected graduation year
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <button
                      key={year}
                      onClick={() =>
                        handleInputChange("graduationYear", year.toString())
                      }
                      className={`
                        px-4 py-3 rounded-lg border-2 text-center
                        ${
                          formData.graduationYear === year.toString()
                            ? "border-purple-600 bg-purple-50 text-purple-700"
                            : "border-gray-200 hover:border-purple-200 text-gray-700"
                        }
                      `}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                What are your career goals?
              </label>
              <textarea
                value={formData.careerGoals}
                onChange={(e) =>
                  handleInputChange("careerGoals", e.target.value)
                }
                placeholder="Describe your career aspirations..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 h-32 resize-none"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-800 mb-3">
                Do you have a resume?
              </label>
              <p className="text-gray-600 mb-6">
                You can upload your existing resume, or skip if you don't have
                one yet. We'll help you build or improve your resume either way!
              </p>

              <div className="flex flex-col space-y-4">
                <label
                  htmlFor="resume-upload"
                  className={`
                    flex flex-col items-center justify-center p-6 border-2 border-dashed 
                    rounded-lg cursor-pointer transition-colors
                    ${
                      formData.resumeFile
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/50"
                    }
                    ${isUploading ? "opacity-70 pointer-events-none" : ""}
                  `}
                >
                  <div className="flex flex-col items-center space-y-2">
                    {isUploading ? (
                      <>
                        <div className="p-3 rounded-full bg-purple-100">
                          <div className="animate-spin h-6 w-6 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                        </div>
                        <span className="text-purple-700 font-medium">
                          Processing your resume...
                        </span>
                      </>
                    ) : formData.resumeFile ? (
                      <>
                        <div className="p-3 rounded-full bg-green-100">
                          <FileCheck size={24} className="text-green-600" />
                        </div>
                        <span className="text-green-700 font-medium">
                          Resume uploaded successfully!
                        </span>
                        <span className="text-sm text-gray-500">
                          {formData.resumeFile.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="p-3 rounded-full bg-purple-100">
                          <Upload size={24} className="text-purple-600" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          Click to upload your resume
                        </span>
                        <span className="text-sm text-gray-500">
                          PDF, Word, TXT, or HTML (max 5MB)
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.html"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>

                {uploadError && (
                  <div className="text-red-500 flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                    <AlertCircle size={16} />
                    <span>{uploadError}</span>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={handleSkipResume}
                    className="text-gray-500 hover:text-purple-600 font-medium"
                    disabled={isUploading}
                  >
                    I don't have a resume yet
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <GraduationCap className="text-purple-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Student Onboarding
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 text-lg">
            Help us understand your needs better to provide personalized resume
            guidance
          </p>
        </div>

        <div className="mb-8">
          <div className="h-1 bg-gray-100 rounded-full">
            <div
              className="h-1 bg-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">
            Step {step} of {totalSteps}
          </div>
        </div>

        <div className="mb-8">{renderStep()}</div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
              step === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            disabled={step === 1}
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {step === totalSteps ? "Get Started" : "Next"}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
