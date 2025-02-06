'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Home, Plus, Bell, Upload, Paperclip } from 'lucide-react';
import Link from 'next/link';
import ProfilePopup from '@/components/ProfilePopup';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface Chat {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      title: "Website Development",
      lastMessage: "How do I optimize my React components?",
      timestamp: "2 days ago"
    },
    {
      id: 2,
      title: "Database Design",
      lastMessage: "What's the best way to structure my tables?",
      timestamp: "1 week ago"
    },
    {
      id: 3,
      title: "API Integration",
      lastMessage: "How can I handle authentication?",
      timestamp: "2 weeks ago"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      console.log('File path:', file.name);
      console.log('File type:', file.type);
      console.log('File size:', file.size);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      console.log('File path:', file.name);
      console.log('File type:', file.type);
      console.log('File size:', file.size);
    });
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: 'This is a mock response. Integrate your AI service here. The response can be much longer to demonstrate how the chat interface handles multiple lines of text in a single message.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    const newChat: Chat = {
      id: Date.now(),
      title: "New Chat",
      lastMessage: "",
      timestamp: "Just now"
    };
    setChats([newChat, ...chats]);
  };

  return (
    <div 
      className="min-h-screen bg-gray-50"
      onDragEnter={handleDragEnter}
    >
      <ProfilePopup isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple
      />
      
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div
          className="fixed inset-0 bg-purple-600/90 z-50 backdrop-blur-sm"
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="h-full flex flex-col items-center justify-center text-white">
            <div className="p-6 bg-white/10 rounded-full mb-6 backdrop-blur-md">
              <Upload size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Drop your file here</h2>
            <p className="text-white/80">We'll analyze it for you</p>
          </div>
        </div>
      )}

      <div className="flex h-screen">
        {/* Chat History Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="h-20 flex items-center px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-purple-600">AI Chat</h1>
          </div>
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={20} />
              New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors"
              >
                <h3 className="font-medium text-gray-900 truncate">{chat.title}</h3>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
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
                onClick={() => setIsProfileOpen(true)}
              >
                <User size={22} className="text-gray-600 hover:text-purple-600" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center px-4">
                <div className="text-center space-y-3 mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800">Welcome to AI Chat</h2>
                  <p className="text-gray-600">Start a conversation by typing a message below or drop a file anywhere.</p>
                </div>
                {/* Centered oval input for empty state */}
                <div className="w-full max-w-2xl">
                  <form onSubmit={handleSendMessage} className="relative">
                    <button
                      type="button"
                      onClick={handleAttachmentClick}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Paperclip size={18} className="text-gray-400 hover:text-purple-600 transition-colors" />
                    </button>
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="w-full pl-14 pr-16 py-4 bg-white rounded-full border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none text-gray-900 placeholder:text-gray-400 shadow-sm"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className={`
                        absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full
                        ${inputMessage.trim() && !isLoading
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                        transition-colors
                      `}
                    >
                      <Send size={18} className="transform translate-x-[1px]" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-24">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`
                      px-4 py-6
                      ${message.sender === 'bot' ? 'bg-gray-50' : 'bg-white'}
                    `}
                  >
                    <div className="max-w-3xl mx-auto flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8">
                        {message.sender === 'user' ? (
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-purple-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="font-medium text-sm text-gray-600">
                          {message.sender === 'user' ? 'You' : 'Assistant'}
                        </p>
                        <div className="prose prose-purple max-w-none">
                          {message.text}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="px-4 py-6 bg-gray-50">
                    <div className="max-w-3xl mx-auto flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 w-8 bg-gray-200 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Fixed Input Area when chat has messages */}
          {messages.length > 0 && (
            <div className="fixed bottom-0 left-64 right-0 p-6">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSendMessage} className="relative">
                  <button
                    type="button"
                    onClick={handleAttachmentClick}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Paperclip size={18} className="text-gray-400 hover:text-purple-600 transition-colors" />
                  </button>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="w-full pl-14 pr-16 py-4 bg-white rounded-full shadow-lg focus:ring-2 focus:ring-purple-100 focus:outline-none text-gray-900 placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className={`
                      absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full
                      ${inputMessage.trim() && !isLoading
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                      transition-colors
                    `}
                  >
                    <Send size={18} className="transform translate-x-[1px]" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}