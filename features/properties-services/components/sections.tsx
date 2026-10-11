import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { PrincipalError } from "../../../components/error";
import { EmptyList } from "../../../components/info";
import { SegmentedTabs } from "../../../components/ui/segmented-tabs";
import SplashScreen from "../../../components/splash-screen";
import { ButtonForm } from "../../../components/buttons/button";
import {
    GetAllOfferings,
    GetMyOfferings,
    GetMyRequests,
    GetProviderRequests,
} from "../api";
import type { ServiceRequestStatus } from "../api.response";
import { REQUEST_STATUS_TABS } from "../services/format";
import { OfferingCard, RequestCard } from "./cards";

const PAGE = { page: 1, limit: 50 };

const listContent = {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
} as const;

export function MarketplaceSection() {
    const { isLoading, isError, data } = useQuery({
        queryKey: ["serviceOfferings", "marketplace"],
        queryFn: () =>
            GetAllOfferings(PAGE.page, PAGE.limit, { onlyValid: true }),
    });

    if (isLoading) return <SplashScreen />;
    if (isError || !data)
        return <PrincipalError error="No se han podido obtener las ofertas." />;

    return (
        <FlatList
            data={data.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <OfferingCard
                    offering={item}
                    onPress={() =>
                        router.push({
                            pathname: "/services/offering/[id]",
                            params: { id: item.id },
                        })
                    }
                />
            )}
            contentContainerStyle={listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <EmptyList
                    title="Sin ofertas disponibles"
                    description="Cuando un proveedor publique un servicio vigente, aparecerá aquí."
                />
            }
        />
    );
}

export function MyOfferingsSection() {
    const { isLoading, isError, data } = useQuery({
        queryKey: ["serviceOfferings", "mine"],
        queryFn: () => GetMyOfferings(PAGE.page, PAGE.limit),
    });

    if (isLoading) return <SplashScreen />;
    if (isError || !data)
        return <PrincipalError error="No se han podido obtener tus ofertas." />;

    return (
        <FlatList
            data={data.data}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
                <ButtonForm
                    title="Nueva oferta"
                    variant="primary"
                    action={() => router.push("/services/offering/new")}
                />
            }
            renderItem={({ item }) => (
                <OfferingCard
                    offering={item}
                    onPress={() =>
                        router.push({
                            pathname: "/services/offering/[id]",
                            params: { id: item.id },
                        })
                    }
                />
            )}
            contentContainerStyle={listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <EmptyList
                    title="Aún no publicas ofertas"
                    description="Publica un servicio para que otros usuarios puedan solicitarlo."
                />
            }
        />
    );
}

export function RequestsSection({ role }: { role: "requester" | "provider" }) {
    const [status, setStatus] = useState<"ALL" | ServiceRequestStatus>("ALL");
    const filter = status === "ALL" ? undefined : status;

    const { isLoading, isError, data } = useQuery({
        queryKey: ["serviceRequests", role, status],
        queryFn: () =>
            (role === "requester" ? GetMyRequests : GetProviderRequests)(
                PAGE.page,
                PAGE.limit,
                filter,
            ),
    });

    return (
        <View style={styles.flex}>
            <SegmentedTabs
                tabs={REQUEST_STATUS_TABS}
                value={status}
                onChange={setStatus}
            />
            {isLoading ? (
                <SplashScreen />
            ) : isError || !data ? (
                <PrincipalError error="No se han podido obtener las solicitudes." />
            ) : (
                <FlatList
                    data={data.data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <RequestCard
                            request={item}
                            onPress={() =>
                                router.push({
                                    pathname: "/services/request/[id]",
                                    params: { id: item.id },
                                })
                            }
                        />
                    )}
                    contentContainerStyle={listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <EmptyList
                            title="Sin solicitudes"
                            description={
                                role === "requester"
                                    ? "Solicita un servicio desde el marketplace."
                                    : "Cuando alguien solicite tus servicios, aparecerá aquí."
                            }
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
