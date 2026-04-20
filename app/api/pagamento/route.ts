import { NextRequest, NextResponse } from "next/server"
import mercadopago from "mercadopago"

export async function POST(request: NextRequest) {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json(
        { error: "Configuração de pagamento indisponível" },
        { status: 500 }
      )
    }

    mercadopago.configure({
      access_token: accessToken,
    })

    const body = await request.json()
    const { paymentData, giftName, giftPrice } = body

    if (!paymentData || !giftName || !giftPrice) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      )
    }

    const paymentDataMp = {
      transaction_amount: Number(giftPrice),
      description: `Presente de casamento: ${giftName}`,
      payment_method_id: paymentData.paymentMethodId,
      payer: {
        email: paymentData.payer?.email || "guest@example.com",
      },
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/webhook`,
    }

    const result = await mercadopago.payment.create(paymentDataMp)

    const responseData = {
      status: result.body.status,
      status_detail: result.body.status_detail,
      id: result.body.id,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Erro no pagamento:", error)

    return NextResponse.json(
      { error: "Erro ao processar pagamento", status_detail: "internal_error" },
      { status: 500 }
    )
  }
}