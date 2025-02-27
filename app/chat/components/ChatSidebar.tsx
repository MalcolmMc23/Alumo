import { Plus } from "lucide-react";
import { FC } from "react";

interface Chat {
  id: string;
  title: string;
  messages: {
    id: string;
    content: string;
    role: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeConversationId: string | null;
  isLoadingChats: boolean;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
}

const ChatSidebar: FC<ChatSidebarProps> = ({
  chats,
  activeConversationId,
  isLoadingChats,
  onNewChat,
  onSelectChat,
}) => {
  const renderChatList = () => {
    if (isLoadingChats) {
      return (
        <div className="p-4 text-center text-gray-500">
          Loading conversations...
        </div>
      );
    }

    if (chats.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No conversations yet
        </div>
      );
    }

    return chats.map((chat) => (
      <div
        key={chat.id}
        className={`p-3 hover:bg-gray-100 rounded-lg cursor-pointer ${
          activeConversationId === chat.id ? "bg-gray-100" : ""
        }`}
        onClick={() => onSelectChat(chat.id)}
      >
        <h3 className="font-medium truncate">
          {chat.title || "New Conversation"}
        </h3>
        <p className="text-sm text-gray-500 truncate">
          {chat.messages[0]?.content || "No messages"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(chat.updatedAt).toLocaleDateString()}
        </p>
      </div>
    ));
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-purple-600">AI Chat</h1>
      </div>
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">{renderChatList()}</div>
    </div>
  );
};

export default ChatSidebar;
