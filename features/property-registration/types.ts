import type {
    PropertyOccupationType,
    ResourceImageType,
    TypePropertyType,
} from "./schemas/property-registration.schema";

export interface PropertyInfoCard {
    id?: string;
    propertyName: string;
    fmi: string;
    direction?: string;
    occupationType: PropertyOccupationType;
    typeProperty: TypePropertyType;
    resources: ResourceImageType[];
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

//cloudinary response
export interface CloudinaryResponse {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: any[];
    bytes: number;
    type: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    asset_folder: string;
    display_name: string;
    eager: Eager[];
}

export interface Eager {
    transformation: string;
    width: number;
    height: number;
    bytes: number;
    format: string;
    url: string;
    secure_url: string;
}
