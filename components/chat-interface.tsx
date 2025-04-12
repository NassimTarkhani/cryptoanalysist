"use client"
import { useState, useEffect, useRef } from "react"
import { ChatHeader } from "./chat-header"
import { ChatInput } from "./chat-input"
import { MessageList } from "./message-list"
import { QuickSuggestions } from "./quick-suggestions"
import { MarketOverview } from "./market-overview"
import { Sidebar } from "./sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"

export type Message = {
  id: string;
  role: "user" | "assistant";  // role must be either "user" or "assistant"
  content: string;
  timestamp: string;
  conversationId: string;
};

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  userId: string | null;
}

const initialSuggestedQuestions = [
  "What's the current Bitcoin price prediction for next week?",
  "Explain the impact of ETH 2.0 on gas fees",
  "Compare the top 3 DeFi platforms by TVL",
  "What are the best crypto tax reporting tools?",
  "Analyze the correlation between Bitcoin and stock markets",
  "Explain Layer 2 scaling solutions for Ethereum",
]

export function ChatInterface() {
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState(initialSuggestedQuestions)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: `Conversation ${conversations.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: null,
      messages: [],
    }

    setConversations((prevConvs) => {
      const updatedConvs = [...prevConvs, newConversation]
      localStorage.setItem("conversations", JSON.stringify(updatedConvs))
      return updatedConvs
    })
    setCurrentConversation(newConversation.id)
    setShowWelcome(true)

    toast({
      title: "New Conversation",
      description: "A new conversation has been created.",
    })
  }

  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations")
    if (!savedConversations) {
      createNewConversation()
    } else {
      const parsedConversations: Conversation[] = JSON.parse(savedConversations)
      setConversations(parsedConversations)
      if (parsedConversations.length > 0 && !currentConversation) {
        setCurrentConversation(parsedConversations[0].id)
      }
    }
  }, []);  // Only runs once on initial mount

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("conversations", JSON.stringify(conversations))
    }
  }, [conversations]);  // Runs every time the conversations state changes

  const currentConversationData = conversations.find((conv) => conv.id === currentConversation)
  const currentMessages = currentConversationData ? currentConversationData.messages : []

  useEffect(() => {
    setShowWelcome(currentMessages.length === 0)
  }, [currentConversation, currentMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentMessages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentConversation) return;

    const messageId = uuidv4();
    const userMessage: Message = {
      id: messageId,
      role: "user",  // Ensure that the role is "user"
      content,
      timestamp: new Date().toISOString(),
      conversationId: currentConversation,
    };

    setConversations((prevConvs) => {
      const updatedConvs = prevConvs.map((conv) =>
        conv.id === currentConversation
          ? {
            ...conv,
            messages: [...conv.messages, userMessage],
            updatedAt: new Date().toISOString(),
          }
          : conv
      );
      localStorage.setItem("conversations", JSON.stringify(updatedConvs));
      return updatedConvs;
    });

    setIsLoading(true);
    setShowWelcome(false);

    try {
      const response = await fetch("https://n8n.srv783146.hstgr.cloud/webhook/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });
      const data = await response.json();

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",  // Ensure that the role is "assistant"
        content: data.message || "Sorry, I didn't understand that.",
        timestamp: new Date().toISOString(),
        conversationId: currentConversation,
      };

      setConversations((prevConvs) => {
        const updatedConvs = prevConvs.map((conv) =>
          conv.id === currentConversation
            ? {
              ...conv,
              messages: [...conv.messages, assistantMessage],
              updatedAt: new Date().toISOString(),
            }
            : conv
        );
        localStorage.setItem("conversations", JSON.stringify(updatedConvs));
        return updatedConvs;
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setConversations((prevConvs) => {
        const updatedConvs = prevConvs.map((conv) =>
          conv.id === currentConversation
            ? {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: uuidv4(),
                  role: "assistant",  // Ensure role is set to "assistant"
                  content: "Something went wrong, please try again later.",
                  timestamp: new Date().toISOString(),
                  conversationId: currentConversation,
                },
              ],
              updatedAt: new Date().toISOString(),
            }
            : conv
        );
        localStorage.setItem("conversations", JSON.stringify(updatedConvs));
        return updatedConvs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = (conversationId: string) => {
    setConversations((prevConvs) => {
      const updatedConvs = prevConvs.filter((conv) => conv.id !== conversationId)
      if (updatedConvs.length === 0) {
        setShowWelcome(true)
      }
      localStorage.setItem("conversations", JSON.stringify(updatedConvs))
      return updatedConvs
    })
    if (currentConversation === conversationId) {
      setCurrentConversation("")
    }
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-4">
      <Sidebar
        conversations={conversations}
        setConversations={setConversations}
        currentConversationId={currentConversation}
        setCurrentConversation={setCurrentConversation}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between mb-4">
          <ChatHeader
            currentConversation={currentConversation}
            conversations={conversations}
            setCurrentConversation={setCurrentConversation}
          />

          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-4">
          <div className="glass-card col-span-1 lg:col-span-3 overflow-hidden flex flex-col">
            {showWelcome && currentMessages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                <div className="mb-6 h-24 w-24 rounded-full bg-gradient-to-br from-[#2D5BFF] to-[#00E676] p-5 glow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-full w-full text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h2 className="mb-3 text-3xl font-bold gradient-text">Welcome to CryptoAnalyst AI</h2>
                <p className="mb-6 max-w-lg text-gray-300">
                  Your advanced cryptocurrency analysis assistant powered by artificial intelligence. Ask me anything
                  about crypto markets, prices, trends, or technical analysis.
                </p>
                <QuickSuggestions
                  questions={suggestedQuestions}
                  onSelectQuestion={sendMessage}
                />
              </div>
            ) : (
              <MessageList messages={currentMessages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
            )}
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </div>

          <div className="hidden lg:block">
            <MarketOverview />
          </div>
        </div>
      </div>
    </div>
  )
}
