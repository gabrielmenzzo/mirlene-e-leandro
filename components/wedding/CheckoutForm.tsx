"use client"

import { initMercadoPago, Payment } from "@mercadopago/sdk-react"
import { useEffect, useState } from "react"

interface CheckoutFormProps {
  giftName: string
  giftPrice: number
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
  onBack: () => void
}

export default function CheckoutForm({
  giftName,
  giftPrice,
  onSuccess,
  onError,
  onBack,
}: CheckoutFormProps) {
  const [isReady, setIsReady] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [preferenceId, setPreferenceId] = useState<string | null>(null)

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
    if (publicKey) {
      initMercadoPago(publicKey)
      setIsReady(true)
    }
  }, [])

  useEffect(() => {
    async function createPreference() {
      try {
        const response = await fetch("/api/pagamento/preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            giftName,
            giftPrice,
          }),
        })

        const data = await response.json()
        if (data.preferenceId) {
          setPreferenceId(data.preferenceId)
        } else {
          onError("Erro ao criar preferência de pagamento")
        }
      } catch {
        onError("Erro ao iniciar pagamento")
      }
    }

    if (isReady && giftName && giftPrice) {
      createPreference()
    }
  }, [isReady, giftName, giftPrice, onError])

  const handleSubmit = async (formData: unknown) => {
    setIsProcessing(true)

    try {
      const response = await fetch("/api/pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentData: formData,
          giftName,
          giftPrice,
        }),
      })

      const data = await response.json()

      if (response.ok && data.status === "approved") {
        onSuccess(data.id)
      } else if (data.status === "pending" || data.status === "in_process") {
        onSuccess(data.id)
      } else {
        onError(data.status_detail || "Pagamento não aprovado")
      }
    } catch {
      onError("Erro ao processar pagamento")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isReady || !preferenceId) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-wedding-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-wedding-secondary">Carregando pagamento...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-wedding-secondary hover:text-wedding-primary transition-colors text-sm flex items-center gap-1 cursor-pointer"
      >
        ← Voltar
      </button>

      <div className="bg-wedding-muted/30 rounded-lg p-4 mb-4">
        <p className="text-sm text-wedding-secondary">Presentear com:</p>
        <p className="font-cormorant text-lg font-semibold text-wedding-text">{giftName}</p>
        <p className="text-xl font-medium text-wedding-primary">
          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(giftPrice)}
        </p>
      </div>

      <div className="bg-white rounded-lg p-4 border border-wedding-secondary/20">
        <Payment
          initialization={{ preferenceId }}
          onSubmit={handleSubmit}
          customization={{
            paymentMethods: {
              creditCard: ["master", "visa", "elo", "amex", "hipercard"],
              debitCard: ["master", "visa", "elo"],
              bankTransfer: ["pix"],
            },
            visual: {
              style: {
                customVariables: {
                  primaryColor: "#8b6f5c",
                  secondaryColor: "#f5f0eb",
                },
              },
            },
          }}
        />
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-wedding-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-wedding-text font-medium">Processando pagamento...</p>
          </div>
        </div>
      )}
    </div>
  )
}