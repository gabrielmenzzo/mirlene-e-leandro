import { NextRequest, NextResponse } from "next/server"

// ─── Sanitization Helpers ───────────────────────────────────────────────────

/** Strip HTML/script tags and trim whitespace */
function sanitize(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")   // strip HTML tags
    .replace(/[<>"'`]/g, "")   // strip remaining dangerous chars
    .trim()
}

/** Validate Brazilian phone: (XX) XXXXX-XXXX or (XX) XXXX-XXXX */
function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "")
  return digits.length >= 10 && digits.length <= 11
}

// ─── Rate Limiting (in-memory, per-IP, per-deploy) ──────────────────────────

const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5        // max requests…
const RATE_WINDOW = 60_000  // …per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT
}

// ─── POST Handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1) Rate limit
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em breve." },
      { status: 429 }
    )
  }

  // 2) Parse & validate body
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido." },
      { status: 400 }
    )
  }

  const { name, phone, attending } = body as {
    name?: string
    phone?: string
    attending?: string
  }

  // Required fields
  if (!name || !phone || !attending) {
    return NextResponse.json(
      { error: "Todos os campos são obrigatórios." },
      { status: 400 }
    )
  }

  // Type check
  if (
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof attending !== "string"
  ) {
    return NextResponse.json(
      { error: "Dados com formato inválido." },
      { status: 400 }
    )
  }

  // Sanitize
  const safeName = sanitize(name)
  const safePhone = sanitize(phone)
  const safeAttending = attending === "yes" ? "yes" : "no"

  // Post-sanitization validation
  if (safeName.length < 2 || safeName.length > 120) {
    return NextResponse.json(
      { error: "Nome deve ter entre 2 e 120 caracteres." },
      { status: 400 }
    )
  }

  if (!isValidPhone(safePhone)) {
    return NextResponse.json(
      { error: "Número de telefone inválido." },
      { status: 400 }
    )
  }

  // 3) Forward to Make webhook (URL never leaves the server)
  const webhookUrl = process.env.MAKE_WEBHOOK_URL
  if (!webhookUrl) {
    console.error("[RSVP] MAKE_WEBHOOK_URL is not configured")
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    )
  }

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: safeName,
        phone: safePhone,
        attending: safeAttending,
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10_000), // 10s timeout
    })

    if (!webhookResponse.ok) {
      console.error(
        "[RSVP] Webhook error:",
        webhookResponse.status,
        await webhookResponse.text().catch(() => "")
      )
      return NextResponse.json(
        { error: "Erro ao registrar resposta. Tente novamente." },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[RSVP] Webhook fetch failed:", err)
    return NextResponse.json(
      { error: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 502 }
    )
  }
}
