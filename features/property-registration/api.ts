import { api } from "../../core/api/axios-config";
import { FINANCIAL_MODULE } from "../../core/api/paths";
import type { Get, GetAll } from "../../types/global";
import type {
    GetAllPropertiesByPropertyMemberResponseApi,
    GetAllPropertyMemberInfo,
    PropertyMemberMeResponseApi,
    PropertyResponseApi,
    ResourceImagePersistenceResponseApi,
} from "./api.response";
import {
    type CreatePropertyType,
    type EditingPropertyInfo,
    type PropertyActorRoleType,
    type StatusPropertyMemberType,
} from "./schemas/property-registration.schema";
import type {
    IAPropertyField,
    IAPropertyRegistrationResponse,
    OpenStreetResponse,
} from "./types";

export const saveProperty = async (property: Partial<CreatePropertyType>) => {
    const { data } = await api.post<{ id: string; message: string }>(
        `${FINANCIAL_MODULE}/property`,
        property,
    );
    return data;
};

export const GetAllProperties = async () => {
    const { data } = await api.get<GetAll<PropertyResponseApi[]>>(
        `${FINANCIAL_MODULE}/property`,
    );
    return data;
};

export const GetPropertyById = async (id: string) => {
    const { data } = await api.get<Get<"property", PropertyResponseApi>>(
        `${FINANCIAL_MODULE}/property/${id}`,
    );
    return data.property;
};

export const EditingProperty = async (
    id: string,
    propertyInfo: EditingPropertyInfo,
) => {
    const { data } = await api.patch<{ id: string; message: string }>(
        `${FINANCIAL_MODULE}/property/${id}`,
        propertyInfo,
    );

    return data;
};

export const IAPropertyRegistrationSuggestion = async (
    field: IAPropertyField,
) => {
    const { data } = await api.post<IAPropertyRegistrationResponse>(
        `${FINANCIAL_MODULE}/property/IA-registration-suggestion`,
        { propertyField: field },
    );

    return data;
};

export const getAllPropertyMembers = async (
    propertyId: string,
    page: number,
    limit: number,
    status: StatusPropertyMemberType,
) => {
    const { data } = await api.get<GetAll<GetAllPropertyMemberInfo>>(
        `${FINANCIAL_MODULE}/property-member/${propertyId}`,
        {
            params: { status, page, limit },
        },
    );

    return data;
};

//property members endpoints
export const InvitePropertyMember = async (
    email: string, // correo que se pretende invitar
    propertyId: string, // la id de la propiedad
    userId: string, // dueño de la propiedad
) => {
    const { data } = await api.post<{
        id: string;
        invitedEmailTo: string;
        message: string;
    }>(`${FINANCIAL_MODULE}/property-member/invite-property-member`, {
        email,
        propertyId,
        userId,
    });

    return data;
};

export const AssignmentRoleToPropertyMember = async (
    memberId: string,
    propertyId: string,
    roles: PropertyActorRoleType[],
) => {
    const { data } = await api.post<{ message: string }>(
        `${FINANCIAL_MODULE}/property-member/${memberId}`,
        { propertyId, roles },
    );

    return data;
};

export async function GetAllPropertiesByPropertyMember(
    propertyMemberStatus: StatusPropertyMemberType,
    page: number,
    limit: number,
) {
    const { data } = await api.get<
        GetAll<GetAllPropertiesByPropertyMemberResponseApi>
    >(`${FINANCIAL_MODULE}/property-member/properties`, {
        params: {
            status: propertyMemberStatus,
            page,
            limit,
        },
    });

    return data;
}

export async function GetPropertyByPropertyMember(propertyId: string) {
    const { data } = await api.get<{
        propertyName: string;
        propertyDescription: string;
    }>(`${FINANCIAL_MODULE}/property-member/properties/${propertyId}`);
    return data;
}

export async function GetAllDocumentationByPropertyId(propertyId: string) {
    const { data } = await api.get<GetAll<ResourceImagePersistenceResponseApi>>(
        `${FINANCIAL_MODULE}/property/${propertyId}/documentation`,
    );
    return data;
}

export async function PropertyMemberMe(propertyId: string) {
    const { data } = await api.get<PropertyMemberMeResponseApi>(
        `${FINANCIAL_MODULE}/property-member/${propertyId}/me`,
    );
    return data;
}

export const OpenStreetMapApi = async (
    place: string,
): Promise<OpenStreetResponse> => {
    const req = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json`,
    );

    if (!req.ok) {
        throw new Error(`HTTP ${req.status}`);
    }
    const data = (await req.json()) as OpenStreetResponse[];

    return {
        lat: data[0].lat,
        lon: data[0].lon,
        name: data[0].name,
        display_name: data[0].display_name,
    };
};
