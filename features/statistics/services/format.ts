const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// "2026-10" -> "oct"
export const monthShort = (m: string) => MONTHS[Number(m.slice(5, 7)) - 1] ?? m;

// "2026-10" -> "oct 2026"
export const monthLong = (m: string) => `${monthShort(m)} ${m.slice(0, 4)}`;

// 1_250_000 -> "1,25 M" ; 480_000 -> "480 mil"
export function compact(value: number): string {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    if (abs >= 1_000_000) {
        return `${sign}${(abs / 1_000_000).toLocaleString("es-CO", { maximumFractionDigits: 2 })} M`;
    }
    if (abs >= 1_000) {
        return `${sign}${Math.round(abs / 1_000).toLocaleString("es-CO")} mil`;
    }
    return `${sign}${Math.round(abs)}`;
}

export const cop = (value: number) =>
    `$${Math.round(value).toLocaleString("es-CO")} COP`;

export const pct = (value: number) => `${Math.round(value * 100)}%`;

export const CATEGORY_LABEL: Record<string, string> = {
    RENT: "Arrendamiento",
    SERVICE: "Administración",
    UTILITY: "Servicios públicos",
    MAINTENANCE: "Mantenimiento",
    DEPOSIT: "Depósito",
    OTHER: "Otros",
};

// Categórico en orden fijo (validado). El gris se reserva para "Otros".
export const SERIES = {
    blue: "#2563EB",
    amber: "#D97706",
    teal: "#0D9488",
    violet: "#7C3AED",
    gray: "#64748B",
};
