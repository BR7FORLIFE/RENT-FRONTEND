import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../../../core/api/api-endpoints";
import {
    registerSchema,
    type RegisterType,
} from "../../../core/schemas/auth-schema";
import { useAuth } from "../../../stores/auth-store";

export const fieldsNotValid = (data: RegisterType): string[] => {
    const notValidField = Object.entries(data)
        .filter(([_, value]) => value.trim().length === 0)
        .map(([key, _]) => key);

    return notValidField;
};

export const validateRegisterFields = (data: RegisterType) => {
    return registerSchema.safeParse(data);
};

export function InfoStorage() {
    const get = async (): Promise<{
        userId: string;
        refreshToken: string;
    } | null> => {
        const userInfo = await AsyncStorage.getItem("userInfo");
        return userInfo ? JSON.parse(userInfo) : null;
    };

    const set = async (data: {
        userId: string | null;
        refreshToken: string | null;
    }) => {
        const current = await AsyncStorage.getItem("userInfo");

        const stored = current ? JSON.parse(current) : {};

        const updated = {
            ...stored,
            ...(data.userId !== null && { userId: data.userId }),
            ...(data.refreshToken !== null && {
                refreshToken: data.refreshToken,
            }),
        };

        await AsyncStorage.setItem("userInfo", JSON.stringify(updated));
    };

    return { get, set };
}

export function FormInfoStorage() {
    const get = async (): Promise<RegisterType | null> => {
        const data = await AsyncStorage.getItem("register-form");
        return data ? JSON.parse(data) : null;
    };

    const set = async (formData: RegisterType): Promise<void> => {
        await AsyncStorage.setItem("register-form", JSON.stringify(formData));
    };

    return { get, set };
}

export async function logoutUser() {
    //hasync acemos saber al servidor que el usuario ha hecho un logout
    await logout();

    //elimnamos el refresh token del asynStorage
    await AsyncStorage.setItem("refreshToken", "");

    //elinamos la informacion del store
    useAuth.getState().logout();
}
