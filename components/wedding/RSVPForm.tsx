"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { motion } from "motion/react"
import confetti from "canvas-confetti"
import { Heart, Gift } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"

type RSVPFormData = {
  name: string
  phone: string
  attending: "yes" | "no"
}

/** Client-side sanitisation — defence-in-depth (server also sanitises) */
function sanitizeInput(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"'`]/g, "")
    .trim()
}

export function RSVPForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [submittedName, setSubmittedName] = React.useState("")
  const [submittedAttending, setSubmittedAttending] = React.useState<"yes" | "no">("yes")
  const [errorMessage, setErrorMessage] = React.useState("")

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
    setErrorMessage("")

    // Client-side sanitisation
    const sanitizedData = {
      name: sanitizeInput(data.name),
      phone: sanitizeInput(data.phone),
      attending: data.attending === "yes" ? "yes" : "no",
    }

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      })

      const result = await res.json()

      if (!res.ok) {
        setErrorMessage(result.error || "Erro ao enviar. Tente novamente.")
        setIsSubmitting(false)
        return
      }

      setSubmittedName(sanitizedData.name.split(" ")[0])
      setSubmittedAttending(sanitizedData.attending as "yes" | "no")
      setIsSuccess(true)

      if (sanitizedData.attending === "yes") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#B89C6D", "#E6D5B8", "#8A7B66"],
        })
      }

      reset()
    } catch {
      setErrorMessage("Erro de conexão. Verifique sua internet e tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
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
              {submittedAttending === "yes"
                ? "Confira abaixo a lista de presentes do casal."
                : "Sua resposta foi registrada. Sentiremos sua falta!"}
            </p>
            <Link href="/presente" className="mt-6 inline-block">
              <Button
                variant="default"
                className="cursor-pointer group"
              >
                <Gift className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Ver Lista de Presentes
              </Button>
            </Link>
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-wedding-text">
                Nome completo *
              </label>
              <Input
                id="name"
                placeholder="Ex: Maria Silva"
                autoComplete="name"
                {...register("name", {
                  required: "Nome é obrigatório",
                  minLength: { value: 2, message: "Nome deve ter pelo menos 2 caracteres" },
                  maxLength: { value: 120, message: "Nome deve ter no máximo 120 caracteres" },
                  validate: (v) =>
                    sanitizeInput(v).length >= 2 || "Nome inválido",
                })}
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
                inputMode="tel"
                autoComplete="tel"
                {...register("phone", { 
                  required: "Telefone é obrigatório",
                  validate: (v) => {
                    const digits = v.replace(/\D/g, "")
                    return (digits.length >= 10 && digits.length <= 11) || "Número de telefone inválido"
                  },
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

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3"
              >
                {errorMessage}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full mt-4 group cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enviando...
                </span>
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
