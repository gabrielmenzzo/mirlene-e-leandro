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
    const { giftName, giftPrice } = body

    if (!giftName || !giftPrice) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const preference = await mercadopago.preferences.create({
      items: [
        {
          title: giftName,
          description: "Presente de casamento",
          unit_price: Number(giftPrice),
          quantity: 1,
          currency_id: "BRL",
        },
      ],
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
      },
      notification_url: `${baseUrl}/api/webhook`,
      external_reference: giftName,
    })

    return NextResponse.json({
      preferenceId: preference.body.id,
    })
  } catch (error) {
    console.error("Erro ao criar preferência:", error)

    return NextResponse.json(
      { error: "Erro ao criar preferência de pagamento" },
      { status: 500 }
    )
  }
}