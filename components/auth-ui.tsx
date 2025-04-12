"use client"

import { useState } from "react"
// import { useSupabase } from "./supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Github, Mail } from "lucide-react"
import Link from "next/link"

export function AuthUI() {
  // const { supabase } = useSupabase()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailSignIn = async (isSignUp = false) => {
    setLoading(true)
    try {
      // const { error } = isSignUp
      //   ? await supabase.auth.signUp({
      //       email,
      //       password,
      //       options: {
      //         emailRedirectTo: `${window.location.origin}/auth/callback`,
      //       },
      //     })
      //   : await supabase.auth.signInWithPassword({
      //       email,
      //       password,
      //     })

      // if (error) {
      //   toast({
      //     title: "Authentication error",
      //     description: error.message,
      //     variant: "destructive",
      //   })
      // } else if (isSignUp) {
      //   toast({
      //     title: "Check your email",
      //     description: "We sent you a confirmation link",
      //   })
      // }
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "github") => {
    setLoading(true)
    try {
      // const { error } = await supabase.auth.signInWithOAuth({
      //   provider,
      //   options: {
      //     redirectTo: `${window.location.origin}/auth/callback`,
      //   },
      // })

      // if (error) {
      //   toast({
      //     title: "Authentication error",
      //     description: error.message,
      //     variant: "destructive",
      //   })
      // }
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="mb-6 text-center text-2xl font-bold text-white">Welcome to CryptoAnalyst</h2>

      <div className="mb-4 space-y-4">
        <Button
          className="magnetic-button w-full"
          variant="outline"
          onClick={() => handleOAuthSignIn("github")}
          disabled={loading}
        >
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-600"></span>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#121826] px-2 text-gray-400">Or continue with</span>
        </div>
      </div>

      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="magnetic-button w-full" onClick={() => handleEmailSignIn(false)} disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Signing in...
              </span>
            ) : (
              <Link href="/">
                <span className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Sign In with Email
                </span>
              </Link>

            )}
          </Button>
        </TabsContent>

        <TabsContent value="signup" className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-email">Email</Label>
            <Input
              id="new-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Password</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="magnetic-button w-full" onClick={() => handleEmailSignIn(true)} disabled={loading}>
            {loading ? (
              <span className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Creating account...
              </span>
            ) : (
              <span className="flex items-center">
                <Link href="/">

                  <Mail className="mr-2 h-4 w-4" />
                  Sign Up with Email
                </Link>

              </span>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
