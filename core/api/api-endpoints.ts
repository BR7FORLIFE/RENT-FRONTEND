import {
    RegisterResponseSchema,
    type RegisterResponseType,
    type RegisterType,
} from "../schemas/auth-schema";
import { api } from "./axios-config";
import { AUTHPATHS } from "./paths";

export async function register(
    info: RegisterType,
): Promise<RegisterResponseType> {
    const { data } = await api.post<RegisterResponseType>(
        AUTHPATHS.register,
        info,
    );
    RegisterResponseSchema.parse(data);

    return data;
}

export async function emailForward(userId: string) {
    const { data } = await api.post<string>(AUTHPATHS.email.forward, {
        userId,
    });
    return data;
}
