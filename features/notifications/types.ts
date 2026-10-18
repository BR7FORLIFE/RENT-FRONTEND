export type NotificationType = "WARNING" | "INFO" | "ERROR" | "DEBUG";

export interface NotificationItem {
    id: string;
    transmitterId: string;
    receiverId: string;
    source: string;
    name: string;
    content: string;
    typeNotification: NotificationType;
    readAt: string | null;
    createdAt: string;
}

export interface NotificationResponse {
    receiver: NotificationItem[];
    transmitter: NotificationItem[];
    unreadCount: number;
}
