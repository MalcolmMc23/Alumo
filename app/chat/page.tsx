"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  User,
  Bot,
  Home,
  Plus,
  Bell,
  Upload,
  Paperclip,
} from "lucide-react";
import Link from "next/link";
import ProfilePopup from "@/components/ProfilePopup";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  // Fetch chats from the database
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoadingChats(true);
        const response = await fetch("/api/chat");

        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }

        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoadingChats(false);
      }
    };

    fetchChats();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
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
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove file upload handling
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // First, get response from AI
      const aiResponse = await fetch("/api/chat/openrouter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          history: chatHistory,
        }),
      });

      if (!aiResponse.ok) {
        throw new Error("AI API request failed");
      }

      const aiData = await aiResponse.json();
      setChatHistory(aiData.history || []);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiData.message || "No response from API",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);

      // Then, store the conversation and messages in the database
      try {
        const messagesToSave = [
          { content: userMessage.text, role: "user" },
          { content: botMessage.text, role: "assistant" },
        ];

        if (activeConversationId) {
          // Update existing conversation
          const updateResponse = await fetch(
            `/api/chat/${activeConversationId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages: messagesToSave,
              }),
            }
          );

          if (!updateResponse.ok) {
            console.error("Failed to update conversation in database");
          } else {
            console.log("Conversation updated in database successfully");

            // Refresh the chat list
            const chatsResponse = await fetch("/api/chat");
            if (chatsResponse.ok) {
              const updatedChats = await chatsResponse.json();
              setChats(updatedChats);
            }
          }
        } else {
          // Create new conversation
          const createResponse = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: messagesToSave,
            }),
          });

          if (!createResponse.ok) {
            console.error("Failed to store conversation in database");
          } else {
            const newConversation = await createResponse.json();
            console.log(
              "New conversation stored in database successfully",
              newConversation
            );

            // Update the active conversation ID
            setActiveConversationId(newConversation.id);

            // Refresh the chat list
            const chatsResponse = await fetch("/api/chat");
            if (chatsResponse.ok) {
              const updatedChats = await chatsResponse.json();
              setChats(updatedChats);
            }
          }
        }
      } catch (dbError) {
        console.error("Error storing conversation in database:", dbError);
      }
    } catch (error) {
      console.error("Error calling API:", error);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Error communicating with AI service.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setChatHistory([]);
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setChats([newChat]);
  };

  const loadConversation = async (chatId: string) => {
    try {
      setIsLoading(true);
      setActiveConversationId(chatId);

      // Fetch the full conversation with all messages from the server
      const response = await fetch(`/api/chat/${chatId}`);

      if (!response.ok) {
        throw new Error("Failed to load conversation");
      }

      const conversation = await response.json();

      if (
        conversation &&
        conversation.messages &&
        conversation.messages.length > 0
      ) {
        // Convert the database messages to the format our UI expects
        const uiMessages: Message[] = conversation.messages.map((msg: any) => ({
          id: msg.id.toString(),
          text: msg.content,
          sender: msg.role === "user" ? "user" : "bot",
        }));

        setMessages(uiMessages);

        // Also update chat history for the AI
        const aiChatHistory: ChatMessage[] = conversation.messages.map(
          (msg: any) => ({
            role: msg.role as "user" | "assistant" | "system",
            content: msg.content,
          })
        );

        setChatHistory(aiChatHistory);
      } else {
        // Empty conversation or no messages
        setMessages([]);
        setChatHistory([]);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      // Reset UI in case of error
      setMessages([]);
      setChatHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

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
        onClick={() => loadConversation(chat.id)}
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

  const handleNewChat = () => {
    setMessages([]);
    setChatHistory([]);
    setActiveConversationId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50" onDragEnter={handleDragEnter}>
      <ProfilePopup
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

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
          className="fixed inset-0 bg-purple-600/20 z-50 backdrop-blur-sm"
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
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={20} />
              New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">{renderChatList()}</div>
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
                <Bell
                  size={22}
                  className="text-gray-600 hover:text-purple-600"
                />
              </button>
              <button
                className="p-3 hover:bg-purple-50 rounded-full transition-colors"
                onClick={() => setIsProfileOpen(true)}
              >
                <User
                  size={22}
                  className="text-gray-600 hover:text-purple-600"
                />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center px-4">
                <div className="text-center space-y-3 mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Welcome to AI Chat
                  </h2>
                  <p className="text-gray-600">
                    Start a conversation by typing a message below or drop a
                    file anywhere.
                  </p>
                </div>
                {/* Centered oval input for empty state */}
                <div className="w-full max-w-2xl">
                  <form onSubmit={handleSendMessage} className="relative">
                    <button
                      type="button"
                      onClick={handleAttachmentClick}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Paperclip
                        size={18}
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      />
                    </button>
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
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
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-24">
                {messages.map((message, index) => (
                  <div
                    key={`${message.id}-${index}`}
                    className={`
                      px-4 py-2
                      ${message.sender === "bot" ? "bg-gray-50" : ""}
                    `}
                  >
                    <div
                      className={`max-w-3xl mx-auto flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      } gap-4`}
                    >
                      {message.sender === "bot" && (
                        <div className="flex-shrink-0 w-8 h-8 mt-1">
                          <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`${
                          message.sender === "user"
                            ? "flex-shrink-0 max-w-[80%] ml-auto"
                            : "flex-1 max-w-[80%]"
                        } space-y-1`}
                      >
                        <p
                          className={`font-medium text-xs ${
                            message.sender === "user"
                              ? "text-right text-gray-600"
                              : "text-gray-600"
                          }`}
                        >
                          {message.sender === "user" ? "You" : "Assistant"}
                        </p>
                        <div
                          className={`prose prose-purple w-auto inline-block ${
                            message.sender === "user"
                              ? "bg-purple-600 text-white float-right rounded-2xl rounded-tr-none shadow-sm chat-bubble-user px-3 py-2"
                              : "text-gray-800 rounded-none chat-bubble-bot pl-0 pt-2"
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                      {message.sender === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 mt-1">
                          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
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
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Fixed Input Area when chat has messages */}
          {messages.length > 0 && (
            <div className="fixed bottom-5 left-64 right-0 p-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pb-4 pt-10">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSendMessage} className="relative">
                  <button
                    type="button"
                    onClick={handleAttachmentClick}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Paperclip
                      size={18}
                      className="text-gray-400 hover:text-purple-600 transition-colors"
                    />
                  </button>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="w-full pl-14 pr-16 py-4 bg-white rounded-full shadow-lg hover:shadow-xl focus:ring-2 focus:ring-purple-100 focus:outline-none text-gray-900 placeholder:text-gray-400 border border-gray-100 focus:border-purple-300 transition-all"
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
