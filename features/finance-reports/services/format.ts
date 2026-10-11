import type { Tone } from "../../../themes/themes";
import type {
    Category,
    Currency,
    RecordStatus,
    TransactionType,
} from "../schemas/transaction.schema";
import type { FinancialTransaction } from "../types";

// Solo presentación: los importes se conservan como string para operar/enviar.
export function formatCurrency(value: string, currency: Currency): string {
    const amount = Number(value);
    if (Number.isNaN(amount)) return value;
    return `${amount.toLocaleString("es-CO", {
        minimumFractionDigits: currency === "USD" ? 2 : 0,
        maximumFractionDigits: 2,
    })} ${currency}`;
}

// Fechas de solo día (vencimiento) se muestran en UTC para no desplazar el día.
export function formatDay(value: string | null): string {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
}

export function formatDateTime(value: string | null): string {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Bogota",
    });
}

export const TYPE_LABEL: Record<TransactionType, string> = {
    INCOME: "Ingreso",
    EXPENSE: "Gasto",
};

export const CATEGORY_LABEL: Record<Category, string> = {
    RENT: "Arrendamiento",
    SERVICE: "Servicio",
    UTILITY: "Servicios públicos",
    MAINTENANCE: "Mantenimiento",
    DEPOSIT: "Depósito",
    OTHER: "Otro",
};

export const STATUS_INFO: Record<RecordStatus, { label: string; tone: Tone }> = {
    PLANNED: { label: "Planeado", tone: "neutral" },
    PENDING: { label: "Pendiente", tone: "warning" },
    PAID: { label: "Pagado", tone: "success" },
    OVERDUE: { label: "Vencido", tone: "danger" },
    CANCELLED: { label: "Cancelado", tone: "neutral" },
};

export const isImmutable = (status: RecordStatus) =>
    status === "PAID" || status === "CANCELLED";

export function isPastDue(t: FinancialTransaction): boolean {
    return (
        !isImmutable(t.status) &&
        !!t.dueDate &&
        new Date(t.dueDate).getTime() < Date.now()
    );
}

export interface StatusAction {
    label: string;
    kind: "pay" | RecordStatus;
    destructive?: boolean;
}

// Acciones sugeridas por estado (máquina de estados del backend, sección 2.3).
export const STATUS_ACTIONS: Record<RecordStatus, StatusAction[]> = {
    PLANNED: [
        { label: "Marcar pagado", kind: "pay" },
        { label: "Marcar pendiente", kind: "PENDING" },
        { label: "Cancelar", kind: "CANCELLED", destructive: true },
    ],
    PENDING: [
        { label: "Marcar pagado", kind: "pay" },
        { label: "Marcar vencido", kind: "OVERDUE" },
        { label: "Cancelar", kind: "CANCELLED", destructive: true },
    ],
    OVERDUE: [
        { label: "Marcar pagado", kind: "pay" },
        { label: "Volver a pendiente", kind: "PENDING" },
        { label: "Cancelar", kind: "CANCELLED", destructive: true },
    ],
    PAID: [],
    CANCELLED: [],
};

// Permisos (UX): el backend los vuelve a validar.
export const FINANCE_POLICY = {
    view: "VER_FINANZAS",
    create: "REGISTRAR_MOVIMIENTOS_FINANCIEROS",
    edit: "EDITAR_MOVIMIENTOS_FINANCIEROS",
} as const;

export type PeriodPreset = "MONTH" | "PREV_MONTH" | "QUARTER" | "YEAR";

export function periodRange(preset: PeriodPreset, now = new Date()) {
    const y = now.getFullYear();
    const m = now.getMonth();
    let start: Date;
    let end: Date;
    switch (preset) {
        case "PREV_MONTH":
            start = new Date(y, m - 1, 1);
            end = new Date(y, m, 0, 23, 59, 59, 999);
            break;
        case "QUARTER": {
            const q = Math.floor(m / 3) * 3;
            start = new Date(y, q, 1);
            end = new Date(y, q + 3, 0, 23, 59, 59, 999);
            break;
        }
        case "YEAR":
            start = new Date(y, 0, 1);
            end = new Date(y, 11, 31, 23, 59, 59, 999);
            break;
        default:
            start = new Date(y, m, 1);
            end = new Date(y, m + 1, 0, 23, 59, 59, 999);
    }
    return { from: start.toISOString(), to: end.toISOString() };
}

export function errorMessage(error: unknown, fallback: string): string {
    const data = (error as { response?: { data?: { message?: unknown } } })
        ?.response?.data;
    return typeof data?.message === "string" ? data.message : fallback;
}
