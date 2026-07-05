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
