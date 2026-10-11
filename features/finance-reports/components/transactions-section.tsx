import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { FilterButton } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import { EmptyList } from "../../../components/info";
import SplashScreen from "../../../components/splash-screen";
import { Palette } from "../../../themes/themes";
import { GetAllTransactions } from "../api";
import type {
    RecordStatus,
    TransactionType,
} from "../schemas/transaction.schema";
import { STATUS_INFO, TYPE_LABEL } from "../services/format";
import { TransactionCard } from "./transaction-card";

const LIMIT = 20;

// Reutilizado para "Movimientos" (history=false) y "Historial" (history=true).
export function TransactionsSection({
    propertyId,
    history = false,
}: {
    propertyId: string;
    history?: boolean;
}) {
    const [type, setType] = useState<TransactionType | undefined>();
    const [status, setStatus] = useState<RecordStatus | undefined>();
    const [page, setPage] = useState(1);

    const { isLoading, isError, data } = useQuery({
        queryKey: ["financeTransactions", propertyId, history, type, status, page],
        queryFn: () =>
            GetAllTransactions(propertyId, page, LIMIT, { type, status }, history),
    });

    const reset = () => setPage(1);

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filters}
                contentContainerStyle={styles.filtersContent}
            >
                <FilterButton
                    title="Todos"
                    active={!type && !status}
                    onPress={() => {
                        setType(undefined);
                        setStatus(undefined);
                        reset();
                    }}
                />
                {(Object.keys(TYPE_LABEL) as TransactionType[]).map((t) => (
                    <FilterButton
                        key={t}
                        title={TYPE_LABEL[t]}
                        active={type === t}
                        onPress={() => {
                            setType(type === t ? undefined : t);
                            reset();
                        }}
                    />
                ))}
                {(Object.keys(STATUS_INFO) as RecordStatus[])
                    .filter((s) => history || s !== "CANCELLED")
                    .map((s) => (
                        <FilterButton
                            key={s}
                            title={STATUS_INFO[s].label}
                            active={status === s}
                            onPress={() => {
                                setStatus(status === s ? undefined : s);
                                reset();
                            }}
                        />
                    ))}
            </ScrollView>

            {isLoading ? (
                <SplashScreen />
            ) : isError || !data ? (
                <PrincipalError error="No se pudieron obtener los movimientos!" />
            ) : (
                <FlatList
                    data={data.data}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <TransactionCard
                            item={item}
                            action={() =>
                                router.push({
                                    pathname: "/finance/transaction/[id]",
                                    params: { id: item.id, propertyId },
                                })
                            }
                        />
                    )}
                    ListEmptyComponent={
                        <EmptyList
                            title="No hay movimientos"
                            description="Los ingresos y gastos que registres para esta propiedad aparecerán aquí."
                        />
                    }
                    ListFooterComponent={
                        data.metadata.totalPages > 1 ? (
                            <View style={styles.pager}>
                                <FilterButton
                                    title="Anterior"
                                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                                />
                                <Text style={styles.pageText}>
                                    {data.metadata.page} / {data.metadata.totalPages}
                                </Text>
                                <FilterButton
                                    title="Siguiente"
                                    onPress={() =>
                                        data.metadata.hasNextPage && setPage((p) => p + 1)
                                    }
                                />
                            </View>
                        ) : null
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    filters: { flexGrow: 0 },

    filtersContent: {
        paddingHorizontal: 20,
        paddingBottom: 12,
        gap: 8,
    },

    list: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 32,
        gap: 12,
    },

    pager: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        paddingTop: 4,
    },

    pageText: {
        fontSize: 12,
        color: Palette.textMuted,
    },
});
