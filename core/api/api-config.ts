import { create } from "axios";
import { io } from "socket.io-client";
import { useAuth } from "../../stores/auth-store";
import { FINANCIAL_MODULE } from "./paths";

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = create({
    baseURL: BASE_URL,
});

const ACCESS_TOKEN = useAuth.getState().accessToken;

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

export const notificationSocket = io(
    `ws:${BASE_URL}/${FINANCIAL_MODULE}/notifications`,
    {
        auth: {
            token: ACCESS_TOKEN,
        },
    },
);
