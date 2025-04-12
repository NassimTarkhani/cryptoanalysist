"use client"

import { useEffect, useRef } from "react"

export function CryptoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create crypto icons
    const icons = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, color: "#f7931a", size: 30, speed: 1.0 }, // Bitcoin
      { x: canvas.width * 0.8, y: canvas.height * 0.2, color: "#627eea", size: 30, speed: 1.2 }, // Ethereum
      { x: canvas.width * 0.5, y: canvas.height * 0.7, color: "#00E676", size: 30, speed: 1.1 }, // Altcoin
      { x: canvas.width * 0.3, y: canvas.height * 0.6, color: "#2D5BFF", size: 25, speed: 1.3 }, // Another coin
      { x: canvas.width * 0.7, y: canvas.height * 0.5, color: "#9945FF", size: 25, speed: 0.9 }, // Another coin
    ]

    // Create nodes for blockchain visualization
    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.2, // Increased speed
      vy: (Math.random() - 0.5) * 1.2, // Increased speed
      size: 2 + Math.random() * 3,
      color: Math.random() > 0.5 ? "#2D5BFF" : "#00E676",
      opacity: 0.3 + Math.random() * 0.5,
    }))

    // Create particles
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 0.5 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 0.8, // Increased speed
      speedY: (Math.random() - 0.5) * 0.8, // Increased speed
      opacity: 0.1 + Math.random() * 0.3,
      color: Math.random() > 0.7 ? "#00E676" : "#2D5BFF",
    }))

    // Animation loop
    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.02 // Increased speed
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle =
          particle.color +
          Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()

        // Move particles
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
      })

      // Draw connections between nodes
      ctx.lineWidth = 0.5
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)

            // Gradient line with pulsing effect
            const opacity = (1 - distance / 150) * 0.4 * (0.7 + 0.3 * Math.sin(time * 2))
            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)
            gradient.addColorStop(
              0,
              nodes[i].color +
                Math.floor(opacity * 255)
                  .toString(16)
                  .padStart(2, "0"),
            )
            gradient.addColorStop(
              1,
              nodes[j].color +
                Math.floor(opacity * 255)
                  .toString(16)
                  .padStart(2, "0"),
            )

            ctx.strokeStyle = gradient
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fillStyle =
          node.color +
          Math.floor(node.opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()

        // Add glow effect
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size + 2, 0, Math.PI * 2)
        ctx.fillStyle = node.color + "10" // 10% opacity
        ctx.fill()

        // Move nodes
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1
      })

      // Draw crypto icons
      icons.forEach((icon, index) => {
        const yOffset = Math.sin(time * icon.speed + index) * 15 // Increased amplitude

        // Draw outer circle with glow
        ctx.beginPath()
        ctx.arc(icon.x, icon.y + yOffset, icon.size + 5, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(
          icon.x,
          icon.y + yOffset,
          icon.size,
          icon.x,
          icon.y + yOffset,
          icon.size + 5,
        )
        gradient.addColorStop(0, icon.color + "40") // 25% opacity
        gradient.addColorStop(1, icon.color + "00") // 0% opacity
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw main circle
        ctx.beginPath()
        ctx.arc(icon.x, icon.y + yOffset, icon.size, 0, Math.PI * 2)
        ctx.strokeStyle = icon.color
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw hexagon inside with rotation
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i + time * icon.speed * 1.5 // Increased rotation speed
          const x = icon.x + icon.size * 0.6 * Math.cos(angle)
          const y = icon.y + yOffset + icon.size * 0.6 * Math.sin(angle)
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.strokeStyle = icon.color
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Draw inner circle with pulsing effect
        const pulseSize = icon.size * 0.3 * (0.8 + 0.2 * Math.sin(time * 3 * icon.speed))
        ctx.beginPath()
        ctx.arc(icon.x, icon.y + yOffset, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = icon.color + "60" // 40% opacity
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}
