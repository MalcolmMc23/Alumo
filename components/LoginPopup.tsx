'use client';

import { useState } from 'react';
<<<<<<< HEAD
import { X } from 'lucide-react';
=======
import { X, ChevronRight, ChevronLeft, GraduationCap } from 'lucide-react';
>>>>>>> 4a4b4ff (test)

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

<<<<<<< HEAD
export default function LoginPopup({ isOpen, onClose }: LoginPopupProps) {
  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    console.log("hello world");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 relative animate-zoom-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue to the chat</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg border border-gray-300 hover:border-gray-400 transition-all shadow-sm"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
=======
interface FormData {
  educationLevel: string;
  major: string;
  graduationYear: string;
  careerGoals: string;
  resumeExperience: string;
  specificHelp: string;
}

const educationLevels = [
  { value: 'freshman', label: 'Freshman' },
  { value: 'sophomore', label: 'Sophomore' },
  { value: 'junior', label: 'Junior' },
  { value: 'senior', label: 'Senior' },
  { value: 'graduate', label: 'Graduate Student' }
];

const experienceLevels = [
  { value: 'none', label: 'No Experience' },
  { value: 'some', label: 'Some Experience' },
  { value: 'experienced', label: 'Experienced' }
];

export default function LoginPopup({ isOpen, onClose }: LoginPopupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    educationLevel: '',
    major: '',
    graduationYear: '',
    careerGoals: '',
    resumeExperience: '',
    specificHelp: '',
  });

  if (!isOpen) return null;

  const totalSteps = 4;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      console.log('Form submitted:', formData);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
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
                    onClick={() => handleInputChange('educationLevel', level.value)}
                    className={`
                      px-4 py-3 rounded-lg border-2 text-left
                      ${formData.educationLevel === level.value
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-200 text-gray-700'}
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
                onChange={(e) => handleInputChange('major', e.target.value)}
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
                      onClick={() => handleInputChange('graduationYear', year.toString())}
                      className={`
                        px-4 py-3 rounded-lg border-2 text-center
                        ${formData.graduationYear === year.toString()
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-200 text-gray-700'}
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
                onChange={(e) => handleInputChange('careerGoals', e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Do you have previous experience writing resumes?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {experienceLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleInputChange('resumeExperience', level.value)}
                    className={`
                      px-4 py-3 rounded-lg border-2 text-center
                      ${formData.resumeExperience === level.value
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-200 text-gray-700'}
                    `}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                What specific help are you looking for with your resume?
              </label>
              <textarea
                value={formData.specificHelp}
                onChange={(e) => handleInputChange('specificHelp', e.target.value)}
                placeholder="e.g., Highlighting academic achievements, formatting, industry-specific tips..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 h-32 resize-none"
              />
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tell Us About Yourself</h2>
          <p className="text-gray-600 text-lg">
            Help us understand your needs better to provide personalized resume guidance
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

        <div className="mb-8">
          {renderStep()}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
              step === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
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
            {step === totalSteps ? 'Get Started' : 'Next'}
            <ChevronRight size={20} />
          </button>
        </div>
>>>>>>> 4a4b4ff (test)
      </div>
    </div>
  );
}