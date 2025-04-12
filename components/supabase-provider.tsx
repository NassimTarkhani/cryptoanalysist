"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

// Mock Supabase client with minimal functionality
const mockSupabaseClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: () => ({
    insert: () => Promise.resolve({ error: null }),
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  }),
}

type SupabaseContext = {
  supabase: typeof mockSupabaseClient
  user: null
  loading: boolean
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Set loading to false immediately
  useState(() => {
    setLoading(false)
  })

  return (
    <Context.Provider
      value={{
        supabase: mockSupabaseClient,
        user: null,
        loading: false,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
