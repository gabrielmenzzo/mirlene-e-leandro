"use client"

import * as React from "react"

interface WelcomeOverlayProps {
  onEnter: () => void
}

export function WelcomeOverlay({ onEnter }: WelcomeOverlayProps) {
  const [isExiting, setIsExiting] = React.useState(false)

  const handleEnter = () => {
    setIsExiting(true)
    // Wait for fade-out animation to complete
    setTimeout(() => {
      onEnter()
    }, 600)
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-wedding-bg transition-opacity duration-500 ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-bg opacity-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Ring Icon */}
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-wedding-primary opacity-80"
        >
          <circle cx="25" cy="30" r="15" stroke="currentColor" strokeWidth="1" />
          <circle cx="35" cy="30" r="15" stroke="currentColor" strokeWidth="1" />
          <path d="M30 15C30 15 28 12 30 10C32 12 30 15 30 15Z" fill="currentColor" />
        </svg>

        {/* Names */}
        <h1 className="font-great-vibes text-5xl md:text-7xl text-wedding-text tracking-wider">
          Mirlene <span className="text-3xl md:text-4xl mx-2 font-cormorant italic text-wedding-primary">&amp;</span> Leandro
        </h1>

        <p className="font-cormorant text-lg md:text-xl text-wedding-secondary/80 italic font-light max-w-md">
          03 de Outubro de 2026
        </p>

        {/* Enter Button */}
        <button
          onClick={handleEnter}
          className="mt-6 group relative inline-flex items-center gap-3 px-10 py-3.5 border border-wedding-primary/40 rounded-full text-wedding-primary font-cormorant text-lg tracking-widest uppercase hover:bg-wedding-primary hover:text-white transition-all duration-300 cursor-pointer"
        >
          <span>Entrar</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
