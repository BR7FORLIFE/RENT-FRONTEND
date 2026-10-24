import { create, default as axios, isAxiosError, type InternalAxiosRequestConfig } from "axios";
import { io } from "socket.io-client";
import { useAuth } from "../../stores/auth-store";
import { AUTHPATHS, NOTIFICATIONS_NAMESPACE } from "./paths";

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = create({
    baseURL: BASE_URL,
});

//interceptores de request

//inyectamos el access token a las peticiones
api.interceptors.request.use((config) => {
    const accessToken = useAuth.getState().accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

//interceptor de response: ante un 401 intenta renovar el access token una vez
//y reintenta la peticion; si no se puede, cierra la sesion
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshing: Promise<string | null> | null = null;

async function renewAccessToken(): Promise<string | null> {
    //import dinamico para evitar dependencias circulares con auth.service
    const { getUserCredentials } = await import("../../scripts/credentials");
    const { userId, refreshToken } = await getUserCredentials();
    if (!userId || !refreshToken) return null;

    //instancia sin interceptores para no entrar en bucle
    const { data } = await axios.post<{ accessToken: string | null }>(
        `${BASE_URL}${AUTHPATHS.refresh}`,
        { userId, refreshToken },
    );
    return data.accessToken;
}

api.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        if (!isAxiosError(error) || error.response?.status !== 401) {
            throw error;
        }

        const config = error.config as RetryConfig | undefined;
        const isAuthRoute = config?.url?.startsWith("/rent-auth/");
        if (!config || config._retry || isAuthRoute) throw error;
        config._retry = true;

        try {
            refreshing ??= renewAccessToken().finally(() => {
                refreshing = null;
            });
            const accessToken = await refreshing;
            if (!accessToken) throw error;

            useAuth.getState().setAccessToken(accessToken);
            config.headers.Authorization = `Bearer ${accessToken}`;
            return api(config);
        } catch {
            useAuth.getState().logout();
            throw error;
        }
    },
);

//configuracion de SocketIO Client (websockets)

//el namespace de notificaciones no usa el prefijo global del servicio (/rent-financial)
//el token se envia sin prefijo "Bearer" y se crea el socket solo cuando ya existe sesion
export const createNotificationSocket = (token: string) =>
    io(`${BASE_URL}/${NOTIFICATIONS_NAMESPACE}`, {
        auth: { token },
        transports: ["websocket"],
    });
