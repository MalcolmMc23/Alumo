import { FC } from "react";
import { FileText, Info } from "lucide-react";

interface ResumeIndicatorProps {
  isVisible: boolean;
}

const ResumeIndicator: FC<ResumeIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 py-2 px-4 border-b border-green-100">
      <FileText size={16} className="text-green-600" />
      <span className="font-medium">Resume data being used</span>
      <div className="relative ml-1 group">
        <Info size={14} className="text-green-500 cursor-help" />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white shadow-lg rounded-lg text-gray-700 text-xs font-normal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          Your resume data is helping the AI provide more personalized responses
          based on your background and qualifications.
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
        </div>
      </div>
    </div>
  );
};

export default ResumeIndicator;
