import React, { useState, useRef, useEffect } from "react";
import { SendHorizontal, SmilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { BotbaeAvatar, Avatar } from "@/components/chat/Avatar";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface BotbaeConfig {
  name: string;
  avatar_url?: string | null;
  gender?: string;
  ethnicity?: string;
  hair_color?: string | null;
  hair_type?: string;
  profession?: string | null;
  style?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  streamingMessage: string;
  setStreamingMessage: React.Dispatch<React.SetStateAction<string>>;
  botName: string;
  botbaeConfig?: BotbaeConfig;
  handleSendMessage: (message: string) => void;
}

export function ChatInterface({
  messages,
  setMessages,
  streamingMessage,
  setStreamingMessage,
  botName,
  botbaeConfig,
  handleSendMessage,
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  const onSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      handleSendMessage(newMessage);
      setNewMessage("");
    }
  };

  // Determine appropriate mood for bot avatar based on message content
  const getBotMood = (messageText: string) => {
    if (!messageText) return "neutral";
    
    const text = messageText.toLowerCase();
    if (text.includes("!") || text.includes("exciting") || text.includes("amazing")) return "excited";
    if (text.includes("?") || text.includes("think") || text.includes("consider")) return "thinking";
    if (text.includes("happy") || text.includes("great") || text.includes("wonderful")) return "happy";
    return "friendly";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.sender === "user" 
                ? "justify-end" 
                : "justify-start"
            )}
          >
            {message.sender === "bot" && (
              <div className="flex-shrink-0">
                {botbaeConfig ? (
                  <BotbaeAvatar
                    botbae={{
                      name: botbaeConfig.name,
                      avatar_url: botbaeConfig.avatar_url,
                      gender: botbaeConfig.gender,
                      ethnicity: botbaeConfig.ethnicity,
                    }}
                    mood={getBotMood(message.text)}
                    size="md"
                    className="shadow-md"
                  />
                ) : (
                  <Avatar
                    name={botName}
                    size="md"
                    className="shadow-md"
                  />
                )}
              </div>
            )}
            
            <div className={cn(
              "max-w-[70%] space-y-1",
              message.sender === "user" 
                ? "bg-botbae-accent text-white rounded-2xl rounded-br-sm px-4 py-3" 
                : "bg-muted rounded-2xl rounded-bl-sm px-4 py-3"
            )}>
              {message.sender === "bot" && (
                <p className="text-xs font-medium text-botbae-accent">
                  {botName}
                </p>
              )}
              <p className={cn(
                "text-sm leading-relaxed",
                message.sender === "user" ? "text-white" : "text-foreground"
              )}>
                {message.text}
              </p>
              <p className={cn(
                "text-xs opacity-70",
                message.sender === "user" ? "text-white/70" : "text-muted-foreground"
              )}>
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            
            {message.sender === "user" && (
              <div className="flex-shrink-0">
                <Avatar
                  name="You"
                  size="md"
                  className="bg-botbae-accent/20 border-2 border-botbae-accent shadow-md"
                />
              </div>
            )}
          </div>
        ))}

        {/* Streaming message */}
        {streamingMessage && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              {botbaeConfig ? (
                <BotbaeAvatar
                  botbae={{
                    name: botbaeConfig.name,
                    avatar_url: botbaeConfig.avatar_url,
                    gender: botbaeConfig.gender,
                    ethnicity: botbaeConfig.ethnicity,
                  }}
                  mood="thinking"
                  size="md"
                  className="shadow-md"
                />
              ) : (
                <Avatar
                  name={botName}
                  size="md"
                  className="shadow-md"
                />
              )}
            </div>
            
            <div className="max-w-[70%] bg-muted rounded-2xl rounded-bl-sm px-4 py-3 space-y-1">
              <p className="text-xs font-medium text-botbae-accent">
                {botName}
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                {streamingMessage}
                <span className="inline-block w-1 h-4 bg-botbae-accent animate-pulse ml-1" />
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form
        onSubmit={onSendMessage}
        className="border-t border-muted p-4 bg-card"
      >
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${botName}...`}
            className="botbae-input min-h-12 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage(e);
              }
            }}
            rows={1}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim()}
            className="botbae-button"
          >
            <SendHorizontal size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
}
