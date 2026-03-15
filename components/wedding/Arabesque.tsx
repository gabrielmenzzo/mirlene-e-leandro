import * as React from "react"
import { cn } from "@/lib/utils"

interface ArabesqueProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

export function Arabesque({ className, ...props }: ArabesqueProps) {
  return (
    <svg
      width="200"
      height="40"
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-wedding-primary opacity-60", className)}
      {...props}
    >
      <path
        d="M100 20C80 20 70 5 50 5C30 5 20 20 0 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M100 20C120 20 130 5 150 5C170 5 180 20 200 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="100" cy="20" r="4" fill="currentColor" />
      <circle cx="100" cy="20" r="8" stroke="currentColor" strokeWidth="1" />
      <path
        d="M95 20C95 15 105 15 105 20C105 25 95 25 95 20Z"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
    </svg>
  )
}
