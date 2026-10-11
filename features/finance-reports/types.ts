import type {
    Category,
    Currency,
    RecordStatus,
    TransactionType,
} from "./schemas/transaction.schema";

export interface FinancialTransaction {
    id: string;
    propertyId: string;
    contractId: string | null;
    type: TransactionType;
    category: Category;
    status: RecordStatus;
    description: string;
    amount: string;
    currency: Currency;
    dueDate: string | null;
    occurredAt: string;
    paidAt: string | null;
    isSimulated: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CurrencySummary {
    currency: Currency;
    realizedIncome: string;
    realizedExpense: string;
    netCashFlow: string;
    pendingIncome: string;
    pendingExpense: string;
    overdue: { count: number; income: string; expense: string };
}

export interface FinancialSummary {
    propertyId: string;
    period: { from: string; to: string };
    byCurrency: CurrencySummary[];
}

export interface TransactionFilters {
    type?: TransactionType;
    status?: RecordStatus;
    category?: Category;
    currency?: Currency;
}
