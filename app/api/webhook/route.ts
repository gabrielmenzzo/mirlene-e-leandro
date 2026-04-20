import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type !== "payment") {
      return NextResponse.json({ received: true })
    }

    const paymentId = data?.id

    if (!paymentId) {
      return NextResponse.json({ received: true })
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
      console.error("MERCADOPAGO_ACCESS_TOKEN não configurado")
      return NextResponse.json({ received: true })
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      console.error("Erro ao consultar pagamento no Mercado Pago")
      return NextResponse.json({ received: true })
    }

    const payment = await response.json()

    console.log("Pagamento confirmado:", {
      id: payment.id,
      status: payment.status,
      description: payment.description,
    })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Erro no webhook:", error)
    return NextResponse.json({ received: true })
  }
}