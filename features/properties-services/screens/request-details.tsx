import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ButtonForm } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import { RentHeader } from "../../../components/header";
import { Input } from "../../../components/inputs/input";
import SplashScreen from "../../../components/splash-screen";
import { InfoRow } from "../../../components/ui/info-row";
import { StatusBadge } from "../../../components/ui/status-badge";
import { useAuth } from "../../../stores/auth-store";
import { Palette, Radius } from "../../../themes/themes";
import {
    AcceptRequestPrice,
    GetRequestById,
    ProposeRequestPrice,
    TransitionRequest,
    type RequestTransition,
} from "../api";
import type { ServiceRequestDetailResponse } from "../api.response";
import { MONEY_REGEX } from "../schemas/services.schema";
import {
    ACTION_LABEL,
    apiErrorMessage,
    formatDate,
    formatPrice,
    isConflict,
    PRICE_TYPE_LABEL,
    REQUEST_STATUS,
    requestPermissions,
} from "../services/format";

type Pending = "reject" | "cancel" | "propose" | null;

export function ServiceRequestDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const userId = useAuth((s) => s.userId);
    const queryClient = useQueryClient();
    const [pending, setPending] = useState<Pending>(null);
    const [text, setText] = useState("");

    const { isLoading, isError, data } = useQuery({
        queryKey: ["serviceRequest", id],
        queryFn: () => GetRequestById(id),
    });

    const refreshLists = () =>
        queryClient.invalidateQueries({ queryKey: ["serviceRequests"] });

    const onSuccess = (updated: ServiceRequestDetailResponse) => {
        // la respuesta ya es el detalle actualizado
        queryClient.setQueryData(["serviceRequest", id], updated);
        refreshLists();
        setPending(null);
        setText("");
    };

    const onError = (error: unknown) => {
        if (isConflict(error)) {
            queryClient.invalidateQueries({ queryKey: ["serviceRequest", id] });
        }
        Toast.show({
            type: "error",
            text1: apiErrorMessage(error, "No se pudo completar la acción."),
        });
    };

    const transition = useMutation({
        mutationFn: ({ action, reason }: { action: RequestTransition; reason?: string }) =>
            TransitionRequest(id, action, reason ? { reason } : {}),
        onSuccess,
        onError,
    });
    const propose = useMutation({
        mutationFn: (price: string) => ProposeRequestPrice(id, price),
        onSuccess,
        onError,
    });
    const acceptPrice = useMutation({
        mutationFn: () => AcceptRequestPrice(id),
        onSuccess,
        onError,
    });

    if (isLoading) return <SplashScreen />;
    if (isError || !data)
        return <PrincipalError error="No se ha podido obtener la solicitud." />;

    const perms = requestPermissions(data, userId);
    const status = REQUEST_STATUS[data.status];
    const busy = transition.isPending || propose.isPending || acceptPrice.isPending;

    const confirmPending = () => {
        const value = text.trim();
        if (pending === "propose") {
            if (!MONEY_REGEX.test(value) || Number(value) <= 0) {
                Toast.show({ type: "error", text1: "Monto inválido (máx. 2 decimales)." });
                return;
            }
            propose.mutate(value);
            return;
        }
        if (pending === "cancel" && perms.cancelNeedsReason && !value) {
            Toast.show({ type: "error", text1: "Debes indicar el motivo de la cancelación." });
            return;
        }
        if (pending) transition.mutate({ action: pending, reason: value || undefined });
    };

    return (
        <SafeAreaView style={styles.screen}>
            <RentHeader sectionName="Solicitud" />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={2}>
                        {data.offering.service.name}
                    </Text>
                    <StatusBadge label={status.label} tone={status.tone} />
                </View>

                <View style={styles.card}>
                    <InfoRow label="Inmueble" value={data.property.propertyName} />
                    <InfoRow label="Tipo de precio" value={PRICE_TYPE_LABEL[data.offering.priceTypeAgreement]} />
                    <InfoRow label="Solicitada" value={formatDate(data.requestedAt)} />
                    {data.notes && <InfoRow label="Notas" value={data.notes} />}
                </View>

                <View style={styles.card}>
                    <Text style={styles.section}>Precio</Text>
                    <InfoRow label="Publicado" value={formatPrice(data.publishedPrice, data.currency)} />
                    {data.proposedPrice !== null && (
                        <InfoRow
                            label={data.proposedByUserId === userId ? "Tu propuesta" : "Propuesta de la otra parte"}
                            value={formatPrice(data.proposedPrice, data.currency)}
                        />
                    )}
                    <InfoRow label="Acordado" value={formatPrice(data.agreedPrice, data.currency)} />
                    {perms.waitingOtherParty && (
                        <Text style={styles.hint}>Esperando respuesta de la otra parte.</Text>
                    )}
                </View>

                {pending && (
                    <View style={styles.card}>
                        <Input
                            field="pending-text"
                            label={pending === "propose" ? "Precio" : "Motivo"}
                            placeholder={pending === "propose" ? "75000" : "Describe el motivo"}
                            value={text}
                            fn={(_, value) => setText(value)}
                            typeInput={pending === "propose" ? "numeric" : "default"}
                            maxLength={pending === "propose" ? 13 : 500}
                        />
                        <ButtonForm title="Confirmar" variant="primary" action={confirmPending} isPending={busy} />
                        <ButtonForm title="Volver" action={() => { setPending(null); setText(""); }} />
                    </View>
                )}

                {!pending && (
                    <View style={styles.actions}>
                        {perms.canAcceptPrice && (
                            <ButtonForm
                                title={`Aceptar ${formatPrice(data.proposedPrice, data.currency)}`}
                                variant="primary"
                                isPending={acceptPrice.isPending}
                                action={() => acceptPrice.mutate()}
                            />
                        )}
                        {perms.canPropose && (
                            <ButtonForm
                                title={data.proposedPrice ? "Contraproponer precio" : "Proponer precio"}
                                action={() => setPending("propose")}
                            />
                        )}
                        {perms.canAccept && (
                            <ButtonForm
                                title="Aceptar solicitud"
                                variant="primary"
                                isPending={busy}
                                action={() => transition.mutate({ action: "accept" })}
                            />
                        )}
                        {perms.canStart && (
                            <ButtonForm title="Iniciar trabajo" variant="primary" isPending={busy} action={() => transition.mutate({ action: "start" })} />
                        )}
                        {data.status === "ACCEPTED" && data.agreedPrice === null && data.providerUserId === userId && (
                            <Text style={styles.hint}>Para iniciar, ambas partes deben acordar el precio.</Text>
                        )}
                        {perms.canComplete && (
                            <ButtonForm title="Completar servicio" variant="primary" isPending={busy} action={() => transition.mutate({ action: "complete" })} />
                        )}
                        {perms.canReject && <ButtonForm title="Rechazar" action={() => setPending("reject")} />}
                        {perms.canCancel && <ButtonForm title="Cancelar solicitud" action={() => setPending("cancel")} />}
                    </View>
                )}

                <Text style={styles.section}>Historial</Text>
                <View style={styles.card}>
                    {data.history.map((item) => (
                        <View key={item.id} style={styles.historyItem}>
                            <Text style={styles.historyAction}>{ACTION_LABEL[item.action]}</Text>
                            <Text style={styles.hint}>
                                {formatDate(item.createdAt)}
                                {item.actorUserId === userId ? " · Tú" : ""}
                            </Text>
                            {item.reason && <Text style={styles.historyReason}>{item.reason}</Text>}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: Palette.background },
    content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32, gap: 12 },
    titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
    title: { flexShrink: 1, fontSize: 22, fontWeight: "800", letterSpacing: -0.3, color: Palette.textPrimary },
    card: { backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.lg, padding: 16, gap: 12 },
    section: { fontSize: 16, fontWeight: "700", color: Palette.textPrimary },
    hint: { fontSize: 12, color: Palette.textMuted },
    actions: { gap: 8 },
    historyItem: { gap: 2, borderBottomWidth: 1, borderBottomColor: Palette.borderSoft, paddingBottom: 10 },
    historyAction: { fontSize: 14, fontWeight: "600", color: Palette.textPrimary },
    historyReason: { fontSize: 13, color: Palette.textSecondary },
});
