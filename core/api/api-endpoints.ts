import { getUserCredentials } from "../../scripts/credentials";
import {
    LoginResponseSchema,
    RegisterResponseSchema,
    type LoginResponseType,
    type LoginType,
    type RefreshTokenResponseType,
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

export async function login(info: LoginType) {
    const { data } = await api.post<LoginResponseType>(AUTHPATHS.login, info);
    LoginResponseSchema.parse(data);
    return data;
}

export async function emailForward(userId: string) {
    const { data } = await api.post<string>(AUTHPATHS.email.forward, {
        userId,
    });
    return data;
}

export async function refresh(): Promise<{ accessToken: string | null }> {
    const { userId, refreshToken } = await getUserCredentials();
    if (userId && refreshToken) {
        const { data } = await api.post<RefreshTokenResponseType>(
            AUTHPATHS.refresh,
            {
                userId,
                refreshToken,
            },
        );
        return data;
    }

    return { accessToken: null };
}

export async function rotate(): Promise<RefreshTokenResponseType> {
    const { userId, refreshToken } = await getUserCredentials();

    if (!userId || !refreshToken) {
        throw new Error("No refresh credentials");
    }

    const { data } = await api.post<RefreshTokenResponseType>(
        AUTHPATHS.rotate,
        {
            userId,
            refreshToken,
        },
    );

    return data;
}

//falta crear el logout
export async function logout() {
    const msg = await api.post(AUTHPATHS.logout);
    return msg;
}
