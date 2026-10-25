import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { PrincipalError } from "../../../components/error";
import { EmptyList } from "../../../components/info";
import { Pager } from "../../../components/ui/pager";
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

const LIMIT = 10;

const listContent = {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
} as const;

export function MarketplaceSection() {
    const [page, setPage] = useState(1);
    const { isLoading, isError, data } = useQuery({
        queryKey: ["serviceOfferings", "marketplace", page],
        queryFn: () =>
            GetAllOfferings(page, LIMIT, { onlyValid: true, excludeMine: true }),
        placeholderData: keepPreviousData,
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
            ListFooterComponent={
                <Pager
                    page={page}
                    totalPages={data.metadata.totalPages}
                    onChange={setPage}
                />
            }
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
    const [page, setPage] = useState(1);
    const { isLoading, isError, data } = useQuery({
        queryKey: ["serviceOfferings", "mine", page],
        queryFn: () => GetMyOfferings(page, LIMIT),
        placeholderData: keepPreviousData,
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
            ListFooterComponent={
                <Pager
                    page={page}
                    totalPages={data.metadata.totalPages}
                    onChange={setPage}
                />
            }
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
    const [page, setPage] = useState(1);
    const filter = status === "ALL" ? undefined : status;

    const { isLoading, isError, data } = useQuery({
        queryKey: ["serviceRequests", role, status, page],
        queryFn: () =>
            (role === "requester" ? GetMyRequests : GetProviderRequests)(
                page,
                LIMIT,
                filter,
            ),
        placeholderData: keepPreviousData,
    });

    return (
        <View style={styles.flex}>
            <SegmentedTabs
                tabs={REQUEST_STATUS_TABS}
                value={status}
                onChange={(value) => {
                    setStatus(value);
                    setPage(1);
                }}
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
                    ListFooterComponent={
                        <Pager
                            page={page}
                            totalPages={data.metadata.totalPages}
                            onChange={setPage}
                        />
                    }
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
