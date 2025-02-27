import { Send, Paperclip } from "lucide-react";
import { FC, FormEvent, KeyboardEvent, useRef, useEffect } from "react";

interface MessageInputProps {
  inputMessage: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: (e: FormEvent) => void;
  onAttachmentClick: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

const MessageInput: FC<MessageInputProps> = ({
  inputMessage,
  isLoading,
  onInputChange,
  onSendMessage,
  onAttachmentClick,
  onKeyDown,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on component mount
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={onSendMessage} className={`relative ${className}`}>
      <button
        type="button"
        onClick={onAttachmentClick}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
      >
        <Paperclip
          size={18}
          className="text-gray-400 hover:text-purple-600 transition-colors"
        />
      </button>
      <input
        ref={inputRef}
        type="text"
        value={inputMessage}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type your message..."
        className="w-full pl-14 pr-16 py-4 bg-white rounded-full border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none text-gray-900 placeholder:text-gray-400 shadow-sm hover:shadow transition-all"
      />
      <button
        type="submit"
        disabled={!inputMessage.trim() || isLoading}
        className={`
          absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full
          ${
            inputMessage.trim() && !isLoading
              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transform transition-all hover:scale-105"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }
          transition-all
        `}
      >
        <Send
          size={18}
          className="transform translate-x-[-1px] translate-y-[1px]"
        />
      </button>
    </form>
  );
};

export default MessageInput;
