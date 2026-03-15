"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { Gift, Heart } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export interface GiftItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  badge?: string
  isReserved?: boolean
}

interface GiftCardProps {
  gift: GiftItem
  onGiftClick: (gift: GiftItem) => void
}

export function GiftCard({ gift, onGiftClick }: GiftCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden group relative border-wedding-secondary/20 hover:border-wedding-primary/50 transition-colors duration-300">
        {gift.isReserved && (
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
            <div className="bg-wedding-primary text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
              <Heart className="w-5 h-5 fill-current" />
              <span className="font-medium">Presenteado</span>
            </div>
          </div>
        )}

        {gift.badge && !gift.isReserved && (
          <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm text-wedding-primary text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border border-wedding-primary/20 flex items-center gap-1.5">
            {gift.badge}
          </div>
        )}

        <div className="relative w-full aspect-[4/3] overflow-hidden bg-wedding-muted">
          <Image
            src={gift.imageUrl}
            alt={gift.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <CardContent className="flex-grow p-6 flex flex-col">
          <h3 className="font-cormorant text-xl font-semibold text-wedding-text mb-2 line-clamp-2">
            {gift.name}
          </h3>
          <p className="text-sm text-wedding-secondary line-clamp-2 mb-4 flex-grow">
            {gift.description}
          </p>
          <div className="text-lg font-medium text-wedding-primary">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(gift.price)}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            className="w-full group/btn"
            onClick={() => onGiftClick(gift)}
            disabled={gift.isReserved}
          >
            Presentear
            <Gift className="ml-2 w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
