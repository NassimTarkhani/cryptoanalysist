"use client"

import { MessageItem } from "./message-item"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string  // Add timestamp
  conversationId: string  // Add conversationId
}

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null> // Updated type to allow null
}

export function MessageList({
  messages,
  isLoading,
  messagesEndRef,
}: MessageListProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="flex items-center space-x-2 self-start rounded-lg glass-morphism p-3 border-[#2D5BFF]">
          <div className="flex space-x-1">
            <div className="h-2 w-2 rounded-full bg-[#2D5BFF] animate-[bounce_0.7s_infinite_0.1s]"></div>
            <div className="h-2 w-2 rounded-full bg-[#2D5BFF] animate-[bounce_0.7s_infinite_0.2s]"></div>
            <div className="h-2 w-2 rounded-full bg-[#2D5BFF] animate-[bounce_0.7s_infinite_0.3s]"></div>
          </div>
          <span className="text-sm text-gray-300">AI is analyzing crypto data...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
