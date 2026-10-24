import { isAxiosError } from "axios";

//mensaje legible a partir del error del backend ({ message, error }),
//con mensajes distintos para errores de red/timeout
export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (typeof message === "string" && message.length > 0) return message;
        if (!error.response) {
            return "No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.";
        }
    }
    return fallback;
}
