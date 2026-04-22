import { NextRequest, NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { rateLimit } from "@/utils/rateLimit"

const MIN_AMOUNT = 1
const MAX_AMOUNT = 10000

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    if (!rateLimit(ip, 10, 60000)) {
      return NextResponse.json(
        { error: "Muitas requisições. Tente novamente em 1 minuto." },
        { status: 429 }
      )
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json(
        { error: "Configuração de pagamento indisponível" },
        { status: 500 }
      )
    }

    const client = new MercadoPagoConfig({
      accessToken,
    })

    const body = await request.json()
    const { paymentData, giftName, giftPrice } = body

    if (!giftName || typeof giftName !== "string" || !giftPrice) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      )
    }

    const amount = Number(giftPrice)
    if (isNaN(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return NextResponse.json(
        { error: `Valor inválido. Máximo: R$ ${MAX_AMOUNT}` },
        { status: 400 }
      )
    }

    const payerEmail = paymentData.payer?.email
    if (payerEmail && typeof payerEmail === "string" && !validateEmail(payerEmail)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    const payment = new Payment(client)

    const paymentMethodId = paymentData?.paymentMethodId

    const paymentBody: Record<string, unknown> = {
      transaction_amount: amount,
      description: `Presente de casamento: ${giftName.slice(0, 100)}`,
      payer: {
        email: payerEmail || "guest@example.com",
        ...(paymentData.payer || {})
      },
    }

    if (paymentMethodId && typeof paymentMethodId === "string") {
      paymentBody.payment_method_id = paymentMethodId
    }

    if (paymentData?.token && typeof paymentData.token === "string") {
      paymentBody.token = paymentData.token.slice(0, 100)
    }

    if (paymentData?.cardIssuerId) {
      paymentBody.issuer_id = String(paymentData.cardIssuerId)
    }

    if (paymentData?.installments) {
      const parsedInstallments = Number(paymentData.installments)
      if (!isNaN(parsedInstallments)) {
        paymentBody.installments = Math.min(Math.max(parsedInstallments, 1), 12)
      }
    }

    const result = await payment.create({
      body: paymentBody,
    })

    const responseData = {
      status: result.status,
      status_detail: result.status_detail,
      id: result.id,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Erro no pagamento:", error)

    let errorDetail = "internal_error"
    if (error instanceof Error) {
      errorDetail = error.message
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorDetail = String(error.message)
    }

    return NextResponse.json(
      { error: "Erro ao processar pagamento", status_detail: errorDetail, details: error },
      { status: 500 }
    )
  }
}
