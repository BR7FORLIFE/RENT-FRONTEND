import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import { Palette } from "../../../themes/themes";
import { compact } from "../services/format";

const PAD = { left: 46, right: 10, top: 10, bottom: 24 };
const GRID = Palette.border;

export interface LineSeries {
    key: string;
    label: string;
    color: string;
    values: (number | null)[];
    dashed?: boolean;
}

export interface Band {
    low: (number | null)[];
    high: (number | null)[];
    color: string;
}

function niceTicks(min: number, max: number, count = 4) {
    if (min === max) {
        max = min + 1;
    }
    const raw = (max - min) / count;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
    const start = Math.floor(min / step) * step;
    const ticks: number[] = [];
    for (let v = start; v < max + step; v += step) ticks.push(v);
    return ticks;
}

function roundedTop(x: number, y: number, w: number, h: number, r: number) {
    const rr = Math.min(r, w / 2, h);
    return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`;
}

export interface ReadoutRow {
    color: string;
    label: string;
    value: string;
    dashed?: boolean;
}

export function Legend({ items }: { items: { color: string; label: string; dashed?: boolean }[] }) {
    return (
        <View style={styles.legend}>
            {items.map((item) => (
                <View key={item.label} style={styles.legendItem}>
                    <View
                        style={[
                            styles.swatch,
                            item.dashed
                                ? { borderColor: item.color, borderWidth: 2, backgroundColor: "transparent" }
                                : { backgroundColor: item.color },
                        ]}
                    />
                    <Text style={styles.legendText}>{item.label}</Text>
                </View>
            ))}
        </View>
    );
}

function Readout({ title, rows }: { title: string; rows: ReadoutRow[] | null }) {
    if (!rows) {
        return <Text style={styles.hint}>Toca un mes para ver el detalle</Text>;
    }
    return (
        <View style={styles.readout}>
            <Text style={styles.readoutTitle}>{title}</Text>
            {rows.map((row) => (
                <View key={row.label} style={styles.readoutRow}>
                    <View style={[styles.dot, { backgroundColor: row.color }]} />
                    <Text style={styles.readoutLabel}>{row.label}</Text>
                    <Text style={styles.readoutValue}>{row.value}</Text>
                </View>
            ))}
        </View>
    );
}

function useWidth() {
    const [width, setWidth] = useState(0);
    return { width, onLayout: (e: { nativeEvent: { layout: { width: number } } }) => setWidth(e.nativeEvent.layout.width) };
}

interface LineChartProps {
    labels: string[]; // etiqueta corta del eje X
    titles: string[]; // etiqueta larga para el detalle
    series: LineSeries[];
    band?: Band;
    height?: number;
    format?: (v: number) => string;
    // índice desde el que los meses son pronóstico (sombreado de fondo)
    forecastFrom?: number;
}

export function LineChart({
    labels,
    titles,
    series,
    band,
    height = 220,
    format = compact,
    forecastFrom,
}: LineChartProps) {
    const { width, onLayout } = useWidth();
    const [selected, setSelected] = useState<number | null>(null);

    const all = [
        ...series.flatMap((s) => s.values),
        ...(band ? [...band.low, ...band.high] : []),
    ].filter((v): v is number => v !== null);
    const min = Math.min(0, ...all);
    const max = Math.max(...all, 1);
    const ticks = niceTicks(min, max);
    const lo = ticks[0];
    const hi = ticks[ticks.length - 1];

    const innerW = Math.max(width - PAD.left - PAD.right, 1);
    const innerH = height - PAD.top - PAD.bottom;
    const n = labels.length;
    const step = n > 1 ? innerW / (n - 1) : innerW;
    const x = (i: number) => PAD.left + (n > 1 ? i * step : innerW / 2);
    const y = (v: number) => PAD.top + innerH - ((v - lo) / (hi - lo || 1)) * innerH;

    const linePath = (values: (number | null)[]) => {
        let d = "";
        let pen = false;
        values.forEach((v, i) => {
            if (v === null) {
                pen = false;
                return;
            }
            d += `${pen ? "L" : "M"}${x(i)},${y(v)} `;
            pen = true;
        });
        return d;
    };

    const bandPath = () => {
        if (!band) return "";
        const idx = band.low.map((_, i) => i).filter((i) => band.low[i] !== null && band.high[i] !== null);
        if (idx.length < 2) return "";
        const top = idx.map((i, k) => `${k === 0 ? "M" : "L"}${x(i)},${y(band.high[i] as number)}`).join(" ");
        const bottom = [...idx].reverse().map((i) => `L${x(i)},${y(band.low[i] as number)}`).join(" ");
        return `${top} ${bottom} Z`;
    };

    const labelEvery = n > 10 ? 2 : 1;
    const rows: ReadoutRow[] | null =
        selected === null
            ? null
            : [
                  ...series
                      .filter((s) => s.values[selected] !== null)
                      .map((s) => ({
                          color: s.color,
                          label: s.label,
                          value: format(s.values[selected] as number),
                          dashed: s.dashed,
                      })),
                  ...(band && band.low[selected] !== null
                      ? [
                            {
                                color: band.color,
                                label: "Rango probable (80 %)",
                                value: `${format(band.low[selected] as number)} a ${format(band.high[selected] as number)}`,
                            },
                        ]
                      : []),
              ];

    return (
        <View>
            <Readout title={selected === null ? "" : titles[selected]} rows={rows} />
            <View onLayout={onLayout} style={{ height }}>
                {width > 0 && (
                    <Svg width={width} height={height}>
                        {forecastFrom !== undefined && forecastFrom < n && (
                            <Rect
                                x={x(forecastFrom) - step / 2}
                                y={PAD.top}
                                width={Math.max(x(n - 1) + step / 2 - (x(forecastFrom) - step / 2), 0)}
                                height={innerH}
                                fill={Palette.surfaceMuted}
                            />
                        )}
                        {ticks.map((t) => (
                            <G key={t}>
                                <Line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? Palette.borderStrong : GRID} strokeWidth={1} />
                                <SvgText x={PAD.left - 6} y={y(t) + 4} fontSize={10} fill={Palette.textMuted} textAnchor="end">
                                    {format(t)}
                                </SvgText>
                            </G>
                        ))}
                        {labels.map((l, i) =>
                            i % labelEvery === 0 ? (
                                <SvgText key={`${l}${i}`} x={x(i)} y={height - 6} fontSize={10} fill={Palette.textMuted} textAnchor="middle">
                                    {l}
                                </SvgText>
                            ) : null,
                        )}
                        {band && <Path d={bandPath()} fill={band.color} fillOpacity={0.15} />}
                        {selected !== null && (
                            <Line x1={x(selected)} x2={x(selected)} y1={PAD.top} y2={PAD.top + innerH} stroke={Palette.borderStrong} strokeWidth={1} />
                        )}
                        {series.map((s) => (
                            <Path
                                key={s.key}
                                d={linePath(s.values)}
                                stroke={s.color}
                                strokeWidth={2}
                                strokeDasharray={s.dashed ? "5 4" : undefined}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        ))}
                        {selected !== null &&
                            series.map((s) =>
                                s.values[selected] === null ? null : (
                                    <Circle key={s.key} cx={x(selected)} cy={y(s.values[selected] as number)} r={4.5} fill={s.color} stroke={Palette.surface} strokeWidth={2} />
                                ),
                            )}
                        {labels.map((_, i) => (
                            <Rect
                                key={`hit${i}`}
                                x={x(i) - (n > 1 ? step / 2 : innerW / 2)}
                                y={0}
                                width={n > 1 ? step : innerW}
                                height={height}
                                fill="transparent"
                                onPress={() => setSelected(i === selected ? null : i)}
                            />
                        ))}
                    </Svg>
                )}
            </View>
        </View>
    );
}

export interface BarSeries {
    key: string;
    label: string;
    color: string;
    values: number[];
}

interface BarChartProps {
    labels: string[];
    titles: string[];
    series: BarSeries[];
    height?: number;
    format?: (v: number) => string;
    max?: number;
    refLine?: { value: number; label: string };
}

export function BarChart({ labels, titles, series, height = 200, format = compact, max, refLine }: BarChartProps) {
    const { width, onLayout } = useWidth();
    const [selected, setSelected] = useState<number | null>(null);

    const top = max ?? Math.max(...series.flatMap((s) => s.values), 1);
    const ticks = niceTicks(0, top);
    const hi = ticks[ticks.length - 1];

    const innerW = Math.max(width - PAD.left - PAD.right, 1);
    const innerH = height - PAD.top - PAD.bottom;
    const n = labels.length;
    const group = innerW / Math.max(n, 1);
    const gap = 2; // separación entre fills
    const barW = Math.min(18, (group * 0.72 - gap * (series.length - 1)) / series.length);
    const y = (v: number) => PAD.top + innerH - (v / (hi || 1)) * innerH;

    const rows: ReadoutRow[] | null =
        selected === null
            ? null
            : series.map((s) => ({ color: s.color, label: s.label, value: format(s.values[selected]) }));

    return (
        <View>
            <Readout title={selected === null ? "" : titles[selected]} rows={rows} />
            <View onLayout={onLayout} style={{ height }}>
                {width > 0 && (
                    <Svg width={width} height={height}>
                        {ticks.map((t) => (
                            <G key={t}>
                                <Line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke={t === 0 ? Palette.borderStrong : GRID} strokeWidth={1} />
                                <SvgText x={PAD.left - 6} y={y(t) + 4} fontSize={10} fill={Palette.textMuted} textAnchor="end">
                                    {format(t)}
                                </SvgText>
                            </G>
                        ))}
                        {refLine && (
                            <Line x1={PAD.left} x2={width - PAD.right} y1={y(refLine.value)} y2={y(refLine.value)} stroke={Palette.textMuted} strokeWidth={1} strokeDasharray="4 4" />
                        )}
                        {labels.map((l, i) => {
                            const cx = PAD.left + group * i + group / 2;
                            const total = series.length * barW + gap * (series.length - 1);
                            return (
                                <G key={`${l}${i}`}>
                                    {series.map((s, k) => {
                                        const h = Math.max(((s.values[i] ?? 0) / (hi || 1)) * innerH, 0);
                                        const bx = cx - total / 2 + k * (barW + gap);
                                        return (
                                            <Path
                                                key={s.key}
                                                d={roundedTop(bx, y(s.values[i] ?? 0), barW, h, 4)}
                                                fill={s.color}
                                                opacity={selected === null || selected === i ? 1 : 0.45}
                                            />
                                        );
                                    })}
                                    <SvgText x={cx} y={height - 6} fontSize={10} fill={Palette.textMuted} textAnchor="middle">
                                        {l}
                                    </SvgText>
                                    <Rect x={PAD.left + group * i} y={0} width={group} height={height} fill="transparent" onPress={() => setSelected(i === selected ? null : i)} />
                                </G>
                            );
                        })}
                    </Svg>
                )}
            </View>
            {refLine && <Text style={styles.refNote}>--- {refLine.label}</Text>}
        </View>
    );
}

// Barras horizontales con signo: aportes de cada variable a la predicción.
export function ContributionBars({
    items,
    format = compact,
}: {
    items: { label: string; value: number }[];
    format?: (v: number) => string;
}) {
    const maxAbs = Math.max(...items.map((i) => Math.abs(i.value)), 1);
    return (
        <View style={{ gap: 10 }}>
            {items.map((item) => {
                const positive = item.value >= 0;
                const w = `${(Math.abs(item.value) / maxAbs) * 50}%` as const;
                return (
                    <View key={item.label} style={{ gap: 4 }}>
                        <View style={styles.contribHead}>
                            <Text style={styles.contribLabel} numberOfLines={1}>
                                {item.label}
                            </Text>
                            <Text style={styles.contribValue}>
                                {positive ? "+" : ""}
                                {format(item.value)}
                            </Text>
                        </View>
                        <View style={styles.contribTrack}>
                            <View style={styles.contribAxis} />
                            <View
                                style={[
                                    styles.contribBar,
                                    positive ? { left: "50%" } : { right: "50%" },
                                    { width: w, backgroundColor: positive ? "#2563EB" : "#D97706" },
                                ]}
                            />
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

// Barra apilada horizontal con lista (composición por categoría).
export function StackedShare({
    items,
    format = compact,
}: {
    items: { label: string; value: number; color: string }[];
    format?: (v: number) => string;
}) {
    const total = items.reduce((a, b) => a + b.value, 0) || 1;
    return (
        <View style={{ gap: 12 }}>
            <View style={styles.stack}>
                {items.map((item) => (
                    <View key={item.label} style={{ flex: item.value / total, backgroundColor: item.color, marginRight: 2 }} />
                ))}
            </View>
            {items.map((item) => (
                <View key={item.label} style={styles.shareRow}>
                    <View style={[styles.dot, { backgroundColor: item.color }]} />
                    <Text style={styles.shareLabel}>{item.label}</Text>
                    <Text style={styles.sharePct}>{Math.round((item.value / total) * 100)}%</Text>
                    <Text style={styles.shareValue}>{format(item.value)}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    legend: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginBottom: 8 },
    legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    swatch: { width: 14, height: 8, borderRadius: 2 },
    legendText: { fontSize: 12, color: Palette.textSecondary },
    hint: { fontSize: 12, color: Palette.textFaint, marginBottom: 6 },
    readout: {
        backgroundColor: Palette.surfaceMuted,
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
        gap: 4,
    },
    readoutTitle: { fontSize: 12, fontWeight: "700", color: Palette.textPrimary },
    readoutRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    readoutLabel: { flex: 1, fontSize: 12, color: Palette.textSecondary },
    readoutValue: { fontSize: 12, fontWeight: "700", color: Palette.textPrimary },
    dot: { width: 8, height: 8, borderRadius: 4 },
    refNote: { fontSize: 11, color: Palette.textMuted, marginTop: 2 },
    contribHead: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
    contribLabel: { flex: 1, fontSize: 12, color: Palette.textSecondary },
    contribValue: { fontSize: 12, fontWeight: "700", color: Palette.textPrimary },
    contribTrack: { height: 8, justifyContent: "center" },
    contribAxis: { position: "absolute", left: "50%", width: 1, height: 8, backgroundColor: Palette.borderStrong },
    contribBar: { position: "absolute", height: 8, borderRadius: 4 },
    stack: { flexDirection: "row", height: 12, borderRadius: 6, overflow: "hidden" },
    shareRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    shareLabel: { flex: 1, fontSize: 13, color: Palette.textSecondary },
    sharePct: { fontSize: 12, color: Palette.textMuted, width: 38, textAlign: "right" },
    shareValue: { fontSize: 13, fontWeight: "700", color: Palette.textPrimary, width: 80, textAlign: "right" },
});
