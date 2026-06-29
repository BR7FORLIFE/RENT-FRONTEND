import { create } from "zustand";

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
