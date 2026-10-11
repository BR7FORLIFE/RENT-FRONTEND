import { api } from "../../core/api/api-config";
import { FINANCIAL_MODULE } from "../../core/api/paths";
import type { GetAll } from "../../types/global";
import type {
    OfferingScope,
    OfferingStatus,
    ServiceOfferingResponse,
    ServiceRequestDetailResponse,
    ServiceRequestResponse,
    ServiceRequestStatus,
    ServiceResponse,
} from "./api.response";
import type {
    CreateServiceOfferingType,
    CreateServiceRequestType,
    ReasonType,
    UpdateServiceOfferingType,
} from "./schemas/services.schema";

const SERVICES = `${FINANCIAL_MODULE}/services`;
const OFFERINGS = `${FINANCIAL_MODULE}/service-offerings`;
const REQUESTS = `${FINANCIAL_MODULE}/service-requests`;

export interface OfferingFilters {
    serviceId?: string;
    scope?: OfferingScope;
    status?: OfferingStatus;
    onlyValid?: boolean;
    sortBy?: "createdAt" | "basePrice" | "validUntil";
    sortOrder?: "asc" | "desc";
}

// catalogo
export async function GetAllServices(page: number, limit: number) {
    const { data } = await api.get<GetAll<ServiceResponse[]>>(SERVICES, {
        params: { page, limit },
    });
    return data;
}

// ofertas
export async function GetAllOfferings(
    page: number,
    limit: number,
    filters: OfferingFilters = {},
) {
    const { data } = await api.get<GetAll<ServiceOfferingResponse[]>>(
        OFFERINGS,
        { params: { page, limit, ...filters } },
    );
    return data;
}

export async function GetMyOfferings(page: number, limit: number) {
    const { data } = await api.get<GetAll<ServiceOfferingResponse[]>>(
        `${OFFERINGS}/mine`,
        { params: { page, limit } },
    );
    return data;
}

export async function GetOfferingById(id: string) {
    const { data } = await api.get<ServiceOfferingResponse>(
        `${OFFERINGS}/${id}`,
    );
    return data;
}

export async function CreateOffering(body: CreateServiceOfferingType) {
    const { data } = await api.post<ServiceOfferingResponse>(OFFERINGS, body);
    return data;
}

export async function UpdateOffering(
    id: string,
    body: UpdateServiceOfferingType,
) {
    const { data } = await api.patch<ServiceOfferingResponse>(
        `${OFFERINGS}/${id}`,
        body,
    );
    return data;
}

export async function ChangeOfferingStatus(id: string, status: OfferingStatus) {
    const { data } = await api.patch<ServiceOfferingResponse>(
        `${OFFERINGS}/${id}/status`,
        { status },
    );
    return data;
}

// solicitudes
type RequestList = GetAll<ServiceRequestResponse[]>;

export async function CreateServiceRequest(body: CreateServiceRequestType) {
    const { data } = await api.post<ServiceRequestDetailResponse>(
        REQUESTS,
        body,
    );
    return data;
}

export async function GetMyRequests(
    page: number,
    limit: number,
    status?: ServiceRequestStatus,
) {
    const { data } = await api.get<RequestList>(`${REQUESTS}/mine`, {
        params: { page, limit, status },
    });
    return data;
}

export async function GetProviderRequests(
    page: number,
    limit: number,
    status?: ServiceRequestStatus,
) {
    const { data } = await api.get<RequestList>(`${REQUESTS}/provider/mine`, {
        params: { page, limit, status },
    });
    return data;
}

export async function GetPropertyRequests(
    propertyId: string,
    page: number,
    limit: number,
) {
    const { data } = await api.get<RequestList>(
        `${REQUESTS}/property/${propertyId}`,
        { params: { page, limit } },
    );
    return data;
}

export async function GetRequestById(id: string) {
    const { data } = await api.get<ServiceRequestDetailResponse>(
        `${REQUESTS}/${id}`,
    );
    return data;
}

export type RequestTransition =
    | "accept"
    | "reject"
    | "start"
    | "complete"
    | "cancel";

export async function TransitionRequest(
    id: string,
    action: RequestTransition,
    body: ReasonType = {},
) {
    const { data } = await api.post<ServiceRequestDetailResponse>(
        `${REQUESTS}/${id}/${action}`,
        body,
    );
    return data;
}

export async function ProposeRequestPrice(id: string, price: string) {
    const { data } = await api.post<ServiceRequestDetailResponse>(
        `${REQUESTS}/${id}/price/propose`,
        { price },
    );
    return data;
}

export async function AcceptRequestPrice(id: string) {
    const { data } = await api.post<ServiceRequestDetailResponse>(
        `${REQUESTS}/${id}/price/accept`,
    );
    return data;
}
