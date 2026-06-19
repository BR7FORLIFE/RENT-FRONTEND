import {
    RegisterResponseSchema,
    type RegisterResponseType,
    type RegisterType,
} from "../schemas/auth-schema";
import { api } from "./axios-config";
import { AUTHPATHS } from "./paths";

export async function register(info: RegisterType) {
    const { data } = await api.post<RegisterResponseType>(
        AUTHPATHS.register,
        info,
    );
    RegisterResponseSchema.parse(data);
}
