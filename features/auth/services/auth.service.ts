import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../../../core/api/api-endpoints";
import {
    registerSchema,
    type RegisterType,
} from "../../../core/schemas/auth-schema";
import { useAuth } from "../../../stores/auth-store";
import type { Storage } from "../../../types/global";

const TRIM_TEXT_REGEX = /\s+/g;

const EMAIL_REGEX_VALIDATION =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const NUMBER_REGEX_VALIDATION = /^[0-9]+$/;

interface ValidateContentDataInt {
    emptyFields: string[] | null;
    contentResult: RegisterType | null;
    invalidFields: string[] | null;
}

const fieldsNotValid = (data: RegisterType): string[] => {
    const notValidField = Object.entries(data)
        .filter(([_, value]) => value.trim().length === 0)
        .map(([key, _]) => key);

    return notValidField;
};

const validateWithRegex = (text: string, regex: RegExp) => {
    return regex.test(text);
};

export const validateContentData = (
    data: RegisterType,
): ValidateContentDataInt => {
    //validar los campos no rellenados y notificar a la UI
    const emptyFields = fieldsNotValid(data);

    if (emptyFields.length !== 0) {
        //campos a enviar a la UI para notificar
        console.log({ emptyFields });
        return { emptyFields, contentResult: null, invalidFields: null };
    }

    //proceso de validacion de los datos del formulario
    const result: RegisterType = {
        username: "", // listo
        password: "", // listo
        email: "", // listo
        cellphone: "", // listo
        fullname: "", //listo
        identificationNumber: "",
        identificationType: data.identificationType,
    };

    //transformamos y tratamos las variables de tezto como username fullname y password
    result["username"] = data.username.replace(TRIM_TEXT_REGEX, "");
    result["fullname"] = data.fullname.replace(TRIM_TEXT_REGEX, "");
    result["password"] = data.password.replace(TRIM_TEXT_REGEX, "");

    //validamos el email con su respectivo regex
    if (!validateWithRegex(data.email, EMAIL_REGEX_VALIDATION)) {
        //notificamos que el email esta mal estructurado
        return {
            contentResult: null,
            emptyFields: null,
            invalidFields: ["EMAIL"],
        };
    }

    result["email"] = data.email; // asignamos el email ya que validamos que es correcto

    if (
        !validateWithRegex(data.cellphone, NUMBER_REGEX_VALIDATION) ||
        !validateWithRegex(data.identificationNumber, NUMBER_REGEX_VALIDATION)
    ) {
        //notificamos que el telefono no tiene el formato esperado
        // o por consecuencia el numero de identificacion
        return {
            contentResult: null,
            emptyFields: null,
            invalidFields: ["CELLPHONE", "IDENTIFICATION_NUMBER"],
        };
    }

    result["cellphone"] = data.cellphone;
    result["identificationNumber"] = data.identificationNumber;

    console.log({ result });
    return { contentResult: result, emptyFields: null, invalidFields: null };
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
