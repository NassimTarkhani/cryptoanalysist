"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic, MicOff, Sparkles, Paperclip, Smile, ImageIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [showTools, setShowTools] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      // Call the parent function to send the message
      onSendMessage(message)
      setMessage("") // Clear the input after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto" // Reset textarea height
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleRecording = () => {
    setIsRecording((prevState) => !prevState)
    // Recording logic here (e.g., integrate with speech-to-text API)
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex flex-col space-y-2">
        {showTools && (
          <div className="flex items-center space-x-2 px-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-[#2D5BFF]/20"
                  >
                    <ImageIcon className="h-4 w-4 text-[#00E676]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-[#2D5BFF]/20"
                  >
                    <Paperclip className="h-4 w-4 text-[#00E676]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full hover:bg-[#2D5BFF]/20"
                  >
                    <Smile className="h-4 w-4 text-[#00E676]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Emoji</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        <div className="flex items-end space-x-2 relative">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setShowTools(!showTools)}
            className="absolute bottom-3 left-3 h-6 w-6 rounded-full hover:bg-[#2D5BFF]/20 z-10"
          >
            <Paperclip className="h-4 w-4 text-gray-400" />
          </Button>

          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about crypto markets, prices, or trends..."
            className="min-h-[60px] flex-1 resize-none bg-transparent border-[#2D5BFF] focus:border-[#00E676] rounded-xl pl-10"
            disabled={isLoading}
          />
          <div className="flex space-x-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={toggleRecording}
              className={`magnetic-button ${isRecording ? "text-red-500" : "text-gray-300"} hover:text-white rounded-full h-10 w-10`}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isLoading}
              className="magnetic-button bg-gradient-to-r from-[#2D5BFF] to-[#00E676] text-white hover:opacity-90 rounded-full h-10 w-10"
            >
              {isLoading ? <Sparkles className="h-5 w-5 animate-pulse" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
