import { create } from "axios";
import { io } from "socket.io-client";
import { useAuth } from "../../stores/auth-store";
import { NOTIFICATIONS_NAMESPACE } from "./paths";

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

//configuracion de SocketIO Client (websockets)

//el namespace de notificaciones no usa el prefijo global del servicio (/rent-financial)
//el token se envia sin prefijo "Bearer" y se crea el socket solo cuando ya existe sesion
export const createNotificationSocket = (token: string) =>
    io(`${BASE_URL}/${NOTIFICATIONS_NAMESPACE}`, {
        auth: { token },
        transports: ["websocket"],
    });
