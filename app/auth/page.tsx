import { CryptoBackground } from "@/components/crypto-background"
import { ChatInterface } from "@/components/chat-interface"
import { AuthUI } from "@/components/auth-ui"

export default function Home() {
    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#121826] to-[#1a2036]">
            <div className="absolute inset-0 hex-pattern opacity-30"></div>
            <CryptoBackground />
            <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
                <AuthUI />
            </div>
        </main>
    )
}
