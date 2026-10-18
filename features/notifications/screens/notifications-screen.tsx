import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RentHeader } from "../../../components/header";
import { EmptyList } from "../../../components/info";
import { StatusBadge } from "../../../components/ui/status-badge";
import { Palette, type Tone } from "../../../themes/themes";
import { formatDate } from "../../contract/services/format";
import {
  markAllNotificationsRead,
  markNotificationsRead,
} from "../hooks/use-notification-socket";
import { useNotifications } from "../stores/notification.store";
import type { NotificationItem, NotificationType } from "../types";

const TYPE_STYLE: Record<NotificationType, { label: string; tone: Tone }> = {
  INFO: { label: "Información", tone: "accent" },
  WARNING: { label: "Advertencia", tone: "warning" },
  ERROR: { label: "Error", tone: "danger" },
  DEBUG: { label: "Sistema", tone: "neutral" },
};

function NotificationCard({ item }: { item: NotificationItem }) {
  const { label, tone } = TYPE_STYLE[item.typeNotification] ?? TYPE_STYLE.INFO;
  const unread = item.readAt === null;

  return (
    <Pressable
      onPress={() => unread && markNotificationsRead([item.id])}
      style={({ pressed }) => [
        styles.card,
        unread && styles.cardUnread,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.cardHeader}>
        <StatusBadge label={label} tone={tone} />
        {unread && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.cardContent}>{item.content}</Text>
      <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
    </Pressable>
  );
}

export function NotificationsScreen() {
  const { notifications, unreadCount } = useNotifications();

  return (
    <SafeAreaView style={styles.screen}>
      <RentHeader sectionName="NOTIFICACIONES" />

      <View style={styles.titleRow}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.back}>‹ Volver</Text>
        </Pressable>
        {unreadCount > 0 && (
          <Pressable onPress={markAllNotificationsRead} hitSlop={10}>
            <Text style={styles.markAll}>Marcar todas como leídas</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyList
            title="Sin notificaciones"
            description="Aquí verás los avisos de tus contratos y propiedades."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.background },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  back: { fontSize: 14, fontWeight: "600", color: Palette.textSecondary },
  markAll: { fontSize: 13, fontWeight: "600", color: Palette.accent },

  list: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 32, gap: 12 },

  card: {
    gap: 8,
    padding: 16,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 16,
  },
  cardUnread: {
    backgroundColor: Palette.accentSoft,
    borderColor: Palette.accentBorder,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.accent,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: Palette.textPrimary },
  cardContent: { fontSize: 14, color: Palette.textSecondary },
  cardDate: { fontSize: 12, color: Palette.textMuted },
});
