"use client";

import { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Upload,
} from "lucide-react";

interface OnBoardPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  educationLevel: string;
  major: string;
  graduationYear: string;
  careerGoals: string;
  hasResume: boolean;
  resumeFile: File | null;
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
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    educationLevel: "",
    major: "",
    graduationYear: "",
    careerGoals: "",
    hasResume: false,
    resumeFile: null,
  });

  if (!isOpen) return null;

  const totalSteps = 3;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      console.log("Form submitted:", formData);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        resumeFile: e.target.files![0],
        hasResume: true,
      }));
    }
  };

  const handleSkipResume = () => {
    setFormData((prev) => ({ ...prev, hasResume: false, resumeFile: null }));
    handleNext();
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
                What is your major?
              </label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => handleInputChange("major", e.target.value)}
                placeholder="e.g., Computer Science"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
              />
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
                  `}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 rounded-full bg-purple-100">
                      <Upload size={24} className="text-purple-600" />
                    </div>

                    {formData.resumeFile ? (
                      <>
                        <span className="text-purple-700 font-medium">
                          Resume uploaded successfully!
                        </span>
                        <span className="text-sm text-gray-500">
                          {formData.resumeFile.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-700 font-medium">
                          Click to upload your resume
                        </span>
                        <span className="text-sm text-gray-500">
                          PDF, Word, or other document formats (max 5MB)
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                <div className="text-center">
                  <button
                    onClick={handleSkipResume}
                    className="text-gray-500 hover:text-purple-600 font-medium"
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-12 relative animate-zoom-in">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
            <GraduationCap size={32} className="text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tell Us About Yourself
          </h2>
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
