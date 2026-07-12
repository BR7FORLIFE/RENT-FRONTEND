import { api } from "../../core/api/axios-config";
import { FINANCIAL_MODULE } from "../../core/api/paths";
import type { Get, GetAll } from "../../types/global";
import { type PropertyType } from "./schemas/property-registration.schema";
import type { OpenStreetResponse } from "./types";

export const GetAllProperties = async () => {
    const { data } = await api.get<GetAll<PropertyType[]>>(
        FINANCIAL_MODULE.PROPERTY_REGISTRATION_FEATURE.PROPERTY,
    );
    return data;
};

export const GetPropertyById = async (id: string) => {
    const { data } = await api.get<Get<"property", PropertyType>>(
        `${FINANCIAL_MODULE.PROPERTY_REGISTRATION_FEATURE.PROPERTY}/${id}`,
    );
    return data;
};

export const OpenStreetMapApi = async (
    place: string,
): Promise<OpenStreetResponse> => {
    const req = await fetch(
        encodeURI(
            `https://nominatim.openstreetmap.org/search?q=${place}&format=json`,
        ),
    );
    const data = (await req.json()) as OpenStreetResponse[];

    return {
        lat: data[0].lat,
        lon: data[0].lon,
        name: data[0].name,
    };
};
