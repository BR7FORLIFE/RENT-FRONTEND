import type { RegisterType } from "../core/schemas/auth-schema";

export interface KeyInput {
    field: keyof RegisterType;
    label: string;
    placeholder: string;
}
