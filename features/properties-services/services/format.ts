import type { Tone } from "../../../themes/themes";
import type {
    Currency,
    OfferingScope,
    PriceTypeAgreement,
    ServiceRequestAction,
    ServiceRequestDetailResponse,
    ServiceRequestStatus,
} from "../api.response";

export { formatDate } from "../../contract/services/format";

// Solo presentación: los montos llegan como string decimal.
export function formatPrice(value: string | null, currency: Currency): string {
    if (value === null) return "Por acordar";
    const amount = Number(value);
    if (Number.isNaN(amount)) return value;
    return `${amount.toLocaleString("es-CO")} ${currency}`;
}

export const REQUEST_STATUS: Record<
    ServiceRequestStatus,
    { label: string; tone: Tone }
> = {
    REQUESTED: { label: "Solicitado", tone: "warning" },
    ACCEPTED: { label: "Aceptado", tone: "accent" },
    IN_PROGRESS: { label: "En curso", tone: "accent" },
    COMPLETED: { label: "Completado", tone: "success" },
    REJECTED: { label: "Rechazado", tone: "danger" },
    CANCELLED: { label: "Cancelado", tone: "neutral" },
};

export const REQUEST_STATUS_TABS: { label: string; value: "ALL" | ServiceRequestStatus }[] = [
    { label: "Todas", value: "ALL" },
    { label: "Solicitadas", value: "REQUESTED" },
    { label: "Aceptadas", value: "ACCEPTED" },
    { label: "En curso", value: "IN_PROGRESS" },
    { label: "Completadas", value: "COMPLETED" },
    { label: "Rechazadas", value: "REJECTED" },
    { label: "Canceladas", value: "CANCELLED" },
];

export const PRICE_TYPE_LABEL: Record<PriceTypeAgreement, string> = {
    FIXED: "Fijo",
    NEGOTIABLE: "Negociable",
    CUSTOM_QUOTE: "Cotización",
    PERCENTAGE: "Porcentaje",
};

export const SCOPE_LABEL: Record<OfferingScope, string> = {
    PUBLIC: "Público",
    PROPERTY: "Exclusivo de inmueble",
};

export const ACTION_LABEL: Record<ServiceRequestAction, string> = {
    CREATED: "Solicitud creada",
    ACCEPTED: "Solicitud aceptada",
    REJECTED: "Solicitud rechazada",
    STARTED: "Trabajo iniciado",
    COMPLETED: "Servicio completado",
    CANCELLED: "Solicitud cancelada",
    PRICE_PROPOSED: "Precio propuesto",
    PRICE_AGREED: "Precio acordado",
};

// Mensaje legible a partir del error del backend ({ message, error }).
export function apiErrorMessage(error: unknown, fallback: string): string {
    const message = (error as { response?: { data?: { message?: unknown } } })
        ?.response?.data?.message;
    return typeof message === "string" ? message : fallback;
}

export function isConflict(error: unknown): boolean {
    return (error as { response?: { status?: number } })?.response?.status === 409;
}

// Acciones disponibles según rol y estado (tabla de la guía del módulo).
export interface RequestPermissions {
    canAccept: boolean;
    canReject: boolean;
    canStart: boolean;
    canComplete: boolean;
    canCancel: boolean;
    cancelNeedsReason: boolean;
    canPropose: boolean;
    canAcceptPrice: boolean;
    waitingOtherParty: boolean;
}

export function requestPermissions(
    request: ServiceRequestDetailResponse,
    userId: string | null,
): RequestPermissions {
    const isProvider = request.providerUserId === userId;
    const isRequester = request.requestedByUserId === userId;
    const { status, agreedPrice } = request;
    const type = request.offering.priceTypeAgreement;

    const negotiable =
        type !== "FIXED" &&
        agreedPrice === null &&
        (status === "REQUESTED" || status === "ACCEPTED");
    const hasProposal = request.proposedPrice !== null;
    const proposedByMe = request.proposedByUserId === userId;

    return {
        canAccept: isProvider && status === "REQUESTED",
        canReject: isProvider && status === "REQUESTED",
        canStart: isProvider && status === "ACCEPTED" && agreedPrice !== null,
        canComplete: isProvider && status === "IN_PROGRESS",
        canCancel:
            (isRequester && (status === "REQUESTED" || status === "ACCEPTED")) ||
            (isProvider && (status === "ACCEPTED" || status === "IN_PROGRESS")),
        cancelNeedsReason: !(isRequester && status === "REQUESTED"),
        canPropose: negotiable && (type !== "CUSTOM_QUOTE" || isProvider),
        canAcceptPrice: negotiable && hasProposal && !proposedByMe,
        waitingOtherParty: negotiable && hasProposal && proposedByMe,
    };
}
