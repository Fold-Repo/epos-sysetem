import { clearCookie } from './cookies'
import { AUTH_TOKEN_KEY, EMAIL_ADDRESS_KEY } from '@/types'
import { clearAuth, clearPermissions, persistor, store } from '@/store'

/**
 * Logout utility function
 * Clears all auth state, cookies, and Redux persist storage
 */
export const logout = async () => {
    // ==============================
    // Clear Redux auth state
    // ==============================
    store.dispatch(clearAuth())
    
    // ==============================
    // Clear Redux permissions state
    // ==============================
    store.dispatch(clearPermissions())
    
    // ==============================
    // Clear Redux persist storage
    // ==============================
    await persistor.purge()

    // ==============================
    // Clear specific auth cookies
    // ==============================
    clearCookie(AUTH_TOKEN_KEY)
    clearCookie(EMAIL_ADDRESS_KEY)
}
