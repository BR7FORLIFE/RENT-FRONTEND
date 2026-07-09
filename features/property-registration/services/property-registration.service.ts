import type {
    CreatePropertyType,
    PropertyType,
} from "../schemas/property-registration.schema";
import type { PropertyInfoCard } from "../types";

export function normalizePropertyInformation(
    properties: PropertyType[],
): PropertyInfoCard[] {
    if (properties.length === 0) {
        return [];
    }

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

//funcion para guardar los pasos en el registro de las propiedades

//export async function saveStepStorage(): Promise<CreatePropertyType> {}
