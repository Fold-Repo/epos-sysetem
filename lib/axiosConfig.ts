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
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getCookie(AUTH_TOKEN_KEY);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Add request interceptor to client as well
client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getCookie(AUTH_TOKEN_KEY);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {

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