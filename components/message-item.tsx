"use client"

import { useState } from "react"
import type { Message } from "./chat-interface"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Copy, Share, MoreHorizontal, RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface MessageItemProps {
  message: Message
  isTyping?: boolean
}

// Simple markdown renderer function
function renderMarkdown(text: string) {
  // Handle headers
  let formattedText = text.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-3 mb-1">$1</h3>')
  formattedText = formattedText.replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2 text-[#00E676]">$1</h2>')
  formattedText = formattedText.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-5 mb-3">$1</h1>')

  // Handle bold and italic
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#2D5BFF]">$1</strong>')
  formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Handle links
  formattedText = formattedText.replace(
    /\[(.*?)\]$(.*?)$/g,
    '<a href="$2" class="text-[#2D5BFF] hover:underline">$1</a>',
  )

  // Handle code blocks
  formattedText = formattedText.replace(
    /```([\s\S]*?)```/g,
    '<pre class="my-2 overflow-auto rounded bg-gray-800 p-2 text-sm">$1</pre>',
  )

  // Handle inline code
  formattedText = formattedText.replace(/`(.*?)`/g, '<code class="rounded bg-gray-800 px-1 py-0.5 text-sm">$1</code>')

  // Handle lists
  formattedText = formattedText.replace(
    /^- (.*$)/gm,
    '<li class="ml-4 flex items-center"><span class="mr-2 text-[#00E676]">•</span>$1</li>',
  )
  formattedText = formattedText.replace(
    /^\d\. (.*$)/gm,
    '<li class="ml-4 flex items-center"><span class="mr-2 text-[#2D5BFF]">$1.</span>$1</li>',
  )

  // Handle tables
  formattedText = formattedText.replace(
    /\|(.+)\|/g,
    '<table class="min-w-full border-collapse text-sm my-3">$1</table>',
  )
  formattedText = formattedText.replace(/\| (.*) \|/g, "<tr>$1</tr>")
  formattedText = formattedText.replace(/\|(.*?)\|/g, '<td class="border border-gray-700 px-3 py-2">$1</td>')

  // Handle paragraphs
  formattedText = formattedText.replace(/\n\n/g, "<br/><br/>")

  return formattedText
}

export function MessageItem({ message, isTyping = false }: MessageItemProps) {
  const { toast } = useToast()
  const [showActions, setShowActions] = useState(false)
  const [feedback, setFeedback] = useState<"none" | "up" | "down">("none")

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied",
    })
  }

  const shareMessage = () => {
    // This would typically open a share dialog or create a shareable link
    toast({
      title: "Share feature",
      description: "Sharing functionality would be implemented here",
    })
  }

  const resubmitQuestion = () => {
    // This would trigger resubmitting the question
    toast({
      title: "Resubmit question",
      description: "Question resubmission would be implemented here",
    })
  }

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(type)
    toast({
      title: type === "up" ? "Feedback received" : "We'll improve",
      description:
        type === "up" ? "Thank you for your positive feedback!" : "Thank you for helping us improve our responses.",
    })
  }

  return (
    <div
      className={`message-appear mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {message.role === "assistant" && (
        <div className="mr-2 flex flex-col items-center">
          <Avatar className="h-8 w-8 border-2 border-[#00E676]">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-gradient-to-br from-[#2D5BFF] to-[#00E676]">AI</AvatarFallback>
          </Avatar>
        </div>
      )}

      <div
        className={`relative max-w-[85%] rounded-xl p-4 ${message.role === "user" ? "bg-gradient-to-r from-[#2D5BFF] to-[#2D5BFF]/80 text-white" : "glass-morphism border-[#2D5BFF]/30 text-gray-100"}`}
      >
        {message.role === "assistant" && (
          <div className="markdown-content">
            {isTyping ? (
              <div className="typing-animation">{message.content}</div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
            )}
          </div>
        )}

        {message.role === "user" && <div>{message.content}</div>}

        {showActions && !isTyping && (
          <div className={`absolute -top-3 ${message.role === "user" ? "left-0" : "right-0"} flex space-x-1`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full bg-[#121826] p-1 text-gray-300 hover:text-white border border-[#2D5BFF]/30"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>

            {message.role === "assistant" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full bg-[#121826] p-1 text-gray-300 hover:text-white border border-[#2D5BFF]/30"
                  onClick={shareMessage}
                >
                  <Share className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 rounded-full bg-[#121826] p-1 hover:text-white border border-[#2D5BFF]/30 ${feedback === "up" ? "text-[#00E676]" : "text-gray-300"}`}
                  onClick={() => handleFeedback("up")}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 rounded-full bg-[#121826] p-1 hover:text-white border border-[#2D5BFF]/30 ${feedback === "down" ? "text-red-400" : "text-gray-300"}`}
                  onClick={() => handleFeedback("down")}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </>
            )}

            {message.role === "user" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full bg-[#121826] p-1 text-gray-300 hover:text-white border border-[#2D5BFF]/30"
                onClick={resubmitQuestion}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full bg-[#121826] p-1 text-gray-300 hover:text-white border border-[#2D5BFF]/30"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={message.role === "user" ? "start" : "end"}
                className="glass-morphism border-[#2D5BFF]/30"
              >
                <DropdownMenuItem onClick={copyToClipboard} className="hover:bg-[#2D5BFF]/20">
                  Copy text
                </DropdownMenuItem>
                {message.role === "assistant" && (
                  <DropdownMenuItem onClick={shareMessage} className="hover:bg-[#2D5BFF]/20">
                    Share response
                  </DropdownMenuItem>
                )}
                {message.role === "user" && (
                  <DropdownMenuItem onClick={resubmitQuestion} className="hover:bg-[#2D5BFF]/20">
                    Ask again
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {message.role === "user" && (
        <div className="ml-2 flex flex-col items-center">
          <Avatar className="h-8 w-8 border-2 border-[#2D5BFF]">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-[#2D5BFF]">U</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  )
}
