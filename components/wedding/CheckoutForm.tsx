"use client"

import { initMercadoPago, CardPayment, StatusScreen } from "@mercadopago/sdk-react"
import { useEffect, useState, useMemo, useCallback } from "react"

interface CheckoutFormProps {
  giftName: string
  giftPrice: number
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
  onBack: () => void
}

interface PaymentResult {
  status: string
  status_detail?: string
  id?: number
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
  const [createdPaymentId, setCreatedPaymentId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | null>(null)

  const paymentInitialization = useMemo(() => {
    return {
      amount: giftPrice,
    }
  }, [giftPrice])

  const paymentCustomization = useMemo(() => ({
    visual: {
      style: {
        theme: "default" as const,
      },
    },
    paymentMethods: {
      creditCard: ["master", "visa", "elo", "amex"] as any,
    },
  }), [])

  const handleReady = useCallback(() => {
    console.log("Payment brick ready")
  }, [])

  const handleError = useCallback((error: unknown) => {
    console.error("Payment error:", error)
    const err = error as { message?: string }
    onError(err.message || "Erro no pagamento")
  }, [onError])

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
    if (publicKey) {
      initMercadoPago(publicKey, { locale: "pt-BR" })
      setIsReady(true)
    } else {
      console.error("Public key não encontrada no env")
      onError("Configuração de pagamento indisponível")
    }
  }, [onError])

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

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Erro na API preference:", errorData)
          onError(errorData.error || "Erro ao criar preferência")
          return
        }

        const data = await response.json()
        if (data.preferenceId) {
          setPreferenceId(data.preferenceId)
        } else {
          onError("Erro ao criar preferência de pagamento")
        }
      } catch (err) {
        console.error("Erro ao criar preferência:", err)
        onError("Erro ao iniciar pagamento")
      }
    }

    if (isReady && giftName && giftPrice) {
      createPreference()
    }
  }, [isReady, giftName, giftPrice, onError])

  const handlePaymentSubmit = async (param: any): Promise<void> => {
    setIsProcessing(true)
    
    // O Payment Brick do Mercado Pago envia um objeto com { selectedPaymentMethod, formData }
    const actualFormData = param.formData || param
    
    try {
      const response = await fetch("/api/pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentData: {
            paymentMethodId: actualFormData.payment_method_id || param.selectedPaymentMethod,
            token: actualFormData.token,
            cardIssuerId: actualFormData.issuer_id,
            installments: actualFormData.installments,
            payer: actualFormData.payer,
          },
          giftName,
          giftPrice,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorData: any = {}
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          console.error("Não foi possível parsear o erro como JSON:", errorText)
        }
        console.error("Erro na API pagamento:", errorData, "Status:", response.status, "Raw:", errorText)
        onError(errorData.error || "Erro ao processar pagamento")
        throw new Error(errorData.error || "Erro ao processar pagamento")
      }

      const data: PaymentResult = await response.json()
      console.log("Payment response:", data)

      if (data.status === "approved" || data.status === "pending" || data.status === "in_process") {
        if (data.status === "approved") {
          setTimeout(() => onSuccess(String(data.id)), 3000)
        } else if (data.status === "pending" || data.status === "in_process") {
          setCreatedPaymentId(String(data.id))
        }
        return // Resolve promise para o Brick

      } else {
        onError(data.status_detail || "Pagamento não aprovado")
        throw new Error("Pagamento não aprovado")
      }
    } catch (err) {
      console.error("Erro no pagamento:", err)
      onError("Erro ao processar pagamento")
      throw err
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFastPix = async () => {
    setIsProcessing(true)
    
    try {
      const response = await fetch("/api/pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentData: {
            paymentMethodId: "pix",
            payer: { email: "pix@casamento.com" }, // E-mail genérico para pular formulário
          },
          giftName,
          giftPrice,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorData: any = {}
        try { errorData = JSON.parse(errorText) } catch (e) { }
        onError(errorData.error || "Erro ao processar pagamento")
        return
      }

      const data: PaymentResult = await response.json()
      if (data.status === "pending" || data.status === "in_process") {
        setCreatedPaymentId(String(data.id))
      } else {
        onError(data.status_detail || "Falha ao gerar PIX")
      }
    } catch (err) {
      console.error("Erro no Fast PIX:", err)
      onError("Erro ao processar PIX")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-wedding-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-wedding-secondary">Carregando pagamento...</p>
      </div>
    )
  }

  if (!preferenceId) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-wedding-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-wedding-secondary">Criando preferência...</p>
      </div>
    )
  }

  if (createdPaymentId) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => onSuccess(createdPaymentId)}
          className="text-wedding-secondary hover:text-wedding-primary transition-colors text-sm flex items-center gap-1 cursor-pointer mb-4"
        >
          ← Fechar e voltar
        </button>
        <div className="bg-white rounded-lg p-4 border border-wedding-secondary/20">
          <StatusScreen
            initialization={{
              paymentId: createdPaymentId,
            }}
            onReady={() => console.log("StatusScreen ready")}
            onError={(error: unknown) => console.error("StatusScreen error", error)}
          />
        </div>
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

      {!paymentMethod && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleFastPix}
            className="border-2 border-wedding-primary/20 bg-white hover:border-wedding-primary hover:bg-wedding-primary/5 p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group"
          >
            <div className="w-12 h-12 bg-wedding-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wedding-primary"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 14v6"/><path d="M4 17v3h16v-3"/><path d="M12 4v4"/><path d="M7 10h10v4H7z"/></svg>
            </div>
            <span className="font-semibold text-wedding-text">Gerar PIX</span>
            <span className="text-xs text-wedding-secondary">Aprovação imediata</span>
          </button>

          <button
            onClick={() => setPaymentMethod("card")}
            className="border-2 border-wedding-secondary/20 bg-white hover:border-wedding-secondary hover:bg-wedding-secondary/5 p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group"
          >
            <div className="w-12 h-12 bg-wedding-secondary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wedding-secondary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </div>
            <span className="font-semibold text-wedding-text">Cartão de Crédito</span>
            <span className="text-xs text-wedding-secondary">Até 12x</span>
          </button>
        </div>
      )}

      {paymentMethod === "card" && (
        <div className="space-y-4">
          <button
            onClick={() => setPaymentMethod(null)}
            className="text-wedding-secondary hover:text-wedding-primary text-sm flex items-center gap-1"
          >
            ← Trocar método
          </button>
          <div className="bg-white rounded-lg p-4 border border-wedding-secondary/20 min-h-[400px]">
            {paymentInitialization && (
              <CardPayment
                initialization={paymentInitialization}
                onSubmit={handlePaymentSubmit}
                onReady={handleReady}
                onError={handleError}
                customization={paymentCustomization as any}
              />
            )}
          </div>
        </div>
      )}

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
