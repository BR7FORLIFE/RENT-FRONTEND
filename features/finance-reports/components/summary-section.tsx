import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrincipalError } from "../../../components/error";
import { EmptyList } from "../../../components/info";
import SplashScreen from "../../../components/splash-screen";
import {
    SegmentedTabs,
    type SegmentedTab,
} from "../../../components/ui/segmented-tabs";
import { Palette } from "../../../themes/themes";
import { GetFinancialSummary } from "../api";
import {
    formatCurrency,
    formatDay,
    periodRange,
    type PeriodPreset,
} from "../services/format";
import type { CurrencySummary } from "../types";

const PERIODS: SegmentedTab<PeriodPreset>[] = [
    { label: "Este mes", value: "MONTH" },
    { label: "Mes anterior", value: "PREV_MONTH" },
    { label: "Trimestre", value: "QUARTER" },
    { label: "Año", value: "YEAR" },
];

function Metric({
    label,
    value,
    color = Palette.textPrimary,
}: {
    label: string;
    value: string;
    color?: string;
}) {
    return (
        <View style={styles.metric}>
            <Text style={styles.metricLabel}>{label}</Text>
            <Text style={[styles.metricValue, { color }]} numberOfLines={1}>
                {value}
            </Text>
        </View>
    );
}

function CurrencyCard({ data }: { data: CurrencySummary }) {
    const c = data.currency;
    const negative = data.netCashFlow.startsWith("-");

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.metricLabel}>Flujo de caja neto</Text>
                    <Text
                        style={[
                            styles.net,
                            { color: negative ? Palette.danger : Palette.success },
                        ]}
                        numberOfLines={1}
                    >
                        {formatCurrency(data.netCashFlow, c)}
                    </Text>
                </View>
                <Text style={styles.currencyTag}>{c}</Text>
            </View>

            <View style={styles.grid}>
                <Metric
                    label="Ingresos realizados"
                    value={formatCurrency(data.realizedIncome, c)}
                />
                <Metric
                    label="Gastos realizados"
                    value={formatCurrency(data.realizedExpense, c)}
                />
                <Metric
                    label="Ingresos pendientes"
                    value={formatCurrency(data.pendingIncome, c)}
                />
                <Metric
                    label="Gastos pendientes"
                    value={formatCurrency(data.pendingExpense, c)}
                />
            </View>

            <View style={styles.overdue}>
                <Text style={styles.overdueTitle}>
                    Vencidos · {data.overdue.count}
                </Text>
                <Text style={styles.overdueText} numberOfLines={1}>
                    {formatCurrency(data.overdue.income, c)} por cobrar ·{" "}
                    {formatCurrency(data.overdue.expense, c)} por pagar
                </Text>
            </View>
        </View>
    );
}

export function SummarySection({ propertyId }: { propertyId: string }) {
    const [preset, setPreset] = useState<PeriodPreset>("MONTH");
    const range = useMemo(() => periodRange(preset), [preset]);

    const { isLoading, isError, data } = useQuery({
        queryKey: ["financeSummary", propertyId, preset],
        queryFn: () => GetFinancialSummary(propertyId, range.from, range.to),
    });

    return (
        <View style={styles.container}>
            <SegmentedTabs tabs={PERIODS} value={preset} onChange={setPreset} />

            {isLoading ? (
                <SplashScreen />
            ) : isError || !data ? (
                <PrincipalError error="No se pudo obtener el resumen financiero!" />
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                >
                    <Text style={styles.period}>
                        {formatDay(data.period.from)} –{" "}
                        {formatDay(data.period.to)}
                    </Text>

                    {data.byCurrency.length === 0 ? (
                        <EmptyList
                            title="Sin movimientos en el periodo"
                            description="Registra un ingreso o un gasto para ver el resumen de esta propiedad."
                        />
                    ) : (
                        data.byCurrency.map((item) => (
                            <CurrencyCard key={item.currency} data={item} />
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 32,
        gap: 12,
    },

    period: {
        fontSize: 12,
        color: Palette.textMuted,
    },

    card: {
        backgroundColor: Palette.surface,
        borderWidth: 1,
        borderColor: Palette.border,
        borderRadius: 16,
        padding: 16,
        gap: 16,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    net: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 2,
    },

    currencyTag: {
        fontSize: 11,
        fontWeight: "700",
        color: Palette.accentStrong,
        backgroundColor: Palette.accentSoft,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        overflow: "hidden",
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: 14,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Palette.borderSoft,
    },

    metric: {
        width: "50%",
        gap: 2,
        paddingRight: 8,
    },

    metricLabel: {
        fontSize: 12,
        color: Palette.textMuted,
    },

    metricValue: {
        fontSize: 14,
        fontWeight: "700",
    },

    overdue: {
        backgroundColor: Palette.dangerSoft,
        borderRadius: 12,
        padding: 12,
        gap: 2,
    },

    overdueTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: Palette.danger,
    },

    overdueText: {
        fontSize: 12,
        color: Palette.danger,
    },
});
