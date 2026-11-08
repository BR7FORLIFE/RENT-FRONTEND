import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrincipalError } from "../../../components/error";
import { EmptyList } from "../../../components/info";
import SplashScreen from "../../../components/splash-screen";
import {
    SegmentedTabs,
    type SegmentedTab,
} from "../../../components/ui/segmented-tabs";
import { Palette } from "../../../themes/themes";
import { PropertyMemberMe } from "../../property-registration/api";
import { FINANCE_POLICY } from "../../finance-reports/services/format";
import { GetForecast } from "../api";
import {
    CATEGORY_LABEL,
    cop,
    compact,
    monthLong,
    monthShort,
    pct,
    SERIES,
} from "../services/format";
import type { ForecastReady, Trend } from "../types";
import {
    BarChart,
    ContributionBars,
    Legend,
    LineChart,
    StackedShare,
} from "./charts";

type Horizon = "3" | "6" | "12";
const HORIZONS: SegmentedTab<Horizon>[] = [
    { label: "3 meses", value: "3" },
    { label: "6 meses", value: "6" },
    { label: "12 meses", value: "12" },
];

const TREND: Record<Trend, { label: string; color: string }> = {
    up: { label: "▲ al alza", color: Palette.success },
    down: { label: "▼ a la baja", color: Palette.danger },
    stable: { label: "● estable", color: Palette.textMuted },
};

function Card({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
            <View style={{ marginTop: 12 }}>{children}</View>
        </View>
    );
}

function Kpi({
    label,
    value,
    note,
    noteColor = Palette.textMuted,
}: {
    label: string;
    value: string;
    note?: string;
    noteColor?: string;
}) {
    return (
        <View style={styles.kpi}>
            <Text style={styles.kpiLabel}>{label}</Text>
            <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>
                {value}
            </Text>
            {note && <Text style={[styles.kpiNote, { color: noteColor }]}>{note}</Text>}
        </View>
    );
}

function Dashboard({ data }: { data: ForecastReady }) {
    const hist = data.history.slice(-12);
    const histBack = new Map(data.backtest.map((b) => [b.month, b.predicted]));
    const labels = [...hist.map((h) => monthShort(h.month)), ...data.forecast.map((f) => monthShort(f.month))];
    const titles = [...hist.map((h) => monthLong(h.month)), ...data.forecast.map((f) => `${monthLong(f.month)} (pronóstico)`)];
    const nh = hist.length;
    const nf = data.forecast.length;
    const pad = <T,>(n: number, fill: T) => Array.from({ length: n }, () => fill);

    const realVals = [...hist.map((h) => h.net), ...pad<number | null>(nf, null)];
    const fitVals = [...hist.map((h) => histBack.get(h.month) ?? null), ...pad<number | null>(nf, null)];
    // la línea del pronóstico arranca en el último mes real para que se vea continua
    const fcVals = [
        ...pad<number | null>(nh - 1, null),
        hist[nh - 1].net,
        ...data.forecast.map((f) => f.predicted),
    ];
    const low = [...pad<number | null>(nh - 1, null), hist[nh - 1].net, ...data.forecast.map((f) => f.low)];
    const high = [...pad<number | null>(nh - 1, null), hist[nh - 1].net, ...data.forecast.map((f) => f.high)];

    const bars = data.history.slice(-8);
    const collection = data.history.slice(-12).map((h) => (h.rentBilled > 0 ? h.rentCollected / h.rentBilled : 0));
    const lastCollection = collection[collection.length - 1];

    const expenseItems = data.categories.expense.map((c, i) => ({
        label: CATEGORY_LABEL[c.category] ?? c.category,
        value: c.total,
        color: [SERIES.blue, SERIES.amber, SERIES.teal, SERIES.violet][i] ?? SERIES.gray,
    }));
    const incomeItems = data.categories.income.map((c, i) => ({
        label: CATEGORY_LABEL[c.category] ?? c.category,
        value: c.total,
        color: [SERIES.blue, SERIES.amber, SERIES.teal, SERIES.violet][i] ?? SERIES.gray,
    }));

    const next = data.forecast[0];
    const m = data.metrics;
    const trend = TREND[data.summary.trend];

    return (
        <>
            <View style={styles.kpiGrid}>
                <Kpi
                    label={`Saldo previsto ${monthShort(next.month)}`}
                    value={cop(next.predicted)}
                    note={trend.label}
                    noteColor={trend.color}
                />
                <Kpi
                    label={`Total próximos ${nf} meses`}
                    value={cop(data.summary.forecastTotal)}
                    note={`~${compact(data.summary.forecastTotal / nf)} al mes`}
                />
                <Kpi
                    label="Promedio histórico"
                    value={cop(data.summary.historyAverage)}
                    note={`${data.history.length} meses cerrados`}
                />
                <Kpi
                    label="Canon en mora"
                    value={cop(data.overdueIncomeTotal)}
                    note={data.overdueIncomeTotal > 0 ? "Pendiente de cobro" : "Sin mora"}
                    noteColor={data.overdueIncomeTotal > 0 ? Palette.danger : Palette.success}
                />
            </View>

            <Card
                title="Saldo mensual: real y pronóstico"
                subtitle="Ingresos pagados menos gastos pagados. La zona gris es el futuro."
            >
                <Legend
                    items={[
                        { color: SERIES.blue, label: "Real" },
                        { color: SERIES.gray, label: "Ajuste del modelo", dashed: true },
                        { color: SERIES.teal, label: "Pronóstico" },
                    ]}
                />
                <LineChart
                    labels={labels}
                    titles={titles}
                    forecastFrom={nh}
                    series={[
                        { key: "fit", label: "Ajuste del modelo", color: SERIES.gray, values: fitVals, dashed: true },
                        { key: "real", label: "Real", color: SERIES.blue, values: realVals },
                        { key: "fc", label: "Pronóstico", color: SERIES.teal, values: fcVals },
                    ]}
                    band={{ low, high, color: SERIES.teal }}
                />
            </Card>

            <Card
                title="Ingresos vs gastos"
                subtitle="Últimos meses cerrados, solo movimientos pagados."
            >
                <Legend
                    items={[
                        { color: SERIES.blue, label: "Ingresos" },
                        { color: SERIES.amber, label: "Gastos" },
                    ]}
                />
                <BarChart
                    labels={bars.map((b) => monthShort(b.month))}
                    titles={bars.map((b) => monthLong(b.month))}
                    series={[
                        { key: "in", label: "Ingresos", color: SERIES.blue, values: bars.map((b) => b.income) },
                        { key: "ex", label: "Gastos", color: SERIES.amber, values: bars.map((b) => b.expense) },
                    ]}
                />
            </Card>

            <Card
                title="Ingresos y gastos esperados"
                subtitle="Estimación del modelo para los próximos meses (gasto = promedio reciente)."
            >
                <Legend
                    items={[
                        { color: SERIES.blue, label: "Ingresos esperados" },
                        { color: SERIES.amber, label: "Gastos esperados" },
                    ]}
                />
                <BarChart
                    labels={data.forecast.map((f) => monthShort(f.month))}
                    titles={data.forecast.map((f) => monthLong(f.month))}
                    series={[
                        { key: "in", label: "Ingresos esperados", color: SERIES.blue, values: data.forecast.map((f) => Math.max(f.expectedIncome, 0)) },
                        { key: "ex", label: "Gastos esperados", color: SERIES.amber, values: data.forecast.map((f) => f.expectedExpense) },
                    ]}
                />
            </Card>

            <Card
                title="Cobranza del canon"
                subtitle={`Porcentaje del canon facturado que se cobró cada mes. Último mes: ${pct(lastCollection)}.`}
            >
                <BarChart
                    labels={hist.map((h) => monthShort(h.month))}
                    titles={hist.map((h) => monthLong(h.month))}
                    format={(v) => pct(v)}
                    max={1}
                    refLine={{ value: 1, label: "100 % cobrado" }}
                    series={[{ key: "c", label: "Cobrado", color: SERIES.teal, values: collection }]}
                />
            </Card>

            <Card
                title={`Qué mueve el pronóstico de ${monthShort(next.month)}`}
                subtitle="Aporte de cada variable al saldo previsto, respecto a un mes promedio. Azul suma, naranja resta."
            >
                <ContributionBars items={data.drivers.items.slice(0, 6)} />
            </Card>

            {expenseItems.length > 0 && (
                <Card title="En qué se van los gastos" subtitle="Últimos 12 meses.">
                    <StackedShare items={expenseItems} />
                </Card>
            )}
            {incomeItems.length > 0 && (
                <Card title="De dónde vienen los ingresos" subtitle="Últimos 12 meses.">
                    <StackedShare items={incomeItems} />
                </Card>
            )}

            <Card title="Qué tan confiable es" subtitle={`Evaluado sobre ${m.months} meses del historial.`}>
                <View style={styles.metricsRow}>
                    <Kpi label="Error medio" value={cop(m.mae)} />
                    <Kpi
                        label="Mejora vs. repetir el mes anterior"
                        value={m.improvementVsBaseline === null ? "—" : pct(m.improvementVsBaseline)}
                    />
                </View>
                <Text style={styles.disclaimer}>
                    Es una estimación estadística (regresión lineal) basada en tu historial. Los valores en USD se
                    convierten a {data.usdToCop.toLocaleString("es-CO")} COP por dólar. Con más meses de historial el
                    pronóstico mejora.
                </Text>
            </Card>
        </>
    );
}

export function PropertyStatistics({ propertyId }: { propertyId: string }) {
    const [horizon, setHorizon] = useState<Horizon>("6");

    const member = useQuery({
        queryKey: ["propertyMemberMe", propertyId],
        queryFn: () => PropertyMemberMe(propertyId),
    });
    const canView = member.data?.policies.includes(FINANCE_POLICY.view) ?? false;

    const forecast = useQuery({
        queryKey: ["forecast", propertyId, horizon],
        queryFn: () => GetForecast(propertyId, Number(horizon)),
        enabled: canView,
        staleTime: 60000 * 5,
    });

    if (member.isLoading || (canView && forecast.isLoading)) return <SplashScreen />;
    if (member.isError || !member.data) {
        return <PrincipalError error="Error al obtener la información de esta propiedad!" />;
    }
    if (!canView) {
        return (
            <EmptyList
                title="Sin acceso a las estadísticas"
                description="Tu rol en esta propiedad no incluye consultar la información financiera."
            />
        );
    }
    if (forecast.isError || !forecast.data) {
        return <PrincipalError error="No se pudieron obtener las predicciones. Intenta de nuevo más tarde." />;
    }
    if (!forecast.data.ready) {
        return <EmptyList title="Aún no hay suficientes datos" description={forecast.data.reason} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <SegmentedTabs tabs={HORIZONS} value={horizon} onChange={setHorizon} />
            <Dashboard data={forecast.data} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32, gap: 16 },
    kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    kpi: {
        flexBasis: "47%",
        flexGrow: 1,
        backgroundColor: Palette.surfaceMuted,
        borderRadius: 12,
        padding: 12,
        gap: 2,
    },
    kpiLabel: { fontSize: 11, color: Palette.textMuted },
    kpiValue: { fontSize: 17, fontWeight: "800", color: Palette.textPrimary },
    kpiNote: { fontSize: 11, fontWeight: "600" },
    card: {
        borderWidth: 1,
        borderColor: Palette.border,
        borderRadius: 16,
        padding: 16,
        backgroundColor: Palette.surface,
    },
    cardTitle: { fontSize: 15, fontWeight: "800", color: Palette.textPrimary },
    cardSubtitle: { fontSize: 12, color: Palette.textMuted, marginTop: 2 },
    metricsRow: { flexDirection: "row", gap: 12 },
    disclaimer: { fontSize: 11, color: Palette.textMuted, marginTop: 12, lineHeight: 16 },
});
