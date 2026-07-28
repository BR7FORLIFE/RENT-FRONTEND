import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Storage } from "../../../types/global";
import type { PropertyType } from "../schemas/property-registration.schema";
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
                occupationType: propertyOccupationType,
                typeProperty: typeProperty,
            };
        },
    );
}

//funcion para guardar los pasos en el registro de las propiedades

//export async function saveStepStorage(): Promise<CreatePropertyType> {}

//storages (para reconstruir toda la informacion completa de registro de propiedades)

// 1. STEP resources Images
export function resourcesImageStorage(): Storage<string[]> {
    const KEY_STORAGE = "resourcesImages";
    const get = async () => {
        const data = await AsyncStorage.getItem(KEY_STORAGE);
        if (!data) return [];
        return JSON.parse(data);
    };
    const set = async (uri: string[]) => {
        await AsyncStorage.setItem(KEY_STORAGE, JSON.stringify(uri));
    };

    const clean = async () => await AsyncStorage.clear();

    return { get, set, clean };
}
