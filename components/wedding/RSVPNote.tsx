"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Gift } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"

export function RSVPNote() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-lg mx-auto text-center"
    >
      <Card className="glass-card">
        <CardContent className="py-12 flex flex-col items-center space-y-6">
          <h3 className="font-cormorant text-3xl font-semibold text-wedding-text">
            Lista de Presentes
          </h3>
          <p className="text-wedding-secondary text-lg max-w-md">
            Para presentear os Noivos, toque no botão abaixo.
          </p>
          <Link href="/presente" className="mt-2">
            <Button variant="default" className="cursor-pointer group">
              <Gift className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Ver Lista de Presentes
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}
