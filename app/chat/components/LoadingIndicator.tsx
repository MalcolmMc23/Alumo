import { Bot } from "lucide-react";
import { FC } from "react";

const LoadingIndicator: FC = () => {
  return (
    <div className="px-4 py-2">
      <div className="max-w-3xl mx-auto flex justify-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 mt-1">
          <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="max-w-[80%]">
          <div className="text-gray-900 rounded-none pl-0 pt-2 inline-block chat-bubble-bot">
            <div className="flex space-x-2">
              <div
                className="h-3 w-3 bg-purple-300 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="h-3 w-3 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="h-3 w-3 bg-purple-700 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
