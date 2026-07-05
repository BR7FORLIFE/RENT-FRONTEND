import type { PropertyType } from "../schemas/property-registration.schema";
import type { PropertyInfoCard } from "../types";

export function normalizePropertyInformation(
    properties: PropertyType[],
): PropertyInfoCard[] {
    return properties.map(
        ({
            id,
            fmi,
            direction,
            propertyOccupationType,
            typeProperty,
            propertyName,
        }) => {
            const normalizeDirection = `${direction.city} - ${direction.neighborhood}`;
            return {
                id,
                propertyName,
                fmi,
                direction: normalizeDirection,
                occupationType: propertyOccupationType.name,
                typeProperty: typeProperty.name,
            };
        },
    );
}
