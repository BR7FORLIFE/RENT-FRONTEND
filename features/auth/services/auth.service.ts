import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../../../core/api/api-endpoints";
import {
    registerSchema,
    type RegisterType,
} from "../../../core/schemas/auth-schema";
import { useAuth } from "../../../stores/auth-store";
import type { Storage } from "../../../types/global";

export const fieldsNotValid = (data: RegisterType): string[] => {
    const notValidField = Object.entries(data)
        .filter(([_, value]) => value.trim().length === 0)
        .map(([key, _]) => key);

    return notValidField;
};

export const validateRegisterFields = (data: RegisterType) => {
    return registerSchema.safeParse(data);
};

export function InfoStorage(): Storage<{
    userId: string | null;
    refreshToken: string | null;
}> {
    const KEY_STORAGE = "userInfo";
    const get = async (): Promise<{
        userId: string;
        refreshToken: string;
    } | null> => {
        const userInfo = await AsyncStorage.getItem(KEY_STORAGE);
        return userInfo ? JSON.parse(userInfo) : null;
    };

    const set = async (data: {
        userId: string | null;
        refreshToken: string | null;
    }) => {
        const current = await AsyncStorage.getItem(KEY_STORAGE);

        const stored = current ? JSON.parse(current) : {};

        const updated = {
            ...stored,
            ...(data.userId !== null && { userId: data.userId }),
            ...(data.refreshToken !== null && {
                refreshToken: data.refreshToken,
            }),
        };

        await AsyncStorage.setItem(KEY_STORAGE, JSON.stringify(updated));
    };

    const clean = async () => await AsyncStorage.clear();

    return { get, set, clean };
}

export function FormInfoStorage(): Storage<RegisterType> {
    const KEY_STORAGE = "register-form";

    const get = async (): Promise<RegisterType | null> => {
        const data = await AsyncStorage.getItem(KEY_STORAGE);
        return data ? JSON.parse(data) : null;
    };

    const set = async (formData: RegisterType): Promise<void> => {
        await AsyncStorage.setItem(KEY_STORAGE, JSON.stringify(formData));
    };

    const clean = async () => await AsyncStorage.clear();

    return { get, set, clean };
}

export async function logoutUser() {
    const KEY_STORAGE = "refreshToken";
    //hasync acemos saber al servidor que el usuario ha hecho un logout
    await logout();

    //elimnamos el refresh token del asynStorage
    await AsyncStorage.setItem(KEY_STORAGE, "");

    //elinamos la informacion del store
    useAuth.getState().logout();
}
