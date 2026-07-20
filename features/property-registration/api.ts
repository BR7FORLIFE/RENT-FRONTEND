import { api } from "../../core/api/axios-config";
import { FINANCIAL_MODULE } from "../../core/api/paths";
import type { Get, GetAll } from "../../types/global";
import { type PropertyType } from "./schemas/property-registration.schema";
import type {
    IAPropertyField,
    IAPropertyRegistrationResponse,
    OpenStreetResponse,
} from "./types";

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

export const IAPropertyRegistrationSuggestion = async (
    field: IAPropertyField,
) => {
    const { data } = await api.post<IAPropertyRegistrationResponse>(
        `${FINANCIAL_MODULE.PROPERTY_REGISTRATION_FEATURE.PROPERTY}/IA-registration-suggestion`,
        { propertyField: field },
    );

    return data;
};

export const OpenStreetMapApi = async (
    place: string,
): Promise<OpenStreetResponse> => {
    console.log(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json`,
    );
    const req = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json`,
    );

    console.log(req.status);
    const data = await req.text();

    console.log(data);
    if (!req.ok) {
        throw new Error(`HTTP ${req.status}`);
    }

    return {
        lat: "",
        lon: "",
        name: "",
        display_name: "",
    };
};
