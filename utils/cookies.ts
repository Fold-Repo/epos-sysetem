const isBrowser = () => typeof window !== 'undefined'

// ==============================
// Generic Reusable Cookie Functions
// ==============================
export const setCookie = (key: string, value: string, maxAge: number = 60 * 60 * 24 * 7) => {
    if (!isBrowser()) return
    document.cookie = `${key}=${value}; path=/; max-age=${maxAge}`
}

export const getCookie = (key: string): string | null => {
    if (!isBrowser()) return null
    const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'))
    return match ? match[2] : null
}

export const clearCookie = (key: string) => {
    if (!isBrowser()) return
    document.cookie = `${key}=; path=/; max-age=0`
}

// ==============================
// Clear All Auth Cookies
// ==============================
export const clearAllAuthCookies = () => {
    if (!isBrowser()) return
    const cookies = document.cookie.split(';')
    cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
        if (name) {
            document.cookie = `${name}=; path=/; max-age=0`
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
    })
}


