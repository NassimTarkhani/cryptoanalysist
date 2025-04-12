"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="glass-morphism border-[#2D5BFF] hover:border-[#00E676] h-10 w-10 rounded-full"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-[#00E676] dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all text-[#2D5BFF] dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-morphism border-[#2D5BFF]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`cursor-pointer hover:bg-[#2D5BFF]/20 ${theme === "light" ? "bg-[#2D5BFF]/20" : ""}`}
        >
          <Sun className="mr-2 h-4 w-4 text-[#00E676]" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`cursor-pointer hover:bg-[#2D5BFF]/20 ${theme === "dark" ? "bg-[#2D5BFF]/20" : ""}`}
        >
          <Moon className="mr-2 h-4 w-4 text-[#2D5BFF]" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`cursor-pointer hover:bg-[#2D5BFF]/20 ${theme === "system" ? "bg-[#2D5BFF]/20" : ""}`}
        >
          <span className="mr-2">💻</span>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
