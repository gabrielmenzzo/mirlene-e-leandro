"use client"

import * as React from "react"
import { motion } from "motion/react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const targetDate = new Date("2026-10-03T10:00:00-03:00").getTime()

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const timeUnits = [
    { label: "Dias", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ]

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="font-cormorant text-4xl md:text-5xl font-light text-wedding-text mb-1">
            {unit.value.toString().padStart(2, "0")}
          </div>
          <div className="text-xs md:text-sm uppercase tracking-widest text-wedding-secondary font-medium">
            {unit.label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
