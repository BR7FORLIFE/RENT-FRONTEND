import { api } from "../../core/api/api-config";
import { FINANCIAL_MODULE } from "../../core/api/paths";
import type { GetAll } from "../../types/global";
import type {
    CreateTransactionType,
    EditTransactionType,
    RecordStatus,
} from "./schemas/transaction.schema";
import type {
    FinancialSummary,
    FinancialTransaction,
    TransactionFilters,
} from "./types";

const base = (propertyId: string) =>
    `${FINANCIAL_MODULE}/finance/property/${propertyId}`;

export async function CreateTransaction(
    propertyId: string,
    body: CreateTransactionType,
) {
    const { data } = await api.post<FinancialTransaction>(
        `${base(propertyId)}/transactions`,
        body,
    );
    return data;
}

export async function GetTransactionById(
    propertyId: string,
    transactionId: string,
) {
    const { data } = await api.get<FinancialTransaction>(
        `${base(propertyId)}/transactions/${transactionId}`,
    );
    return data;
}

export async function GetAllTransactions(
    propertyId: string,
    page: number,
    limit: number,
    filters: TransactionFilters = {},
    history = false,
) {
    const { data } = await api.get<GetAll<FinancialTransaction[]>>(
        `${base(propertyId)}/${history ? "history" : "transactions"}`,
        { params: { ...filters, page, limit } },
    );
    return data;
}

export async function GetFinancialSummary(
    propertyId: string,
    from: string,
    to: string,
) {
    const { data } = await api.get<FinancialSummary>(
        `${base(propertyId)}/summary`,
        { params: { from, to } },
    );
    return data;
}

export async function EditTransaction(
    propertyId: string,
    transactionId: string,
    body: EditTransactionType,
) {
    const { data } = await api.patch<FinancialTransaction>(
        `${base(propertyId)}/transactions/${transactionId}`,
        body,
    );
    return data;
}

export async function ChangeTransactionStatus(
    propertyId: string,
    transactionId: string,
    status: RecordStatus,
) {
    const { data } = await api.patch<FinancialTransaction>(
        `${base(propertyId)}/transactions/${transactionId}/status`,
        { status },
    );
    return data;
}

export async function PayTransaction(
    propertyId: string,
    transactionId: string,
) {
    const { data } = await api.post<FinancialTransaction>(
        `${base(propertyId)}/transactions/${transactionId}/pay`,
        {},
    );
    return data;
}
