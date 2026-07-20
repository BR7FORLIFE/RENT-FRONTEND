import type {
    PropertyOccupationType,
    TypePropertyType,
} from "./schemas/property-registration.schema";

export interface PropertyInfoCard {
    id?: string;
    propertyName: string;
    fmi: string;
    direction: string;
    occupationType: PropertyOccupationType;
    typeProperty: TypePropertyType;
    action?: () => void;
}

export interface OpenStreetResponse {
    lat: string;
    lon: string;
    name: string;
    display_name: string;
}

// IA Request and Responses
export type IAPropertyField = "PropertyName" | "PropertyDescription";

export interface IAPropertyRegistrationResponse {
    name: string;
    description: string;
}
