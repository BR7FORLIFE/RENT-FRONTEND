import { create } from "zustand";
import type { MeResponseType } from "../core/schemas/auth-schema";

interface UserAuth {
    userId: string | null;
    accessToken: string | null;
    setId: (id: string) => void;
    setAccessToken: (accessToken: string) => void;
    logout: () => void;
}

export const useAuth = create<UserAuth>((set) => ({
    userId: null,
    accessToken: null,
    setId: (id) => {
        set({ userId: id });
    },
    setAccessToken: (accessToken: string) => {
        set({ accessToken });
    },
    logout: () => {
        set({ userId: null, accessToken: null });
    },
}));

interface Me {
    user: MeResponseType | null;
    setUser: (user: MeResponseType) => void;
    clear: () => void;
}

export const useMe = create<Me>((set) => ({
    user: null,
    setUser: (user: MeResponseType) => {
        set({ user });
    },
    clear: () => {
        set({ user: null });
    },
}));
