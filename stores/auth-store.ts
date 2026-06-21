import { create } from "zustand";

interface UserAuth {
    userId: string | null;
    setId: (id: string) => void;
    logout: () => void;
}

export const useAuth = create<UserAuth>((set) => ({
    userId: null,
    setId: (id) => {
        set({ userId: id });
    },
    logout: () => {
        set({ userId: null });
    },
}));
