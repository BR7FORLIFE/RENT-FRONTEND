import { create } from "zustand";

interface BehaviorAside {
    isOpen: boolean;
    toggle: () => void;
}

export const useBehaviorAside = create<BehaviorAside>((set, get) => ({
    isOpen: false,
    toggle() {
        const open = get().isOpen;
        set({
            isOpen: !open,
        });
    },
}));
