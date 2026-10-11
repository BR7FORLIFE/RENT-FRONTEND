import type { Tone } from "../../../themes/themes";

// Solo presentación: "AGENTE_INMOBILIARIO" -> "Agente inmobiliario".
export function formatEnumLabel(value: string): string {
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const MEMBER_STATUS: Record<string, { label: string; tone: Tone }> = {
  ACTIVE: { label: "Activo", tone: "success" },
  IN_PROCESS: { label: "En proceso", tone: "warning" },
  DESACTIVE: { label: "Desactivado", tone: "neutral" },
};

export function memberStatusInfo(status: string): { label: string; tone: Tone } {
  return MEMBER_STATUS[status] ?? { label: status, tone: "neutral" };
}
