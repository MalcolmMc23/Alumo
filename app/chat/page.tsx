"use client";

import { useState, useRef, useEffect } from "react";
import ProfilePopup from "@/components/ProfilePopup";
import { Chat, ChatMessage, Message } from "./types";
import ChatSidebar from "./components/ChatSidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessageComponent from "./components/ChatMessage";
import LoadingIndicator from "./components/LoadingIndicator";
import MessageInput from "./components/MessageInput";
import WelcomeScreen from "./components/WelcomeScreen";
import DragDropOverlay from "./components/DragDropOverlay";

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
    // File upload handling removed
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
      <DragDropOverlay
        isDragging={isDragging}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      <div className="flex h-screen">
        {/* Chat History Sidebar */}
        <ChatSidebar
          chats={chats}
          activeConversationId={activeConversationId}
          isLoadingChats={isLoadingChats}
          onNewChat={handleNewChat}
          onSelectChat={loadConversation}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <ChatHeader onProfileClick={() => setIsProfileOpen(true)} />

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <WelcomeScreen
                inputMessage={inputMessage}
                isLoading={isLoading}
                onInputChange={setInputMessage}
                onSendMessage={handleSendMessage}
                onAttachmentClick={handleAttachmentClick}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <div className="space-y-6 pb-24">
                {messages.map((message, index) => (
                  <ChatMessageComponent
                    key={`${message.id}-${index}`}
                    message={message}
                  />
                ))}
                {isLoading && <LoadingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Fixed Input Area when chat has messages */}
          {messages.length > 0 && (
            <div className="fixed bottom-5 left-64 right-0 p-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pb-4 pt-10">
              <div className="max-w-3xl mx-auto">
                <MessageInput
                  inputMessage={inputMessage}
                  isLoading={isLoading}
                  onInputChange={setInputMessage}
                  onSendMessage={handleSendMessage}
                  onAttachmentClick={handleAttachmentClick}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
