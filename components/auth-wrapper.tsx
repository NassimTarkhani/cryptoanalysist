"use client"

import type React from "react"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  // Always render children directly without auth checks
  return <>{children}</>
}
