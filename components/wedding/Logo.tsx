import * as React from "react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)} {...props}>
      <div className="relative flex items-center justify-center mb-2">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-wedding-primary">
          <circle cx="25" cy="30" r="15" stroke="currentColor" strokeWidth="1" />
          <circle cx="35" cy="30" r="15" stroke="currentColor" strokeWidth="1" />
          <path d="M30 15C30 15 28 12 30 10C32 12 30 15 30 15Z" fill="currentColor" />
        </svg>
      </div>
      <h1 className="font-great-vibes text-5xl md:text-6xl text-wedding-text tracking-wider">
        Mirlene <span className="text-3xl mx-2 font-cormorant italic text-wedding-primary">&amp;</span> Leandro
      </h1>
    </div>
  )
}
