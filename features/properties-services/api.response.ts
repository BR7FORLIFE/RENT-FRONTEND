export type Currency = "COP" | "USD";
export type OfferingScope = "PROPERTY" | "PUBLIC";
export type OfferingStatus = "ACTIVE" | "INACTIVE";
export type PriceTypeAgreement =
    | "FIXED"
    | "NEGOTIABLE"
    | "CUSTOM_QUOTE"
    | "PERCENTAGE";
export type ServiceRequestStatus =
    | "REQUESTED"
    | "ACCEPTED"
    | "REJECTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
export type ServiceRequestAction =
    | "CREATED"
    | "ACCEPTED"
    | "REJECTED"
    | "STARTED"
    | "COMPLETED"
    | "CANCELLED"
    | "PRICE_PROPOSED"
    | "PRICE_AGREED";

export interface ServiceResponse {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceOfferingResponse {
    id: string;
    serviceId: string;
    providerUserId: string;
    propertyMemberId: string | null;
    scope: OfferingScope;
    status: OfferingStatus;
    priceTypeAgreement: PriceTypeAgreement;
    basePrice: string;
    currency: Currency;
    validFrom: string;
    validUntil: string | null;
    createdAt: string;
    updatedAt: string;
    service: { id: string; name: string; isActive: boolean };
    propertyMember: { id: string; propertyId: string; status: string } | null;
}

export interface ServiceRequestHistoryResponse {
    id: string;
    serviceRequestId: string;
    action: ServiceRequestAction;
    fromStatus: ServiceRequestStatus | null;
    toStatus: ServiceRequestStatus;
    actorUserId: string;
    reason: string | null;
    createdAt: string;
}

export interface ServiceRequestResponse {
    id: string;
    serviceOfferingId: string;
    propertyId: string;
    requestedByUserId: string;
    providerUserId: string;
    status: ServiceRequestStatus;
    notes: string | null;
    publishedPrice: string;
    proposedPrice: string | null;
    proposedByUserId: string | null;
    agreedPrice: string | null;
    priceAgreedAt: string | null;
    currency: Currency;
    requestedAt: string;
    acceptedAt: string | null;
    startedAt: string | null;
    completedAt: string | null;
    cancelledAt: string | null;
    createdAt: string;
    updatedAt: string;
    offering: {
        id: string;
        scope: OfferingScope;
        priceTypeAgreement: PriceTypeAgreement;
        service: { id: string; name: string };
    };
    property: { id: string; propertyName: string };
}

export interface ServiceRequestDetailResponse extends ServiceRequestResponse {
    history: ServiceRequestHistoryResponse[];
}
