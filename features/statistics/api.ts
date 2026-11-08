import { api } from "../../core/api/api-config";
import { FINANCIAL_MODULE } from "../../core/api/paths";
import type { ForecastResponse } from "./types";

export async function GetForecast(propertyId: string, horizon = 6) {
    const { data } = await api.get<ForecastResponse>(
        `${FINANCIAL_MODULE}/finance/property/${propertyId}/forecast`,
        { params: { horizon } },
    );
    return data;
}
