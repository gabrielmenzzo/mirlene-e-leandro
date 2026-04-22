"use client"

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { CheckCircle2, Heart, Sparkles, Users } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { GiftItem } from "./GiftCard"
import CheckoutForm from "./CheckoutForm"

interface GiftModalProps {
  gift: GiftItem | null
  isOpen: boolean
  onClose: () => void
  onSuccess: (giftId: string) => void
}

type Step = "confirm" | "bump" | "payment" | "success"

export function GiftModal({ gift, isOpen, onClose, onSuccess }: GiftModalProps) {
  const [step, setStep] = React.useState<Step>("confirm")
  const [bumpAccepted, setBumpAccepted] = React.useState(false)
  const [socialProof] = React.useState(() => Math.floor(Math.random() * 7) + 2)
  const [paymentError, setPaymentError] = React.useState<string | null>(null)

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setStep("confirm")
      setBumpAccepted(false)
      setPaymentError(null)
    }
  }, [isOpen])

  if (!gift) return null

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

  const handleConfirm = () => setStep("payment")
  const handleBump = (accept: boolean) => {
    setBumpAccepted(accept)
    setStep("payment")
  }
  const handlePaymentSuccess = (paymentId: string) => {
    console.log("Payment successful:", paymentId)
    setStep("success")
    setTimeout(() => {
      onSuccess(gift.id)
      onClose()
    }, 2500)
  }

  const handlePaymentError = (error: string) => {
    setPaymentError(error)
  }

  // Calculate bump logic
  let bumpTitle = ""
  let bumpDescription = ""
  let bumpPrice = 0
  let bumpType = ""

  if (gift.price <= 300) {
    bumpTitle = "Que tal tornar este presente ainda mais especial? 💛"
    bumpDescription = "Adicione uma gravação/personalização exclusiva com o nome dos noivos."
    bumpPrice = 50
    bumpType = "Personalização"
  } else if (gift.price <= 800) {
    bumpTitle = "Você já está sendo incrível! Quer ir além? ✨"
    bumpDescription = "Faça um upgrade para a versão premium deste presente."
    bumpPrice = gift.price * 0.3
    bumpType = "Upgrade Premium"
  } else {
    bumpTitle = "Você é um anjo! Que tal dividir com alguém? 💕"
    bumpDescription = "Convide amigos ou familiares para dividir este presente inesquecível."
    bumpPrice = 0 // No extra cost, just sharing
    bumpType = "Cota Compartilhada"
  }

  const finalPrice = gift.price + (bumpAccepted ? bumpPrice : 0)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogTitle className="sr-only">Presentear</DialogTitle>
        <AnimatePresence mode="wait">
          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-cormorant font-semibold text-wedding-text">
                  Confirmar Presente
                </h2>
                <p className="text-wedding-secondary mt-1">
                  Você está prestes a presentear os noivos com:
                </p>
              </div>

              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-wedding-primary/20 shadow-md">
                <Image src={gift.imageUrl} alt={gift.name} fill className="object-cover" />
              </div>

              <div>
                <h4 className="font-cormorant text-xl font-semibold text-wedding-text mb-1">
                  {gift.name}
                </h4>
                <p className="text-2xl font-medium text-wedding-primary">
                  {formatPrice(gift.price)}
                </p>
              </div>

              <div className="w-full flex flex-col gap-3 pt-4">
                <Button onClick={handleConfirm} className="w-full text-lg h-14 cursor-pointer">
                  Confirmar este presente
                </Button>
                <Button variant="ghost" onClick={onClose} className="cursor-pointer">
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}

          {step === "bump" && (
            <motion.div
              key="bump"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl text-wedding-primary font-cormorant flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Oferta Especial
                  <Sparkles className="w-5 h-5" />
                </DialogTitle>
              </DialogHeader>

              <div className="bg-gradient-to-br from-wedding-muted to-white border-2 border-wedding-primary/30 rounded-xl p-6 shadow-lg relative overflow-hidden w-full">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Heart className="w-24 h-24" />
                </div>
                
                <h4 className="font-semibold text-wedding-text text-lg mb-2 relative z-10">
                  {bumpTitle}
                </h4>
                <p className="text-wedding-secondary text-sm mb-4 relative z-10">
                  {bumpDescription}
                </p>
                
                {bumpPrice > 0 && (
                  <div className="text-xl font-medium text-wedding-primary mb-6 relative z-10">
                    + {formatPrice(bumpPrice)}
                  </div>
                )}

                <div className="flex items-center justify-center gap-2 text-xs font-medium text-wedding-secondary bg-white/60 py-2 px-4 rounded-full w-fit mx-auto relative z-10">
                  <Users className="w-4 h-4 text-wedding-primary" />
                  {socialProof} pessoas já escolheram esta opção
                </div>
              </div>

              <div className="w-full flex flex-col gap-3">
                <Button onClick={() => handleBump(true)} className="w-full text-lg h-14 bg-wedding-primary hover:bg-wedding-primary/90 shadow-lg shadow-wedding-primary/20 animate-pulse cursor-pointer">
                  Sim, quero presentear ainda mais! 💝
                </Button>
                <Button variant="outline" onClick={() => handleBump(false)} className="cursor-pointer">
                  Não, obrigado. Manter apenas o presente.
                </Button>
              </div>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col space-y-5"
            >
              <DialogHeader className="text-center sm:text-center">
                <DialogTitle className="text-2xl text-wedding-text">Pagamento Seguro</DialogTitle>
                <DialogDescription>
                  Total: <span className="font-semibold text-wedding-primary">{formatPrice(finalPrice)}</span>
                </DialogDescription>
              </DialogHeader>

              {paymentError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {paymentError}
                </div>
              )}

              <CheckoutForm
                giftName={gift.name}
                giftPrice={finalPrice}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onBack={() => setStep("confirm")}
              />
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center space-y-6 py-8"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-cormorant text-3xl font-semibold text-wedding-text">
                Muito Obrigado!
              </h3>
              <p className="text-wedding-secondary">
                Seu presente foi confirmado com sucesso. Os noivos ficarão muito felizes!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
