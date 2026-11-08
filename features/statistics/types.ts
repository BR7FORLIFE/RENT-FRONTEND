export type Trend = "up" | "down" | "stable";

export interface HistoryMonth {
    month: string; // YYYY-MM
    income: number;
    expense: number;
    overdueIncome: number;
    net: number;
    rentBilled: number;
    rentCollected: number;
}

export interface ForecastMonth {
    month: string;
    predicted: number;
    low: number;
    high: number;
    expectedIncome: number;
    expectedExpense: number;
}

export interface BacktestMonth {
    month: string;
    actual: number;
    predicted: number;
}

export interface Driver {
    feature: string;
    label: string;
    value: number;
}

export interface CategoryTotal {
    category: string;
    total: number;
}

export interface ForecastNotReady {
    ready: false;
    reason: string;
    currency: "COP";
    currentMonth: string;
}

export interface ForecastReady {
    ready: true;
    currency: "COP";
    usdToCop: number;
    generatedAt: string;
    currentMonth: string;
    horizon: number;
    history: HistoryMonth[];
    backtest: BacktestMonth[];
    forecast: ForecastMonth[];
    metrics: {
        months: number;
        mae: number;
        rmse: number;
        r2: number | null;
        baselineMae: number;
        improvementVsBaseline: number | null;
    };
    drivers: { base: number; items: Driver[] };
    currentMonthToDate: { month: string; income: number; expense: number };
    overdueIncomeTotal: number;
    categories: { income: CategoryTotal[]; expense: CategoryTotal[] };
    summary: {
        nextMonth: number | null;
        forecastTotal: number;
        historyAverage: number;
        trend: Trend;
    };
}

export type ForecastResponse = ForecastReady | ForecastNotReady;
