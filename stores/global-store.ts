import { create } from "zustand";
import type { GlobalBehavior } from "../types/global";

export const useBehaviorAside = create<GlobalBehavior>((set, get) => ({
    isOpen: false,
    toggle() {
        const open = get().isOpen;
        set({
            isOpen: !open,
        });
    },
}));

export const useBehaviorNotification = create<GlobalBehavior>((set, get) => ({
    isOpen: false,
    toggle() {
        const open = get().isOpen;
        set({
            isOpen: !open,
        });
    },
}));
