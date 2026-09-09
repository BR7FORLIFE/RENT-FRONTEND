type StatusContractType =
    | "DRAFT"
    | "PENDING_ACCEPTANCE"
    | "PENDING_DOCUMENTATION"
    | "ACTIVE"
    | "REJECTED"
    | "CANCELLED"
    | "SUSPENDED"
    | "FINISHED";

export interface ContractInfoResponse {
    id: string;
    propertyId: string;
    landlordMemberId: string;
    tenantMemberId: string;
    monthlyRent: number;
    depositAmount: number;
    startDate: Date;
    endDate: Date;
    status: StatusContractType;
    createByUserId: string;
}
export interface ContractDraftInfoResponse {
    id: string;
    content: string;
    version: number;
    landlordAgreed: boolean;
    tenantAgreed: boolean;
    createdByPropertyMemberId: string;
    createdAt: Date;
    updateAt: Date;
    propertyId: string;
    landlordMemberId: string;
    tenantMemberId: string;
    monthlyRent: number;
    depositAmount: number;
    startDate: Date;
    endDate: Date;
}
