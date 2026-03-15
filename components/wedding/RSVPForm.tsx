"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { motion } from "motion/react"
import confetti from "canvas-confetti"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"

type RSVPFormData = {
  name: string
  phone: string
  attending: "yes" | "no"
}

export function RSVPForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [submittedName, setSubmittedName] = React.useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RSVPFormData>()

  const formatPhone = (value: string) => {
    if (!value) return ""
    value = value.replace(/\D/g, "")
    if (value.length > 11) value = value.slice(0, 11)
    
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2")
    value = value.replace(/(\d)(\d{4})$/, "$1-$2")
    return value
  }

  const onSubmit = async (data: RSVPFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
    setSubmittedName(data.name.split(" ")[0])

    if (data.attending === "yes") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#B89C6D", "#E6D5B8", "#8A7B66"],
      })
    }

    reset()
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg mx-auto"
      >
        <Card className="glass-card text-center py-12">
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-wedding-primary/10 flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-wedding-primary" fill="currentColor" />
            </div>
            <h3 className="font-cormorant text-3xl font-semibold text-wedding-text">
              Obrigado, {submittedName}!
            </h3>
            <p className="text-wedding-secondary">
              Sua resposta foi registrada com sucesso.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setIsSuccess(false)}
            >
              Enviar outra resposta
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="glass-card">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl mb-2">Confirme sua Presença</CardTitle>
          <CardDescription className="text-base">
            Por favor, responda até 03 de Setembro de 2026
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-wedding-text">
                Nome completo *
              </label>
              <Input
                id="name"
                placeholder="Ex: Maria Silva"
                {...register("name", { required: "Nome é obrigatório" })}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-medium text-wedding-text">
                WhatsApp *
              </label>
              <Input
                id="phone"
                placeholder="(00) 00000-0000"
                {...register("phone", { 
                  required: "Telefone é obrigatório",
                  onChange: (e) => {
                    e.target.value = formatPhone(e.target.value)
                  }
                })}
                maxLength={15}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-sm font-medium text-wedding-text block">
                Você poderá comparecer? *
              </label>
              <div className="flex flex-col space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-md border border-wedding-secondary/20 hover:bg-wedding-muted/50 transition-colors">
                  <input
                    type="radio"
                    value="yes"
                    {...register("attending", { required: "Selecione uma opção" })}
                    className="h-4 w-4 text-wedding-primary focus:ring-wedding-primary"
                  />
                  <span className="text-sm font-medium">Confirmo presença 🎉</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-md border border-wedding-secondary/20 hover:bg-wedding-muted/50 transition-colors">
                  <input
                    type="radio"
                    value="no"
                    {...register("attending", { required: "Selecione uma opção" })}
                    className="h-4 w-4 text-wedding-primary focus:ring-wedding-primary"
                  />
                  <span className="text-sm font-medium">Não poderei comparecer 😢</span>
                </label>
              </div>
              {errors.attending && (
                <p className="text-xs text-red-500 mt-1">{errors.attending.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-4 group"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Enviando..."
              ) : (
                <>
                  Confirmar Presença
                  <Heart className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
