import axios, { AxiosHeaders, type AxiosError, type AxiosInstance } from "axios";

// Base API configuration tailored for Laravel Sanctum token/bearer auth
const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL as string | undefined
)?.replace(/\/$/, "") || "http://localhost:8000";

const API_PREFIX = "/api";
const TOKEN_STORAGE_KEY = "auth_token";
let memoryToken: string | null = null;

const loadToken = () => {
    if (memoryToken) return memoryToken;
    const stored = typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
    memoryToken = stored ?? null;
    return memoryToken;
};

export const setAuthToken = (token: string | null) => {
    memoryToken = token;
    if (typeof window === "undefined") return;
    if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
};

export const api: AxiosInstance = axios.create({
    baseURL: `${API_BASE_URL}${API_PREFIX}`,
    withCredentials: true,
    headers: {
        Accept: "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = loadToken();
    if (token && !config.headers?.Authorization) {
        const headers = config.headers instanceof AxiosHeaders
            ? config.headers
            : AxiosHeaders.from(config.headers ?? {});

        headers.set("Authorization", `Bearer ${token}`);
        config.headers = headers;
    }
    // Keep cookies enabled for Sanctum CSRF and session support when needed
    config.withCredentials ??= true;
    return config;
});

export const fetchCsrfCookie = () =>
    axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
    });

export type ApiError = AxiosError<{
    message?: string;
    errors?: Record<string, string[]>;
}>;
