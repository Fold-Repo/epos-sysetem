import { API_BASE_URL } from "@/constants";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "@/utils/cookies";
import { AUTH_TOKEN_KEY } from "@/types";

const baseURL = API_BASE_URL

const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const client = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
})

// ===============================================
// Set once from app Providers so `x-store-id` always matches Redux (including after persist rehydrate), without racing SideBar useEffect.
// ===============================================
let getSelectedStoreIdFromRedux: (() => string | null) | null = null

// ===============================================
// Register the getter function to get the selected store ID from Redux
// ===============================================
export function registerReduxSelectedStoreIdGetter(getter: () => string | null) {
    getSelectedStoreIdFromRedux = getter
}

client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        
        const token = getCookie(AUTH_TOKEN_KEY);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const storeId =
            getSelectedStoreIdFromRedux?.() ??
            client.defaults.headers.common['x-store-id']
        if (storeId) {
            config.headers['x-store-id'] = storeId as string
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const status = error.response?.status;
        
        if (status === 401) {
            // ==============================
            // Clear all auth state and cookies
            // ==============================
            const { logout } = await import('@/utils');
            await logout();

            const callbackUrl = window.location.pathname || "/";
            window.location.href = `/?callbackUrl=${encodeURIComponent(callbackUrl)}`;
        }

        return Promise.reject(error);
    }
);

export default apiClient;