import { FC } from "react";
import { FileText, Info, MessageSquare } from "lucide-react";

interface ResumeIndicatorProps {
  isVisible: boolean;
  onRequestFeedback?: () => void;
}

const ResumeIndicator: FC<ResumeIndicatorProps> = ({
  isVisible,
  onRequestFeedback,
}) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-between gap-2 text-sm bg-green-50 text-green-700 py-2 px-4 border-b border-green-100">
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-green-600" />
        <span className="font-medium">Resume data being used</span>
        <div className="relative ml-1 group">
          <Info size={14} className="text-green-500 cursor-help" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white shadow-lg rounded-lg text-gray-700 text-xs font-normal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            Your resume data is helping the AI provide personalized responses.
            Click "Get Resume Feedback" for a concise analysis with a summary of
            key suggested improvements.
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
          </div>
        </div>
      </div>
      {onRequestFeedback && (
        <button
          onClick={onRequestFeedback}
          className="flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full transition-colors"
        >
          <MessageSquare size={12} />
          Get Resume Feedback
        </button>
      )}
    </div>
  );
};

export default ResumeIndicator;
