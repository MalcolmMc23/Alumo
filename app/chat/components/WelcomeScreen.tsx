import { FC, FormEvent } from "react";
import MessageInput from "./MessageInput";

interface WelcomeScreenProps {
  inputMessage: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: (e: FormEvent) => void;
  onAttachmentClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const WelcomeScreen: FC<WelcomeScreenProps> = ({
  inputMessage,
  isLoading,
  onInputChange,
  onSendMessage,
  onAttachmentClick,
  onKeyDown,
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome to AI Chat
        </h2>
        <p className="text-gray-600">
          Start a conversation by typing a message below or drop a file
          anywhere.
        </p>
      </div>
      {/* Centered oval input for empty state */}
      <div className="w-full max-w-2xl">
        <MessageInput
          inputMessage={inputMessage}
          isLoading={isLoading}
          onInputChange={onInputChange}
          onSendMessage={onSendMessage}
          onAttachmentClick={onAttachmentClick}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
};

export default WelcomeScreen;
