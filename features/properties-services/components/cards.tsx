import { Pressable, StyleSheet, Text, View } from "react-native";
import { Palette, Radius } from "../../../themes/themes";
import { StatusBadge } from "../../../components/ui/status-badge";
import type {
    ServiceOfferingResponse,
    ServiceRequestResponse,
} from "../api.response";
import {
    formatDate,
    formatPrice,
    PRICE_TYPE_LABEL,
    REQUEST_STATUS,
    SCOPE_LABEL,
} from "../services/format";

export function OfferingCard({
    offering,
    onPress,
}: {
    offering: ServiceOfferingResponse;
    onPress: () => void;
}) {
    const inactive = offering.status === "INACTIVE";

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
            <View style={styles.row}>
                <Text style={styles.title} numberOfLines={1}>
                    {offering.service.name}
                </Text>
                <StatusBadge
                    label={inactive ? "Inactiva" : PRICE_TYPE_LABEL[offering.priceTypeAgreement]}
                    tone={inactive ? "neutral" : "accent"}
                />
            </View>
            <Text style={styles.price}>
                {formatPrice(offering.basePrice, offering.currency)}
            </Text>
            <View style={[styles.row, styles.footer]}>
                <Text style={styles.meta}>{SCOPE_LABEL[offering.scope]}</Text>
                <Text style={styles.meta}>
                    {offering.validUntil
                        ? `Hasta ${formatDate(offering.validUntil)}`
                        : "Sin vencimiento"}
                </Text>
            </View>
        </Pressable>
    );
}

export function RequestCard({
    request,
    onPress,
}: {
    request: ServiceRequestResponse;
    onPress: () => void;
}) {
    const status = REQUEST_STATUS[request.status];
    const price = request.agreedPrice ?? request.proposedPrice;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
            <View style={styles.row}>
                <Text style={styles.title} numberOfLines={1}>
                    {request.offering.service.name}
                </Text>
                <StatusBadge label={status.label} tone={status.tone} />
            </View>
            <Text style={styles.meta} numberOfLines={1}>
                {request.property.propertyName}
            </Text>
            <Text style={styles.price}>
                {formatPrice(price, request.currency)}
                {request.agreedPrice === null && price !== null ? " (propuesto)" : ""}
            </Text>
            <View style={[styles.row, styles.footer]}>
                <Text style={styles.meta}>Solicitada</Text>
                <Text style={styles.meta}>{formatDate(request.requestedAt)}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Palette.surface,
        borderWidth: 1,
        borderColor: Palette.border,
        borderRadius: Radius.lg,
        padding: 16,
        gap: 8,
    },
    pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    title: {
        flexShrink: 1,
        fontSize: 16,
        fontWeight: "700",
        color: Palette.textPrimary,
    },
    price: { fontSize: 15, fontWeight: "600", color: Palette.textPrimary },
    footer: {
        borderTopWidth: 1,
        borderTopColor: Palette.borderSoft,
        paddingTop: 10,
    },
    meta: { fontSize: 12, color: Palette.textMuted },
});
