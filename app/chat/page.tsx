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
import ResumeIndicator from "./components/ResumeIndicator";

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
  const [hasResume, setHasResume] = useState(false);

  // Fetch chats from the database
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoadingChats(true);
        const response = await fetch("/api/chat?page=1&limit=20");

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

  // Fetch user profile to check for resume
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user");

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const userData = await response.json();
        setHasResume(!!userData.hasResume);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
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
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    // Check if file is a resume (PDF, DOC, DOCX, TXT, HTML)
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/html",
      "application/html",
    ];

    if (!validTypes.includes(file.type)) {
      // Add user message about the file upload attempt
      const userMessage: Message = {
        id: Date.now().toString(),
        text: `I've uploaded a file: ${file.name}`,
        sender: "user",
      };

      setMessages((prev) => [...prev, userMessage]);

      // Add AI error message about unsupported file type
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'm sorry, but I can't process this file type. Please upload a resume in one of the following formats: PDF, DOC, DOCX, TXT, or HTML. These formats allow me to properly analyze your resume and provide helpful feedback.`,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);

      // Store conversation in database
      const messagesToSave = [
        { content: `I've uploaded a file: ${file.name}`, role: "user" },
        { content: botMessage.text, role: "assistant" },
      ];

      if (activeConversationId) {
        // Update existing conversation
        fetch(`/api/chat/${activeConversationId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messagesToSave,
          }),
        })
          .then((response) => {
            if (response.ok) {
              console.log("Conversation updated with file type error");
              // Refresh chat list
              return fetch("/api/chat");
            }
          })
          .then((response) => {
            if (response && response.ok) {
              return response.json();
            }
          })
          .then((data) => {
            if (data) setChats(data);
          })
          .catch((error) => {
            console.error("Error updating conversation:", error);
          });
      } else {
        // Create new conversation
        fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messagesToSave,
          }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
          })
          .then((newConversation) => {
            if (newConversation) {
              console.log(
                "New conversation created with file type error",
                newConversation
              );
              setActiveConversationId(newConversation.id);
              // Refresh chat list
              return fetch("/api/chat");
            }
          })
          .then((response) => {
            if (response && response.ok) {
              return response.json();
            }
          })
          .then((data) => {
            if (data) setChats(data);
          })
          .catch((error) => {
            console.error("Error creating conversation:", error);
          });
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", file);

    // Set loading state
    setIsLoading(true);

    // Upload resume
    fetch("/api/chat/resume", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Add user message about the resume
          const userMessage: Message = {
            id: Date.now().toString(),
            text: `I've uploaded my resume: ${file.name}`,
            sender: "user",
          };

          setMessages((prev) => [...prev, userMessage]);

          // Now send the resume text to the AI
          return fetch("/api/chat/openrouter", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `I've uploaded my resume. Here's the content: ${data.resumeText}. Please analyze it and provide feedback or suggestions.`,
              history: chatHistory,
            }),
          });
        } else {
          throw new Error(data.error || "Failed to process resume");
        }
      })
      .then((response) => response.json())
      .then((aiData) => {
        setChatHistory(aiData.history || []);

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text:
            aiData.message ||
            "I couldn't analyze the resume properly. Please try again or upload a different file format.",
          sender: "bot",
        };

        setMessages((prev) => [...prev, botMessage]);

        // Store conversation in database if necessary
        const messagesToSave = [
          { content: `I've uploaded my resume: ${file.name}`, role: "user" },
          { content: botMessage.text, role: "assistant" },
        ];

        if (activeConversationId) {
          // Update existing conversation
          fetch(`/api/chat/${activeConversationId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: messagesToSave,
            }),
          })
            .then((response) => {
              if (response.ok) {
                console.log("Conversation updated with resume analysis");
                // Refresh chat list
                return fetch("/api/chat");
              }
            })
            .then((response) => {
              if (response && response.ok) {
                return response.json();
              }
            })
            .then((data) => {
              if (data) setChats(data);
            })
            .catch((error) => {
              console.error("Error updating conversation:", error);
            });
        } else {
          // Create new conversation
          fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: messagesToSave,
            }),
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
            })
            .then((newConversation) => {
              if (newConversation) {
                console.log(
                  "New conversation created with resume analysis",
                  newConversation
                );
                setActiveConversationId(newConversation.id);
                // Refresh chat list
                return fetch("/api/chat");
              }
            })
            .then((response) => {
              if (response && response.ok) {
                return response.json();
              }
            })
            .then((data) => {
              if (data) setChats(data);
            })
            .catch((error) => {
              console.error("Error creating conversation:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error processing resume:", error);

        // Add error message from AI
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `I encountered an error while processing your resume: ${error.message}. Please try uploading a different file or format (PDF, DOC, DOCX, TXT, or HTML).`,
          sender: "bot",
        };

        setMessages((prev) => [...prev, botMessage]);

        // Store error message in conversation
        const messagesToSave = [
          { content: `I've uploaded my resume: ${file.name}`, role: "user" },
          { content: botMessage.text, role: "assistant" },
        ];

        if (activeConversationId) {
          fetch(`/api/chat/${activeConversationId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: messagesToSave,
            }),
          }).catch((err) =>
            console.error(
              "Error updating conversation with error message:",
              err
            )
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      });
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

      // Set isLoading to false before updating messages to prevent loading indicator from showing with response
      setIsLoading(false);
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
      // Set isLoading to false before updating messages for error case too
      setIsLoading(false);
      setMessages((prev) => [...prev, botMessage]);
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
      // Use loadAll=true to get all messages at once for the active conversation
      const response = await fetch(`/api/chat/${chatId}?loadAll=true`);

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

        // Force an immediate scroll to the bottom
        setTimeout(() => scrollToBottom(), 0);

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
    <div
      className="flex h-screen bg-gray-50"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ChatSidebar
        chats={chats}
        activeConversationId={activeConversationId}
        onSelectChat={loadConversation}
        onNewChat={handleNewChat}
        isLoadingChats={isLoadingChats}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.html"
      />
      <ProfilePopup
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <ChatHeader onProfileClick={() => setIsProfileOpen(true)} />
        <ResumeIndicator isVisible={hasResume} />

        <div
          className={`flex-1 overflow-y-auto p-4 sm:p-6 ${
            isDragging ? "bg-purple-50" : ""
          }`}
          onDragLeave={handleDragLeave}
        >
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
      </main>
      {isDragging && (
        <DragDropOverlay
          isDragging={isDragging}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      )}
    </div>
  );
}
