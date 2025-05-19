"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
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
  role: "user" | "assistant";
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
    const savedConversations = localStorage.getItem("conversations");
    if (!savedConversations) {
      createNewConversation();
    } else {
      try {
        const parsedConversations: Conversation[] = JSON.parse(savedConversations);
        if (parsedConversations.length > 0) {
          setConversations(parsedConversations);
          setCurrentConversation(parsedConversations[0].id);
        } else {
          createNewConversation();
        }
      } catch (error) {
        console.error("Error parsing conversations:", error);
        createNewConversation();
      }
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem("conversations", JSON.stringify(conversations))
    }
  }, [conversations]);

  const currentConversationData = conversations.find((conv) => conv.id === currentConversation)
  const currentMessages = currentConversationData?.messages ?? [];
  useEffect(() => {
    setShowWelcome(!currentMessages || currentMessages.length === 0);
  }, [currentConversation, currentMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentMessages]);
  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentConversation) return;

    const messageId = uuidv4();
    const userMessage: Message = {
      id: messageId,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      conversationId: currentConversation,
    };

    console.log("Sending message:", userMessage);

    setConversations((prevConvs) => {
      const updatedConvs = prevConvs.map((conv) =>
        conv.id === currentConversation
          ? {
            ...conv,
            messages: [...conv.messages, userMessage],
            updatedAt: new Date().toISOString(),
          }
          : conv
      ) as Conversation[];
      localStorage.setItem("conversations", JSON.stringify(updatedConvs));
      return updatedConvs;
    });

    setIsLoading(true);
    setShowWelcome(false);

    try {
      console.log("Sending POST request to webhook with body:", { message: content });

      const response = await fetch(
        "https://n8n.srv783146.hstgr.cloud/webhook/19dd1c29-5245-49e4-838f-ff23b31b1e03",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: content }),
        }
      );

      console.log("Received raw response status:", response.status);

      const text = await response.text();
      console.log("Raw response text:", text);

      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
        console.log("Parsed JSON response:", data);
      } catch (jsonError) {
        console.error("Invalid JSON received:", text);
      }

      const extractedMessage =
        data?.message || data?.text || data?.response || JSON.stringify(data) || "Sorry, I didn't understand that.";

      console.log("Extracted assistant message:", extractedMessage);

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: extractedMessage,
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
        ) as Conversation[];
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
                  role: "assistant",
                  content: "Something went wrong, please try again later.",
                  timestamp: new Date().toISOString(),
                  conversationId: currentConversation,
                },
              ],
              updatedAt: new Date().toISOString(),
            }
            : conv
        ) as Conversation[];
        localStorage.setItem("conversations", JSON.stringify(updatedConvs));
        return updatedConvs;
      });
    } finally {
      setIsLoading(false);
    }
  };




  const deleteConversation = (conversationId: string) => {
    setConversations((prevConvs: Conversation[]): Conversation[] => {
      const updatedConvs = prevConvs.filter((conv) => conv.id !== conversationId);
      localStorage.setItem("conversations", JSON.stringify(updatedConvs));
      if (updatedConvs.length === 0) {
        setShowWelcome(true);
        setCurrentConversation("");
      } else if (currentConversation === conversationId) {
        setCurrentConversation(updatedConvs[0].id);
      }
      return updatedConvs;
    });
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] w-full gap-2 sm:gap-4 relative">
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden fixed top-4 left-4 z-50 h-10 w-10"
        onClick={() => setSidebarCollapsed(false)}
        aria-label="Open sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </Button>
      <Sidebar
        conversations={conversations}
        setConversations={setConversations}
        currentConversationId={currentConversation}
        setCurrentConversation={setCurrentConversation}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <ChatHeader
            currentConversation={currentConversation}
            conversations={conversations}
            setCurrentConversation={setCurrentConversation}
          />
        </div>
        <div className="grid h-full grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4 overflow-hidden max-w-[95vw] sm:max-w-none">
          <div className="glass-card col-span-1 lg:col-span-3 overflow-hidden flex flex-col">
            {showWelcome && currentMessages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-3 sm:p-4 lg:p-6 text-center">
                <div className="mb-4 sm:mb-6 h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-full bg-gradient-to-br from-[#2D5BFF] to-[#00E676] p-4 sm:p-5 glow">
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
                <h2 className="mb-2 sm:mb-3 text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">Welcome to CryptoAnalyst AI</h2>
                <p className="mb-4 sm:mb-6 max-w-[90vw] sm:max-w-lg text-gray-300 text-sm sm:text-base">
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