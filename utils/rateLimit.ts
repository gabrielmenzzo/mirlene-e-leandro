type RateLimitInfo = {
  count: number
  lastReset: number
}

const store = new Map<string, RateLimitInfo>()

export function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now()
  const info = store.get(identifier)

  if (!info) {
    store.set(identifier, { count: 1, lastReset: now })
    return true
  }

  if (now - info.lastReset > windowMs) {
    // Reset window
    store.set(identifier, { count: 1, lastReset: now })
    return true
  }

  if (info.count >= limit) {
    return false
  }

  info.count += 1
  return true
}
