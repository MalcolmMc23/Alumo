export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

export interface Chat {
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