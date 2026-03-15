"use client"

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { CheckCircle2, Copy, Heart, Sparkles, Users } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { GiftItem } from "./GiftCard"

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
  const [copied, setCopied] = React.useState(false)

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setStep("confirm")
      setBumpAccepted(false)
      setCopied(false)
    }
  }, [isOpen])

  if (!gift) return null

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)

  const handleConfirm = () => setStep("bump")
  const handleBump = (accept: boolean) => {
    setBumpAccepted(accept)
    setStep("payment")
  }
  const handlePaymentSuccess = () => {
    setStep("success")
    setTimeout(() => {
      onSuccess(gift.id)
      onClose()
    }, 2500)
  }

  const copyPix = () => {
    navigator.clipboard.writeText("00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5925Mirlene e Leandro Casamento6009Sao Paulo62070503***63041234")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
      <DialogContent className="sm:max-w-md overflow-hidden">
        <AnimatePresence mode="wait">
          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl text-wedding-text">Confirmar Presente</DialogTitle>
                <DialogDescription>
                  Você está prestes a presentear os noivos com:
                </DialogDescription>
              </DialogHeader>

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
                <Button onClick={handleConfirm} className="w-full text-lg h-14">
                  Confirmar este presente
                </Button>
                <Button variant="ghost" onClick={onClose}>
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
                <Button onClick={() => handleBump(true)} className="w-full text-lg h-14 bg-wedding-primary hover:bg-wedding-primary/90 shadow-lg shadow-wedding-primary/20 animate-pulse">
                  Sim, quero presentear ainda mais! 💝
                </Button>
                <Button variant="outline" onClick={() => handleBump(false)}>
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
                <DialogTitle className="text-2xl text-wedding-text">Pagamento PIX</DialogTitle>
                <DialogDescription>
                  Total a pagar: <span className="font-semibold text-wedding-primary">{formatPrice(finalPrice)}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-wedding-text">Seu Nome</label>
                  <Input placeholder="Como os noivos devem te agradecer?" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-wedding-text">Mensagem aos Noivos</label>
                  <textarea 
                    className="flex w-full rounded-md border border-wedding-secondary/30 bg-white/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wedding-primary resize-none"
                    rows={3}
                    placeholder="Deixe uma mensagem carinhosa..."
                    maxLength={200}
                  />
                </div>

                <div className="bg-wedding-muted/50 rounded-xl p-6 flex flex-col items-center justify-center border border-wedding-secondary/20">
                  <div className="w-40 h-40 bg-white rounded-lg shadow-sm border border-wedding-secondary/10 flex items-center justify-center mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-contain bg-center opacity-20 filter blur-[1px]"></div>
                    <div className="relative z-10 text-center px-4">
                      <p className="text-xs font-medium text-wedding-secondary mb-1">Integração Mercado Pago</p>
                      <p className="text-xs text-wedding-secondary/70">Em breve</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full flex items-center gap-2" onClick={copyPix}>
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Chave Copiada!" : "Copiar Chave PIX"}
                  </Button>
                </div>
              </div>

              <Button onClick={handlePaymentSuccess} className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 text-white">
                Já realizei o pagamento ✅
              </Button>
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
