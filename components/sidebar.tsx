import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Search,
  PlusCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star,
  Trash2,
  HelpCircle,
} from "lucide-react"
import type { Conversation } from "./chat-interface"

interface SidebarProps {
  conversations: Conversation[]
  currentConversationId: string
  setCurrentConversation: (id: string) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
}

export function Sidebar({
  conversations,
  currentConversationId,
  setCurrentConversation,
  collapsed,
  setCollapsed,
  setConversations,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations)
    } else {
      const filtered = conversations.filter((conv) =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredConversations(filtered)
    }
  }, [searchQuery, conversations])

  useEffect(() => {
    if (!conversations.some(conv => conv.id === currentConversationId)) {
      setCurrentConversation(conversations[0]?.id || "") // Set to the first conversation or empty if none exists
    }
  }, [conversations, currentConversationId, setCurrentConversation])

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      userId: "some-user-id",
      messages: [],
    };

    // Add the new conversation to the list of existing ones
    setConversations((prevConversations) => {
      const updatedConversations = [...prevConversations, newConversation];
      localStorage.setItem("conversations", JSON.stringify(updatedConversations)); // Save to localStorage
      return updatedConversations;
    });

    // Set the new conversation as the current active one
    setCurrentConversation(newConversation.id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prevConversations) =>
      prevConversations.filter((conversation) => conversation.id !== id)
    )
    if (currentConversationId === id) {
      const nextConversation = conversations.find((conv) => conv.id !== id)
      setCurrentConversation(nextConversation?.id || "") // Fall back to first conversation if none left
    }
  }

  return (
    <div className={`h-[calc(100vh-2rem)] transition-all duration-300 ${collapsed ? "w-16" : "w-72"}`}>
      <div className="glass-card h-full flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-[#2D5BFF]/20">
          {!collapsed && (
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-[#2D5BFF]">U</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">User Profile</p>
                <p className="text-xs text-gray-400">Pro Plan</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8 rounded-full"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Search and New Chat */}
        <div className="p-3">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8 bg-transparent border-[#2D5BFF]/30 focus:border-[#00E676]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-[#2D5BFF] to-[#00E676] hover:opacity-90"
                onClick={handleNewConversation}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Conversation
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full hover:bg-[#2D5BFF]/20"
                      onClick={() => setCollapsed(false)}
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Search</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full hover:bg-[#2D5BFF]/20"
                      onClick={handleNewConversation}
                    >
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>New Conversation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1 px-3">
          {!collapsed ? (
            <div className="space-y-1 py-2">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`group flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-[#2D5BFF]/20 cursor-pointer ${currentConversationId === conversation.id ? "bg-[#2D5BFF]/20 border-l-2 border-[#00E676]" : ""}`}
                    onClick={() => setCurrentConversation(conversation.id)}
                  >
                    <div className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4 text-gray-400" />
                      <div className="max-w-[140px]">
                        <p className="truncate text-sm font-medium">{conversation.title}</p>
                        <p className="truncate text-xs text-gray-400">
                          {new Date(conversation.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                        <Star className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => handleDeleteConversation(conversation.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-sm text-gray-400">No conversations found</div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 py-2">
              {filteredConversations.slice(0, 5).map((conversation) => (
                <TooltipProvider key={conversation.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-10 w-10 rounded-full ${currentConversationId === conversation.id ? "bg-[#2D5BFF]/20 border-l-2 border-[#00E676]" : ""}`}
                        onClick={() => setCurrentConversation(conversation.id)}
                      >
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{conversation.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-[#2D5BFF]/20">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="text-xs">
                <Settings className="mr-1 h-3 w-3" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <HelpCircle className="mr-1 h-3 w-3" />
                Help
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-red-400">
                <LogOut className="mr-1 h-3 w-3" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <LogOut className="h-4 w-4 text-red-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
