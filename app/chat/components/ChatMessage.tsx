import { User, Bot } from "lucide-react";
import { FC } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`px-4 py-2 ${isUser ? "" : "bg-gray-50"}`}>
      <div
        className={`max-w-3xl mx-auto flex ${
          isUser ? "justify-end" : "justify-start"
        } gap-4`}
      >
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 mt-1">
            <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
        <div
          className={`${
            isUser ? "flex-shrink-0 max-w-[80%] ml-auto" : "flex-1 max-w-[80%]"
          } space-y-1`}
        >
          <p
            className={`font-medium text-xs ${
              isUser ? "text-right text-gray-600" : "text-gray-600"
            }`}
          >
            {isUser ? "You" : "Assistant"}
          </p>
          <div
            className={`prose prose-purple w-auto inline-block ${
              isUser
                ? "bg-purple-600 text-white float-right rounded-2xl rounded-tr-none shadow-sm chat-bubble-user px-3 py-2"
                : "text-gray-800 rounded-none chat-bubble-bot pl-0 pt-2"
            }`}
          >
            {message.text}
          </div>
        </div>
        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 mt-1">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
