import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { chatInput } = await req.json()

    // Forward the request to the n8n webhook
    const response = await fetch("https://n8n.srv783146.hstgr.cloud/webhook/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatInput }),
    })

    if (!response.ok) {
      throw new Error(`Error from webhook: ${response.statusText}`)
    }

    const data = await response.text()
    return NextResponse.json({ response: data })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
