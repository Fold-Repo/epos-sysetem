const STRIPE_SUCCESS_PENDING_KEY = 'stripe_onboarding_success_pending'
const STRIPE_SUCCESS_PENDING_TTL_MS = 10 * 60 * 1000 // 10 minutes

type StripeSuccessPendingPayload = {
    pending?: boolean
    ts?: number
    token?: string
}

export function createStripeOneTimeToken(): string {
    const cryptoObj = typeof window !== 'undefined' ? window.crypto : undefined
    if (cryptoObj?.randomUUID) return cryptoObj.randomUUID()

    // Fallback: best-effort pseudo-random string. (Only used client-side.)
    try {
        const bytes = cryptoObj?.getRandomValues ? cryptoObj.getRandomValues(new Uint8Array(16)) : null
        if (!bytes) return String(Date.now())
        return Array.from(bytes)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
    } catch {
        return String(Date.now())
    }
}

export function buildStripeOnboardingReturnUrl(origin: string, token: string): string {
    return `${origin}/dashboard?success=true&token=${encodeURIComponent(token)}`
}

export function markStripeOnboardingSuccessPending(token: string): void {
    try {
        window.localStorage.setItem(
            STRIPE_SUCCESS_PENDING_KEY,
            JSON.stringify({ pending: true, ts: Date.now(), token }),
        )
    } catch {
        // ignore storage issues
    }
}

export function clearStripeOnboardingSuccessPending(): void {
    try {
        window.localStorage.removeItem(STRIPE_SUCCESS_PENDING_KEY)
    } catch {
        // ignore
    }
}

export function shouldOpenStripeOnboardingSuccessModal(params: {
    onboardingSuccess: boolean
    tokenQuery: string | null
    stripeOnboardingCompleted: boolean
    nowMs?: number
    ttlMs?: number
}): boolean {
    const { onboardingSuccess, tokenQuery, stripeOnboardingCompleted } = params
    if (!onboardingSuccess) return false
    if (!stripeOnboardingCompleted) return false
    if (!tokenQuery) return false

    const ttlMs = params.ttlMs ?? STRIPE_SUCCESS_PENDING_TTL_MS
    const nowMs = params.nowMs ?? Date.now()

    try {
        const raw = window.localStorage.getItem(STRIPE_SUCCESS_PENDING_KEY)
        if (!raw) return false
        const parsed = JSON.parse(raw) as StripeSuccessPendingPayload | null

        const pending = parsed?.pending
        const ts = parsed?.ts
        const storedToken = parsed?.token

        if (pending !== true) return false
        if (typeof ts !== 'number') return false
        if (storedToken !== tokenQuery) return false

        return nowMs - ts <= ttlMs
    } catch {
        return false
    }
}

