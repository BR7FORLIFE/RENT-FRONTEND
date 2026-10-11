import { Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBadge } from "../../../components/ui/status-badge";
import { Palette } from "../../../themes/themes";
import {
    CATEGORY_LABEL,
    formatCurrency,
    formatDay,
    isPastDue,
    STATUS_INFO,
} from "../services/format";
import type { FinancialTransaction } from "../types";

export function TransactionCard({
    item,
    action,
}: {
    item: FinancialTransaction;
    action: () => void;
}) {
    const status = STATUS_INFO[item.status];
    const isIncome = item.type === "INCOME";
    const overdue = isPastDue(item);

    return (
        <Pressable
            onPress={action}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
            <View style={styles.row}>
                <View style={styles.info}>
                    <Text style={styles.description} numberOfLines={1}>
                        {item.description}
                    </Text>
                    <Text style={styles.category} numberOfLines={1}>
                        {CATEGORY_LABEL[item.category]}
                        {item.isSimulated ? " · Simulado" : ""}
                    </Text>
                </View>

                <Text
                    style={[
                        styles.amount,
                        { color: isIncome ? Palette.success : Palette.danger },
                    ]}
                    numberOfLines={1}
                >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(item.amount, item.currency)}
                </Text>
            </View>

            <View style={styles.footer}>
                <StatusBadge label={status.label} tone={status.tone} />
                <Text
                    style={[styles.date, overdue && styles.dateOverdue]}
                    numberOfLines={1}
                >
                    {item.dueDate
                        ? `Vence ${formatDay(item.dueDate)}`
                        : formatDay(item.occurredAt)}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Palette.surface,
        borderWidth: 1,
        borderColor: Palette.border,
        borderRadius: 16,
        padding: 16,
        gap: 12,
    },

    pressed: {
        backgroundColor: Palette.surfaceMuted,
        transform: [{ scale: 0.99 }],
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },

    info: {
        flex: 1,
        gap: 2,
    },

    description: {
        fontSize: 14,
        fontWeight: "700",
        color: Palette.textPrimary,
    },

    category: {
        fontSize: 12,
        color: Palette.textMuted,
    },

    amount: {
        fontSize: 14,
        fontWeight: "700",
        maxWidth: "45%",
    },

    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Palette.borderSoft,
    },

    date: {
        fontSize: 12,
        color: Palette.textMuted,
    },

    dateOverdue: {
        color: Palette.danger,
        fontWeight: "600",
    },
});
