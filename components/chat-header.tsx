"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Conversation } from "./chat-interface"
import { LogOut, User, Settings, History, BarChart3, Bell, HelpCircle } from "lucide-react"

interface ChatHeaderProps {
  currentConversation: string | null  // Updated prop name
  conversations: Conversation[]
  setCurrentConversation: (id: string) => void
}

export function ChatHeader({
  currentConversation,
  conversations,
  setCurrentConversation
}: ChatHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [historyOpen, setHistoryOpen] = useState(false)

  const handleSignOut = async () => {
    // Mock sign out functionality
    window.location.reload()
  }

  const handleNewConversation = () => {
    // This will trigger the useEffect in ChatInterface to create a new conversation
    setCurrentConversation("")
  }

  return (
    <>
      <div className="glass-card flex-1 flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="mr-3 h-10 w-10 rounded-full bg-gradient-to-br from-[#2D5BFF] to-[#00E676] p-2 glow">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">CryptoAnalyst AI</h1>
            <p className="text-xs text-gray-400">Advanced cryptocurrency analysis powered by AI</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">


          <Button variant="ghost" size="icon" className="magnetic-button text-gray-300 hover:text-white">
            <HelpCircle className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="magnetic-button flex items-center space-x-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-[#2D5BFF]">U</AvatarFallback>
                </Avatar>
                <span className="text-sm">User Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-morphism border-[#2D5BFF]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex cursor-pointer items-center hover:bg-[#2D5BFF]/20">
                <User className="mr-2 h-4 w-4 text-[#00E676]" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center hover:bg-[#2D5BFF]/20">
                <Settings className="mr-2 h-4 w-4 text-[#00E676]" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center hover:bg-[#2D5BFF]/20">
                <History className="mr-2 h-4 w-4 text-[#00E676]" />
                <span>History</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex cursor-pointer items-center text-red-400 hover:bg-[#2D5BFF]/20"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="glass-morphism border-[#2D5BFF] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Conversations</DialogTitle>
            <DialogDescription>Search through your message history</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                placeholder="Search for keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-[#2D5BFF] focus:border-[#00E676]"
              />
            </div>
            <Button className="bg-[#2D5BFF] hover:bg-[#2D5BFF]/80">Search</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="glass-morphism border-[#2D5BFF] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conversation History</DialogTitle>
            <DialogDescription>View and select previous conversations</DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="mb-2 cursor-pointer rounded-md p-3 hover:bg-[#2D5BFF]/20 transition-all duration-200"
                  onClick={() => {
                    setCurrentConversation(conversation.id)
                    setHistoryOpen(false)
                  }}
                >
                  <div className="font-medium">{conversation.title || "Untitled Conversation"}</div>
                  <div className="text-xs text-gray-400">{new Date(conversation.createdAt).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400">No previous conversations</div>
            )}
          </div>
          <Button onClick={handleNewConversation} className="bg-[#2D5BFF] hover:bg-[#2D5BFF]/80">
            New Conversation
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
