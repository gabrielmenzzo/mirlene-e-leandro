import { NextRequest, NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"
import { rateLimit } from "@/utils/rateLimit"

const MIN_AMOUNT = 1
const MAX_AMOUNT = 10000

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    if (!rateLimit(ip, 15, 60000)) {
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

    const client = new MercadoPagoConfig({ accessToken })

    const body = await request.json()
    const { giftName, giftPrice } = body

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

    const safeName = giftName.slice(0, 100)
    const safeDescription = "Presente de casamento"

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: [
          {
            id: "gift-pref",
            title: safeName,
            description: safeDescription,
            unit_price: amount,
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
        external_reference: `gift-${Date.now()}`,
      },
    })

    return NextResponse.json({
      preferenceId: result.id,
    })
  } catch (error) {
    console.error("Erro ao criar preferência")

    return NextResponse.json(
      { error: "Erro ao criar preferência de pagamento" },
      { status: 500 }
    )
  }
}
