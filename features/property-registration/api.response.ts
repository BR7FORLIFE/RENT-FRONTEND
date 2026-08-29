import type {
    PropertyMemberType,
    StatusPropertyMemberType,
    TypeStreet,
} from "./schemas/property-registration.schema";

interface ResourcesImagesResponseApi {
    id: string | null;
    assetId: string | null;
    width: number | null;
    height: number | null;
    format: string | null;
    url: string;
    secureUrl: string | null;
    createAt: string;
    updateAt: string;
}

export interface DirectionResponseApi {
    typeStreet: TypeStreet;
    id: string;
    propertyId: string;
    latitute: number;
    longitud: number;
    department: string;
    city: string;
    neighborhood: string;
    numberStreet: number;
    complement: string | null;
    createAt: string;
    updateAt: string;
}

//economic info response
export interface EconomicResponseApi {
    monthlyRent: number;
    depositAmount: number;
    currency: "COP" | "USD";
    utilitiesIncluded: boolean;
}

//structure info response
export interface StructureResponseApi {
    bedrooms: number;
    bathrooms: number;
    floors: number;
    parkingSpaces: number;
    area: number;
    lotArea: number;
    constructionYear: number | null;
}

export interface PropertyResponseApi {
    id: string;
    createAt: string;
    fmi: string;
    predialNumber: string;
    isPublished: boolean;
    propertyName: string;
    propertyDescription: string;
    direction: DirectionResponseApi | null;
    typeProperty: string;
    propertyOccupationType: string;
    resourcesImages: ResourcesImagesResponseApi[];
    economicInfoResponse: EconomicResponseApi | null;
    structureInfoResponse: StructureResponseApi | null;
}

export interface GetAllPropertiesByPropertyMemberResponseApi {
    id: string;
    propertyName: string;
    propertyDescription: string;
}

export interface ResourceImagePersistenceResponseApi {
    id: string;
    assetId: string | null;
    width: number | null;
    height: number | null;
    format: string | null;
    url: string;
    secureUrl: string | null;
    createAt: Date;
    updateAt: Date;
}

export interface PropertyMemberMeResponseApi {
    info: PropertyMemberType;
    roles: string[];
    policies: string[];
}

export interface GetAllPropertyMemberInfo {
    userId: string;
    status?: StatusPropertyMemberType | undefined;
    assignedAt?: Date | undefined;
    username: string;
    email: string;
    cellphone: string;
    fullname: string;
}
