import { Home, Bell, User } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

interface ChatHeaderProps {
  onProfileClick: () => void;
}

const ChatHeader: FC<ChatHeaderProps> = ({ onProfileClick }) => {
  return (
    <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <Link
        href="/"
        className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
        title="Back to Dashboard"
      >
        <Home size={22} className="text-gray-600" />
      </Link>
      <div className="flex items-center space-x-5">
        <button className="p-3 hover:bg-purple-50 rounded-full transition-colors">
          <Bell size={22} className="text-gray-600 hover:text-purple-600" />
        </button>
        <button
          className="p-3 hover:bg-purple-50 rounded-full transition-colors"
          onClick={onProfileClick}
        >
          <User size={22} className="text-gray-600 hover:text-purple-600" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
