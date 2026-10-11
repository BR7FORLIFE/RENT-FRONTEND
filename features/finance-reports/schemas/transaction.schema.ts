import { z } from "zod";

export const TransactionTypeEnum = z.enum(["INCOME", "EXPENSE"]);
export const CategoryEnum = z.enum([
    "RENT",
    "SERVICE",
    "UTILITY",
    "MAINTENANCE",
    "DEPOSIT",
    "OTHER",
]);
export const RecordStatusEnum = z.enum([
    "PLANNED",
    "PENDING",
    "PAID",
    "OVERDUE",
    "CANCELLED",
]);
export const CurrencyEnum = z.enum(["COP", "USD"]);

export type TransactionType = z.infer<typeof TransactionTypeEnum>;
export type Category = z.infer<typeof CategoryEnum>;
export type RecordStatus = z.infer<typeof RecordStatusEnum>;
export type Currency = z.infer<typeof CurrencyEnum>;

// Espejo de las validaciones del backend (el backend sigue siendo la fuente de verdad).
const amountSchema = z
    .string()
    .trim()
    .regex(/^\d{1,10}(\.\d{1,2})?$/, "Importe inválido (máx. 2 decimales)")
    .refine((v) => Number(v) > 0, "El importe debe ser mayor que 0");

const optionalIsoDate = z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Usa el formato AAAA-MM-DD")
    .refine((v) => !Number.isNaN(new Date(`${v}T00:00:00.000Z`).getTime()), {
        message: "Fecha inválida",
    });

export const CreateTransactionSchema = z.object({
    type: TransactionTypeEnum,
    category: CategoryEnum,
    status: z.enum(["PLANNED", "PENDING", "PAID"]),
    description: z
        .string()
        .trim()
        .min(1, "La descripción es obligatoria")
        .max(500, "Máximo 500 caracteres"),
    amount: amountSchema,
    currency: CurrencyEnum,
    occurredAt: optionalIsoDate.optional(),
    dueDate: optionalIsoDate.optional(),
    contractId: z.uuid().optional(),
    isSimulated: z.boolean().optional(),
});
export type CreateTransactionType = z.infer<typeof CreateTransactionSchema>;

export const EditTransactionSchema = z
    .object({
        category: CategoryEnum,
        description: CreateTransactionSchema.shape.description,
        amount: amountSchema,
        currency: CurrencyEnum,
        occurredAt: optionalIsoDate,
        dueDate: optionalIsoDate.nullable(),
        contractId: z.uuid().nullable(),
    })
    .partial();
export type EditTransactionType = z.infer<typeof EditTransactionSchema>;
