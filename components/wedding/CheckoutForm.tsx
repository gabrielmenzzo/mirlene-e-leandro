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

  const MP_FEE_14_DAYS = 0.0449; // Taxa Mercado Pago de 4,49% para receber em 14 dias

  const cardPrice = useMemo(() => {
    return Number((giftPrice / (1 - MP_FEE_14_DAYS)).toFixed(2));
  }, [giftPrice]);

  const paymentInitialization = useMemo(() => {
    return {
      amount: paymentMethod === "card" ? cardPrice : giftPrice,
    }
  }, [giftPrice, paymentMethod, cardPrice])

  const paymentCustomization = useMemo(() => ({
    visual: {
      style: {
        theme: "default" as const,
      },
    },
    paymentMethods: {
      maxInstallments: 12,
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

  const [checkoutStep, setCheckoutStep] = useState<"message" | "payment_method">("message")
  const [senderName, setSenderName] = useState("")
  const [guestMessage, setGuestMessage] = useState("")
  const generatePix = async () => {
    setPaymentMethod("pix")
    setIsProcessing(true)
    
    try {
      const response = await fetch("/api/pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentData: {
            paymentMethodId: "pix",
            payer: { email: "guest@example.com" },
          },
          giftName,
          giftPrice,
          metadata: {
            sender_name: senderName,
            guest_message: guestMessage,
            gift_name: giftName,
          }
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorData: any = {}
        try { errorData = JSON.parse(errorText) } catch (e) { }
        onError(errorData.error || "Erro ao gerar PIX")
        return
      }

      const data: PaymentResult = await response.json()
      
      if (data.status === "pending" || data.status === "approved" || data.status === "in_process") {
        setCreatedPaymentId(String(data.id))
      } else {
        onError(data.status_detail || "Erro ao gerar PIX")
      }
    } catch (err) {
      console.error("Erro no PIX:", err)
      onError("Erro ao gerar PIX. Tente novamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentSubmit = async (param: any): Promise<void> => {
    setIsProcessing(true)
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
          giftPrice: paymentMethod === "card" ? cardPrice : giftPrice,
          metadata: {
            sender_name: senderName,
            guest_message: guestMessage,
            gift_name: giftName,
          }
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorData: any = {}
        try { errorData = JSON.parse(errorText) } catch (e) { }
        onError(errorData.error || "Erro ao processar pagamento")
        throw new Error(errorData.error || "Erro ao processar pagamento")
      }

      const data: PaymentResult = await response.json()
      
      if (data.status === "approved" || data.status === "pending" || data.status === "in_process") {
        
        // Enviar o e-mail em background se for aprovado (Cartão de Crédito)
        try {
          await fetch("/api/card-message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              senderName,
              guestMessage,
              giftName,
              giftPrice,
              cardPaidPrice: paymentMethod === "card" ? cardPrice : giftPrice,
            })
          });
        } catch (emailErr) {
          console.error("Erro ao enviar e-mail de mensagem do cartão", emailErr);
          // Nao bloqueia o fluxo
        }

        if (data.status === "approved") {
          setTimeout(() => onSuccess(String(data.id)), 3000)
        } else {
          setCreatedPaymentId(String(data.id))
        }
        return
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
            initialization={{ paymentId: createdPaymentId }}
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
        onClick={checkoutStep === "payment_method" ? () => setCheckoutStep("message") : onBack}
        className="text-wedding-secondary hover:text-wedding-primary transition-colors text-sm flex items-center gap-1 cursor-pointer"
      >
        ← Voltar
      </button>

      <div className="bg-wedding-muted/30 rounded-lg p-4 mb-4">
        <p className="text-sm text-wedding-secondary">Presentear com:</p>
        <p className="font-cormorant text-lg font-semibold text-wedding-text">{giftName}</p>
        <p className="text-xl font-medium text-wedding-primary">
          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(paymentMethod === "card" ? cardPrice : giftPrice)}
        </p>
      </div>

      {checkoutStep === "message" && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="space-y-2">
            <h3 className="font-cormorant text-2xl font-semibold text-wedding-text text-center">Deixe seu carinho</h3>
            <p className="text-sm text-wedding-secondary text-center">Os noivos adorarão ler sua mensagem junto com o presente!</p>
          </div>
          
          <div className="space-y-4 bg-white p-5 rounded-xl border border-wedding-secondary/20 shadow-sm">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-wedding-text">Seu Nome / Nome do Casal *</label>
              <input 
                type="text" 
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Como quer ser lembrado(a)?" 
                className="w-full px-4 py-3 rounded-lg border border-wedding-secondary/20 focus:outline-none focus:ring-2 focus:ring-wedding-primary/50 focus:border-wedding-primary transition-all bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-wedding-text">Mensagem aos Noivos *</label>
              <textarea 
                value={guestMessage}
                onChange={(e) => setGuestMessage(e.target.value)}
                placeholder="Escreva algumas palavras para o casal..." 
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-wedding-secondary/20 focus:outline-none focus:ring-2 focus:ring-wedding-primary/50 focus:border-wedding-primary transition-all bg-white resize-none"
              />
            </div>
          </div>

          <button
            onClick={() => setCheckoutStep("payment_method")}
            disabled={!senderName.trim() || !guestMessage.trim()}
            className="w-full bg-wedding-primary hover:bg-wedding-primary/90 disabled:bg-wedding-secondary/30 disabled:cursor-not-allowed text-white text-lg font-medium py-4 rounded-xl shadow-md transition-all flex justify-center items-center"
          >
            Continuar para Pagamento
          </button>
        </div>
      )}

      {checkoutStep === "payment_method" && !paymentMethod && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="font-cormorant text-xl font-semibold text-wedding-text text-center mb-4">Como deseja pagar?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={generatePix}
              disabled={isProcessing}
              className="border-2 border-wedding-primary/20 bg-white hover:border-wedding-primary hover:bg-wedding-primary/5 p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group disabled:opacity-50"
            >
              <div className="w-12 h-12 bg-wedding-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wedding-primary"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 14v6"/><path d="M4 17v3h16v-3"/><path d="M12 4v4"/><path d="M7 10h10v4H7z"/></svg>
              </div>
              <span className="font-semibold text-wedding-text">Pagar com PIX</span>
            </button>

            <button
              onClick={() => setPaymentMethod("card")}
              className="border-2 border-wedding-secondary/20 bg-white hover:border-wedding-secondary hover:bg-wedding-secondary/5 p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-all group"
            >
              <div className="w-12 h-12 bg-wedding-secondary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-wedding-secondary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
              <span className="font-semibold text-wedding-text text-center">Cartão de Crédito</span>
              <span className="text-xs text-wedding-secondary text-center">Até 12x (+ taxa Mercado Pago)</span>
            </button>
          </div>
        </div>
      )}

      {checkoutStep === "payment_method" && paymentMethod === "card" && (
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
