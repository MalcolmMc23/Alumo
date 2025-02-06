'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, GraduationCap } from 'lucide-react';

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

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    educationLevel: '',
    major: '',
    graduationYear: '',
    careerGoals: '',
    resumeExperience: '',
    specificHelp: '',
  });

  const totalSteps = 4;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      console.log('Form submitted:', formData);
      router.push('/');
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
          <div className="h-[280px]">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  What is your current education level?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {educationLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => handleInputChange('educationLevel', level.value)}
                      className={`
                        px-3 py-2 rounded-lg border-2 text-left transition-all duration-200
                        ${formData.educationLevel === level.value
                          ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                          : 'border-gray-200 hover:border-purple-200 text-gray-700 hover:bg-gray-50'}
                      `}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  What is your major?
                </label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  placeholder="e.g., Computer Science"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="h-[280px]">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Expected graduation year
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <button
                        key={year}
                        onClick={() => handleInputChange('graduationYear', year.toString())}
                        className={`
                          px-3 py-2 rounded-lg border-2 text-center transition-all duration-200
                          ${formData.graduationYear === year.toString()
                            ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                            : 'border-gray-200 hover:border-purple-200 text-gray-700 hover:bg-gray-50'}
                        `}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  What are your career goals?
                </label>
                <textarea
                  value={formData.careerGoals}
                  onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                  placeholder="Describe your career aspirations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 h-24 resize-none transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="h-[280px] flex items-center">
            <div className="w-full space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Do you have previous experience writing resumes?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {experienceLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleInputChange('resumeExperience', level.value)}
                    className={`
                      px-3 py-2 rounded-lg border-2 text-center transition-all duration-200
                      ${formData.resumeExperience === level.value
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                        : 'border-gray-200 hover:border-purple-200 text-gray-700 hover:bg-gray-50'}
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
          <div className="h-[280px]">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                What specific help are you looking for with your resume?
              </label>
              <textarea
                value={formData.specificHelp}
                onChange={(e) => handleInputChange('specificHelp', e.target.value)}
                placeholder="e.g., Highlighting academic achievements, formatting, industry-specific tips..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 h-48 resize-none transition-colors duration-200"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 mx-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
            <GraduationCap size={24} className="text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h2>
          <p className="text-gray-600">
            Help us understand your needs better
          </p>
        </div>

        <div className="mb-6">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-1 bg-purple-600 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">
            Step {step} of {totalSteps}
          </div>
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {renderStep()}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
              ${step === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'}
            `}
            disabled={step === 1}
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
          >
            {step === totalSteps ? 'Get Started' : 'Next'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}