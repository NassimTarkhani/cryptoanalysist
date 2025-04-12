"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

interface QuickSuggestionsProps {
  questions: string[]
  onSelectQuestion: (question: string) => void
}

export function QuickSuggestions({ questions, onSelectQuestion }: QuickSuggestionsProps) {
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-2 flex items-center">
        <HelpCircle className="mr-2 h-4 w-4 text-[#00E676]" />
        <h3 className="text-sm font-medium text-gray-300">Try asking one of these questions:</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="glass-card-hover border-[#2D5BFF]/30 hover:border-[#00E676] text-sm"
            onClick={() => onSelectQuestion(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}
