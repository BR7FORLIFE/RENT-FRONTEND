import { create } from "axios";
import { useAuth } from "../../stores/auth-store";

export const api = create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
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

//interceptores de response
