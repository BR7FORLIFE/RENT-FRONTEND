import { z } from "zod";

// Monto: hasta 10 enteros y 2 decimales, mayor a 0 (refleja el backend).
export const MONEY_REGEX = /^\d{1,10}(\.\d{1,2})?$/;

export const MoneySchema = z
    .string()
    .trim()
    .regex(MONEY_REGEX, "Monto inválido (máx. 2 decimales)")
    .refine((value) => Number(value) > 0, "El monto debe ser mayor a 0");

export const CurrencySchema = z.enum(["COP", "USD"]);
export const PriceTypeSchema = z.enum([
    "FIXED",
    "NEGOTIABLE",
    "CUSTOM_QUOTE",
    "PERCENTAGE",
]);

export const CreateServiceOfferingSchema = z
    .strictObject({
        serviceId: z.uuid(),
        scope: z.enum(["PUBLIC", "PROPERTY"]),
        propertyMemberId: z.uuid().optional(),
        priceTypeAgreement: PriceTypeSchema,
        basePrice: MoneySchema,
        currency: CurrencySchema,
        validFrom: z.string().optional(),
        validUntil: z.string().optional(),
    })
    .refine((v) => (v.scope === "PROPERTY") === !!v.propertyMemberId, {
        message: "El inmueble es obligatorio solo con alcance PROPERTY",
        path: ["propertyMemberId"],
    })
    .refine(
        (v) =>
            !v.validUntil ||
            (new Date(v.validUntil) > new Date() &&
                (!v.validFrom || new Date(v.validUntil) > new Date(v.validFrom))),
        { message: "La vigencia final debe ser futura", path: ["validUntil"] },
    );
export type CreateServiceOfferingType = z.infer<
    typeof CreateServiceOfferingSchema
>;

export const UpdateServiceOfferingSchema = z.strictObject({
    priceTypeAgreement: PriceTypeSchema.optional(),
    basePrice: MoneySchema.optional(),
    currency: CurrencySchema.optional(),
    validFrom: z.string().optional(),
    validUntil: z.string().nullable().optional(),
});
export type UpdateServiceOfferingType = z.infer<
    typeof UpdateServiceOfferingSchema
>;

export const CreateServiceRequestSchema = z.strictObject({
    serviceOfferingId: z.uuid(),
    propertyId: z.uuid(),
    notes: z.string().trim().min(1).max(1000).optional(),
    proposedPrice: MoneySchema.optional(),
});
export type CreateServiceRequestType = z.infer<
    typeof CreateServiceRequestSchema
>;

export const ReasonSchema = z.strictObject({
    reason: z.string().trim().min(1).max(500).optional(),
});
export type ReasonType = z.infer<typeof ReasonSchema>;
