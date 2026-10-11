export const Colors = {
    PRIMARY: "#2E5BFF",
    SECONDARY: "#0F172A",
    TERTIARY: "#0D9488",
    NEUTRAL: "#64748B",
};

// Tokens de diseño usados por las pantallas de contratos, miembros y roles.
// Reflejan los valores que ya se usaban de forma dispersa (slate + azul 600).
export const Palette = {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceMuted: "#F8FAFC",
    border: "#E2E8F0",
    borderSoft: "#F1F5F9",
    borderStrong: "#CBD5E1",

    textPrimary: "#111827",
    textSecondary: "#475569",
    textMuted: "#64748B",
    textFaint: "#94A3B8",

    accent: "#2563EB",
    accentStrong: "#1D4ED8",
    accentSoft: "#EFF6FF",
    accentBorder: "#BFDBFE",

    success: "#047857",
    successSoft: "#ECFDF5",
    warning: "#B45309",
    warningSoft: "#FFFBEB",
    danger: "#B91C1C",
    dangerSoft: "#FEF2F2",
};

export const Radius = {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 999,
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 32,
};

export type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

export const ToneStyles: Record<
    Tone,
    { background: string; text: string; dot: string }
> = {
    neutral: {
        background: Palette.surfaceMuted,
        text: Palette.textMuted,
        dot: Palette.textFaint,
    },
    accent: {
        background: Palette.accentSoft,
        text: Palette.accentStrong,
        dot: Palette.accent,
    },
    success: {
        background: Palette.successSoft,
        text: Palette.success,
        dot: "#10B981",
    },
    warning: {
        background: Palette.warningSoft,
        text: Palette.warning,
        dot: "#F59E0B",
    },
    danger: {
        background: Palette.dangerSoft,
        text: Palette.danger,
        dot: "#EF4444",
    },
};
