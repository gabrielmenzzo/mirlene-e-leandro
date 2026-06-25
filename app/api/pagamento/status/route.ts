import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 })
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json({ error: "No Access Token" }, { status: 500 })
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch from MP" }, { status: 500 })
    }

    const payment = await response.json()

    return NextResponse.json({ status: payment.status })
  } catch (error) {
    console.error("Error fetching payment status:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
