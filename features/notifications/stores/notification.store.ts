import { create } from "zustand";
import type { NotificationItem, NotificationResponse } from "../types";

interface NotificationState {
    notifications: NotificationItem[];
    unreadCount: number;
    isReady: boolean;
    setInit: (data: NotificationResponse) => void;
    addNew: (item: NotificationItem) => void;
    setUnreadCount: (count: number) => void;
    markRead: (ids: string[]) => void;
    markAllRead: () => void;
    clear: () => void;
}

// Las notificaciones llegan por push (Socket.IO), por eso viven en Zustand y no en TanStack Query.
export const useNotifications = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    isReady: false,
    setInit: (data) =>
        set({
            notifications: data.receiver,
            unreadCount: data.unreadCount,
            isReady: true,
        }),
    addNew: (item) =>
        set((state) =>
            state.notifications.some((n) => n.id === item.id)
                ? state
                : {
                      notifications: [item, ...state.notifications],
                      unreadCount: state.unreadCount + 1,
                  },
        ),
    setUnreadCount: (unreadCount) => set({ unreadCount }),
    markRead: (ids) =>
        set((state) => {
            const now = new Date().toISOString();
            return {
                notifications: state.notifications.map((n) =>
                    ids.includes(n.id) ? { ...n, readAt: n.readAt ?? now } : n,
                ),
            };
        }),
    markAllRead: () =>
        set((state) => {
            const now = new Date().toISOString();
            return {
                notifications: state.notifications.map((n) => ({
                    ...n,
                    readAt: n.readAt ?? now,
                })),
                unreadCount: 0,
            };
        }),
    clear: () => set({ notifications: [], unreadCount: 0, isReady: false }),
}));
