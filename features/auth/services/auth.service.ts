import {
    registerSchema,
    type RegisterType,
} from "../../../core/schemas/auth-schema";

export const fieldsNotValid = (data: RegisterType): string[] => {
    const notValidField = Object.entries(data)
        .filter(([_, value]) => value.trim().length === 0)
        .map(([key, _]) => key);

    return notValidField;
};

export const validateRegisterFields = (data: RegisterType) => {
    return registerSchema.safeParse(data);
};
