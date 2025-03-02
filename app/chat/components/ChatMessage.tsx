import { User, Bot } from "lucide-react";
import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
            className={`w-auto inline-block ${
              isUser
                ? "bg-purple-600 text-white float-right rounded-2xl rounded-tr-none shadow-sm chat-bubble-user px-3 py-2"
                : "text-gray-800 rounded-2xl rounded-tl-none shadow-sm chat-bubble-bot px-3 py-2"
            }`}
          >
            {isUser ? (
              <div className="prose prose-invert max-w-none">
                {message.text}
              </div>
            ) : (
              <div className="prose prose-headings:font-semibold prose-headings:text-gray-800 prose-h1:text-lg prose-h2:text-base prose-h3:text-base prose-h4:text-sm prose-h5:text-sm prose-h6:text-sm prose-a:text-purple-600 prose-p:text-gray-800 prose-p:leading-relaxed prose-blockquote:text-gray-700 prose-figure:my-0 prose-figcaption:text-gray-500 prose-strong:text-gray-900 prose-strong:font-semibold prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-100 prose-ol:pl-5 prose-ul:pl-5 prose-li:marker:text-gray-500 max-w-none markdown-message">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.text}
                </ReactMarkdown>
              </div>
            )}
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
