import { z } from "zod";
import { createResourceImageSchema } from "../../property-registration/schemas/property-registration.schema";

export const StatusContractEnum = z.enum([
    "DRAFT",
    "PENDING_ACCEPTANCE",
    "PENDING_DOCUMENTATION",
    "ACTIVE",
    "REJECTED",
    "CANCELLED",
    "SUSPENDED",
    "FINISHED",
]);

export type StatusContractType = z.infer<typeof StatusContractEnum>;

export const contractSchema = z.object({
    id: z.uuid().optional(),
    propertyId: z.uuid(),
    landlordMemberId: z.uuid(),
    tenantMemberId: z.uuid(),
    monthlyRent: z.coerce.number(),
    depositAmount: z.coerce.number(),
    startDate: z.date(),
    endDate: z.date(),
    status: StatusContractEnum,
    createByUserId: z.uuid(),
    createAt: z.date().optional(),
    updateAt: z.date().optional(),
});

export type ContractType = z.infer<typeof contractSchema>;

//crear contratos
export const createContractSchema = z.object({
    propertyId: z.uuid(),
    landlordMemberId: z.uuid(),
    tenantMemberId: z.uuid(),
    monthlyRent: z.coerce.number(),
    depositAmount: z.coerce.number(),
    startDate: z.date(),
    endDate: z.date(),
    resources: z.array(createResourceImageSchema),
});

export type CreateContractType = z.infer<typeof createContractSchema>;

export const acceptedOrRejectedContractSchema = z.object({
    contractId: z.uuid(),
    propertyId: z.uuid(),
    status: z.enum(["ACCEPTED", "REJECTED"]),
});

export type AcceptedOrRejectedContractType = z.infer<
    typeof acceptedOrRejectedContractSchema
>;

export const loadContractDocumentSchema = z.object({
    propertyId: z.uuid(),
    resources: z.array(createResourceImageSchema),
});

export type LoadContractDocumentType = z.infer<
    typeof loadContractDocumentSchema
>;
