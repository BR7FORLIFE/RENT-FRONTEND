import type { Tone } from "../../../themes/themes";
import type { StatusContractType } from "../api.response";

// Solo presentación: el backend sigue siendo la fuente de los valores.
export function formatMoney(value: number | string): string {
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return `$${amount.toLocaleString("es-CO")}`;
}

export function formatDate(value: Date | string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const CONTRACT_STATUS: Record<
  StatusContractType,
  { label: string; tone: Tone }
> = {
  DRAFT: { label: "Borrador", tone: "neutral" },
  PENDING_ACCEPTANCE: { label: "Pendiente de aceptación", tone: "warning" },
  PENDING_DOCUMENTATION: { label: "Pendiente de documentos", tone: "warning" },
  ACTIVE: { label: "Activo", tone: "success" },
  REJECTED: { label: "Rechazado", tone: "danger" },
  CANCELLED: { label: "Cancelado", tone: "danger" },
  SUSPENDED: { label: "Suspendido", tone: "warning" },
  FINISHED: { label: "Finalizado", tone: "neutral" },
};
