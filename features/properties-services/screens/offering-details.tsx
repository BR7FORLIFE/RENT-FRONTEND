import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ButtonForm, FilterButton } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import { RentHeader } from "../../../components/header";
import { Input } from "../../../components/inputs/input";
import SplashScreen from "../../../components/splash-screen";
import { InfoRow } from "../../../components/ui/info-row";
import { StatusBadge } from "../../../components/ui/status-badge";
import { useAuth } from "../../../stores/auth-store";
import { Palette, Radius } from "../../../themes/themes";
import { GetAllPropertiesByPropertyMember } from "../../property-registration/api";
import {
    ChangeOfferingStatus,
    CreateServiceRequest,
    GetOfferingById,
} from "../api";
import {
    CreateServiceRequestSchema,
    type CreateServiceRequestType,
} from "../schemas/services.schema";
import {
    apiErrorMessage,
    formatDate,
    formatPrice,
    PRICE_TYPE_LABEL,
    SCOPE_LABEL,
} from "../services/format";

export function ServiceOfferingDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const userId = useAuth((s) => s.userId);
    const queryClient = useQueryClient();
    const [propertyId, setPropertyId] = useState<string | null>(null);
    const [notes, setNotes] = useState("");
    const [price, setPrice] = useState("");

    const offeringQuery = useQuery({
        queryKey: ["serviceOffering", id],
        queryFn: () => GetOfferingById(id),
    });
    const propertiesQuery = useQuery({
        queryKey: ["propertiesByMember", "ACTIVE"],
        queryFn: () => GetAllPropertiesByPropertyMember("ACTIVE", 1, 100),
        staleTime: 60000 * 10,
    });

    const create = useMutation({
        mutationFn: (body: CreateServiceRequestType) => CreateServiceRequest(body),
        onSuccess: (request) => {
            queryClient.setQueryData(["serviceRequest", request.id], request);
            queryClient.invalidateQueries({ queryKey: ["serviceRequests"] });
            router.replace({ pathname: "/services/request/[id]", params: { id: request.id } });
        },
        onError: (error) =>
            Toast.show({ type: "error", text1: apiErrorMessage(error, "No se pudo crear la solicitud.") }),
    });

    const toggle = useMutation({
        mutationFn: (status: "ACTIVE" | "INACTIVE") => ChangeOfferingStatus(id, status),
        onSuccess: (updated) => {
            queryClient.setQueryData(["serviceOffering", id], updated);
            queryClient.invalidateQueries({ queryKey: ["serviceOfferings"] });
        },
        onError: (error) =>
            Toast.show({ type: "error", text1: apiErrorMessage(error, "No se pudo cambiar el estado.") }),
    });

    if (offeringQuery.isLoading) return <SplashScreen />;
    if (offeringQuery.isError || !offeringQuery.data)
        return <PrincipalError error="No se ha podido obtener la oferta." />;

    const offering = offeringQuery.data;
    const isMine = offering.providerUserId === userId;
    const type = offering.priceTypeAgreement;
    // en ofertas PROPERTY el inmueble es fijo
    const lockedPropertyId = offering.propertyMember?.propertyId ?? null;
    const selectedProperty = lockedPropertyId ?? propertyId;

    const submit = () => {
        const parsed = CreateServiceRequestSchema.safeParse({
            serviceOfferingId: offering.id,
            propertyId: selectedProperty,
            notes: notes.trim() || undefined,
            proposedPrice:
                (type === "NEGOTIABLE" || type === "PERCENTAGE") && price.trim()
                    ? price.trim()
                    : undefined,
        });
        if (!parsed.success) {
            Toast.show({
                type: "error",
                text1: selectedProperty ? "Revisa el precio propuesto." : "Selecciona un inmueble.",
            });
            return;
        }
        create.mutate(parsed.data);
    };

    return (
        <SafeAreaView style={styles.screen}>
            <RentHeader sectionName="Oferta" />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={2}>{offering.service.name}</Text>
                    <StatusBadge
                        label={offering.status === "ACTIVE" ? "Activa" : "Inactiva"}
                        tone={offering.status === "ACTIVE" ? "success" : "neutral"}
                    />
                </View>

                <View style={styles.card}>
                    <InfoRow label="Precio base" value={formatPrice(offering.basePrice, offering.currency)} />
                    <InfoRow label="Tipo de precio" value={PRICE_TYPE_LABEL[type]} />
                    <InfoRow label="Alcance" value={SCOPE_LABEL[offering.scope]} />
                    <InfoRow label="Vigente desde" value={formatDate(offering.validFrom)} />
                    <InfoRow label="Vigente hasta" value={offering.validUntil ? formatDate(offering.validUntil) : "Sin vencimiento"} />
                </View>

                {isMine ? (
                    <ButtonForm
                        title={offering.status === "ACTIVE" ? "Desactivar oferta" : "Activar oferta"}
                        isPending={toggle.isPending}
                        action={() => toggle.mutate(offering.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                    />
                ) : (
                    offering.status === "ACTIVE" && (
                        <View style={styles.card}>
                            <Text style={styles.section}>Solicitar servicio</Text>
                            {lockedPropertyId ? (
                                <Text style={styles.hint}>Esta oferta es exclusiva de un inmueble y se solicitará para él.</Text>
                            ) : (
                                <>
                                    <Text style={styles.hint}>Inmueble</Text>
                                    <View style={styles.chips}>
                                        {propertiesQuery.data?.data.map((p) => (
                                            <FilterButton
                                                key={p.id}
                                                title={p.propertyName}
                                                active={p.id === propertyId}
                                                onPress={() => setPropertyId(p.id)}
                                            />
                                        ))}
                                    </View>
                                    {propertiesQuery.isError && (
                                        <Text style={styles.hint}>No se pudieron cargar tus inmuebles.</Text>
                                    )}
                                </>
                            )}
                            <Input field="notes" label="Notas (opcional)" placeholder="Describe el trabajo" value={notes} fn={(_, v) => setNotes(v)} maxLength={1000} />
                            {(type === "NEGOTIABLE" || type === "PERCENTAGE") && (
                                <Input field="price" label="Precio que propones (opcional)" placeholder="75000" value={price} fn={(_, v) => setPrice(v)} typeInput="numeric" maxLength={13} />
                            )}
                            {type === "FIXED" && <Text style={styles.hint}>Precio fijo: {formatPrice(offering.basePrice, offering.currency)}</Text>}
                            {type === "CUSTOM_QUOTE" && <Text style={styles.hint}>El proveedor te enviará una cotización.</Text>}
                            <ButtonForm title="Solicitar" variant="primary" isPending={create.isPending} action={submit} />
                        </View>
                    )
                )}
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
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
