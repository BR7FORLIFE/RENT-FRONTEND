import { create } from "zustand";
import type { GlobalBehavior } from "../../../types/global";
import type { PropertyResponseApi } from "../api.response";

interface PropertyStore {
    data: PropertyResponseApi | null;
    set: (data: PropertyResponseApi) => void;
    clear: () => void;
}

export const useProperty = create<PropertyStore>((set) => ({
    data: null,
    set: (data) => set({ data }),
    clear: () => {
        set({ data: null });
    },
}));

export const useBehaviorQr = create<
    GlobalBehavior & { setOpen: (value: boolean) => void }
>((set, get) => ({
    isOpen: false,
    toggle() {
        const open = get().isOpen;
        set({
            isOpen: !open,
        });
    },
    setOpen: (value: boolean) => set({ isOpen: value }),
}));
