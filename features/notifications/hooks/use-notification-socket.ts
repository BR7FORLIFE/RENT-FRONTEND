import { useEffect } from "react";
import Toast from "react-native-toast-message";
import type { Socket } from "socket.io-client";
import { createNotificationSocket } from "../../../core/api/api-config";
import { useAuth } from "../../../stores/auth-store";
import { useNotifications } from "../stores/notification.store";
import type { NotificationItem, NotificationResponse } from "../types";

let socket: Socket | null = null;

export function markNotificationsRead(ids: string[]) {
    if (ids.length === 0) return;
    socket?.emit("notifications:read", { ids });
    useNotifications.getState().markRead(ids);
}

export function markAllNotificationsRead() {
    socket?.emit("notifications:read-all");
    useNotifications.getState().markAllRead();
}

// Mantiene un único socket por sesión. Se recrea si cambia el token (el servidor lo valida en cada mensaje).
export function useNotificationSocket() {
    const accessToken = useAuth((state) => state.accessToken);

    useEffect(() => {
        const store = useNotifications.getState();

        if (!accessToken) {
            store.clear();
            return;
        }

        const current = createNotificationSocket(accessToken);
        socket = current;

        // las rooms se pierden al reconectar: init en cada connect
        current.on("connect", () => current.emit("init"));
        current.on("notifications:init", (data: NotificationResponse) =>
            useNotifications.getState().setInit(data),
        );
        current.on("notification:new", (item: NotificationItem) => {
            useNotifications.getState().addNew(item);
            Toast.show({
                type: item.typeNotification === "ERROR" ? "error" : "info",
                text1: item.name,
                text2: item.content,
            });
        });
        current.on("notifications:unread-count", ({ unreadCount }: { unreadCount: number }) =>
            useNotifications.getState().setUnreadCount(unreadCount),
        );

        return () => {
            current.removeAllListeners();
            current.disconnect();
            if (socket === current) socket = null;
        };
    }, [accessToken]);
}
