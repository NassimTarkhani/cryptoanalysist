export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string
          title: string
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id: string
          title: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          role: "user" | "assistant"
          content: string
          timestamp: string
          conversation_id: string
        }
        Insert: {
          id: string
          role: "user" | "assistant"
          content: string
          timestamp?: string
          conversation_id: string
        }
        Update: {
          id?: string
          role?: "user" | "assistant"
          content?: string
          timestamp?: string
          conversation_id?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: string
          notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
