import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ButtonForm, FilterButton } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import { RentHeader } from "../../../components/header";
import { Input } from "../../../components/inputs/input";
import SplashScreen from "../../../components/splash-screen";
import { Palette, Radius } from "../../../themes/themes";
import {
    GetAllPropertiesByPropertyMember,
    PropertyMemberMe,
} from "../../property-registration/api";
import { CreateOffering, GetAllServices } from "../api";
import type { Currency, OfferingScope, PriceTypeAgreement } from "../api.response";
import { CreateServiceOfferingSchema } from "../schemas/services.schema";
import { apiErrorMessage, PRICE_TYPE_LABEL } from "../services/format";

export function ServiceOfferingFormScreen() {
    const queryClient = useQueryClient();
    const [serviceId, setServiceId] = useState<string | null>(null);
    const [scope, setScope] = useState<OfferingScope>("PUBLIC");
    const [propertyId, setPropertyId] = useState<string | null>(null);
    const [type, setType] = useState<PriceTypeAgreement>("FIXED");
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState<Currency>("COP");
    const [validUntil, setValidUntil] = useState(""); // YYYY-MM-DD

    const services = useQuery({
        queryKey: ["services"],
        queryFn: () => GetAllServices(1, 100),
        staleTime: 60000 * 10,
    });
    const properties = useQuery({
        queryKey: ["propertiesByMember", "ACTIVE"],
        queryFn: () => GetAllPropertiesByPropertyMember("ACTIVE", 1, 100),
        staleTime: 60000 * 10,
        enabled: scope === "PROPERTY",
    });

    const create = useMutation({
        mutationFn: async () => {
            // propertyMemberId = mi membresía en el inmueble elegido
            const memberId =
                scope === "PROPERTY" && propertyId
                    ? (await PropertyMemberMe(propertyId)).info.id
                    : undefined;
            const parsed = CreateServiceOfferingSchema.parse({
                serviceId,
                scope,
                propertyMemberId: memberId,
                priceTypeAgreement: type,
                basePrice: price.trim(),
                currency,
                validUntil: validUntil.trim()
                    ? new Date(`${validUntil.trim()}T23:59:59`).toISOString()
                    : undefined,
            });
            return CreateOffering(parsed);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["serviceOfferings"] });
            router.back();
        },
        onError: (error) =>
            Toast.show({
                type: "error",
                text1: apiErrorMessage(error, "Revisa los datos de la oferta."),
            }),
    });

    if (services.isLoading) return <SplashScreen />;
    if (services.isError || !services.data)
        return <PrincipalError error="No se ha podido obtener el catálogo de servicios." />;

    return (
        <SafeAreaView style={styles.screen}>
            <RentHeader sectionName="Nueva oferta" />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text style={styles.section}>Servicio</Text>
                    <View style={styles.chips}>
                        {services.data.data.map((s) => (
                            <FilterButton key={s.id} title={s.name} active={s.id === serviceId} onPress={() => setServiceId(s.id)} />
                        ))}
                    </View>

                    <Text style={styles.section}>Alcance</Text>
                    <View style={styles.chips}>
                        <FilterButton title="Público" active={scope === "PUBLIC"} onPress={() => setScope("PUBLIC")} />
                        <FilterButton title="Mi inmueble" active={scope === "PROPERTY"} onPress={() => setScope("PROPERTY")} />
                    </View>
                    {scope === "PROPERTY" && (
                        <View style={styles.chips}>
                            {properties.data?.data.map((p) => (
                                <FilterButton key={p.id} title={p.propertyName} active={p.id === propertyId} onPress={() => setPropertyId(p.id)} />
                            ))}
                        </View>
                    )}

                    <Text style={styles.section}>Precio</Text>
                    <View style={styles.chips}>
                        {(Object.keys(PRICE_TYPE_LABEL) as PriceTypeAgreement[]).map((t) => (
                            <FilterButton key={t} title={PRICE_TYPE_LABEL[t]} active={t === type} onPress={() => setType(t)} />
                        ))}
                    </View>
                    <Input field="basePrice" label="Precio base" placeholder="80000" value={price} fn={(_, v) => setPrice(v)} typeInput="numeric" maxLength={13} />
                    <View style={styles.chips}>
                        {(["COP", "USD"] as Currency[]).map((c) => (
                            <FilterButton key={c} title={c} active={c === currency} onPress={() => setCurrency(c)} />
                        ))}
                    </View>
                    <Input field="validUntil" label="Vigente hasta (AAAA-MM-DD, opcional)" placeholder="2027-01-31" value={validUntil} fn={(_, v) => setValidUntil(v)} maxLength={10} />
                </View>

                <ButtonForm title="Publicar oferta" variant="primary" isPending={create.isPending} action={() => create.mutate()} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: Palette.background },
    content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32, gap: 12 },
    card: { backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, borderRadius: Radius.lg, padding: 16, gap: 12 },
    section: { fontSize: 16, fontWeight: "700", color: Palette.textPrimary },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
