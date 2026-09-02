import * as z from "zod";

export const statusPropertyMemberEnum = z.enum([
    "IN_PROCESS",
    "ACTIVE",
    "DESACTIVE",
]);

export type StatusPropertyMemberType = z.infer<typeof statusPropertyMemberEnum>;

const TypeProperty = z.enum([
    "RESIDENCIAL",
    "COMERCIAL",
    "INDUSTRIAL",
    "TERRENO",
    "URBANO",
    "AGRARIO",
    "MIXTO",
]);

export type TypePropertyType = z.infer<typeof TypeProperty>;

const PropertyOccupation = z.enum(["OCUPADO", "DESOCUPADO", "EN_PROCESO"]);

export type PropertyOccupationType = z.infer<typeof PropertyOccupation>;

const Street = z.enum(["CALLE", "CARRERA", "AVENIDA", "DIAGONAL"]);

export type TypeStreet = z.infer<typeof Street>;

export type PropertyActorRoleType =
    | "PROPIETARIO"
    | "ARRENDADO"
    | "ADMINISTRADOR"
    | "SOPORTE_OPERATIVO"
    | "MIEMBRO";

export const DirectionSchema = z.object({
    id: z.uuid().optional(),
    propertyId: z.uuid(),
    latitute: z.string(),
    longitud: z.string(),
    department: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    typeStreet: Street,
    numberStreet: z.number(),
    complement: z.string().optional(),
    createAt: z.string().optional(),
    updateAt: z.string().optional(),
});

export type DirectionType = z.infer<typeof DirectionSchema>;

export const createDirectionSchema = z.object({
    latitute: z.number(),
    longitud: z.number(),
    department: z.string(),
    city: z.string(),
    neighborhood: z.string(),
    typeStreet: Street,
    numberStreet: z.number(),
    complement: z.string().optional(),
});
export type CreateDirectionType = z.infer<typeof createDirectionSchema>;

export const ResourceImageSchema = z.object({
    id: z.uuid().nullable(),
    assetId: z.string().nullable(),
    width: z.int().nullable(),
    height: z.int().nullable(),
    format: z.string().nullable(),
    url: z.string(),
    secureUrl: z.string().nullable(),
    createAt: z.string().optional(),
    updateAt: z.string().optional(),
});

export type ResourceImageType = z.infer<typeof ResourceImageSchema>;

export const createResourceImageSchema = z.object({
    assetId: z.string().optional(),
    width: z.int().optional(),
    height: z.int().optional(),
    format: z.string().optional(),
    url: z.string(),
    secureUrl: z.string().optional(),
});

export type createResourceImageType = z.infer<typeof createResourceImageSchema>;

export const StructurePropertyInfo = z.object({
    bedrooms: z.number().positive(),
    bathrooms: z.number().positive(),
    floors: z.number().positive(),
    parkingSpaces: z.number().positive(),
    area: z.number().positive(),
    lotArea: z.number().positive(),
    constructionYear: z.number().positive(),
});

export type StructurePropertyInfoType = z.infer<typeof StructurePropertyInfo>;

export const EconomicPropertyInfo = z.object({
    monthlyRent: z.coerce.number(),
    depositAmount: z.coerce.number(),
    currency: z.enum(["COP", "USD"]),
    utilitiesIncluded: z.boolean(),
});

export type EconomicPropertyInfoType = z.infer<typeof EconomicPropertyInfo>

export const propertySchema = z.object({
    id: z.uuid(),
    fmi: z.string(),
    predialNumber: z.string(),
    isPublished: z.boolean(),
    createAt: z.string(),
    propertyDescription: z.string(),
    propertyName: z.string(),
    typeProperty: TypeProperty,
    propertyOccupationType: PropertyOccupation,
    direction: DirectionSchema,
    resources: z.array(ResourceImageSchema),
    structureInfoResponse: StructurePropertyInfo,
    economicInfoResponse: EconomicPropertyInfo,
});

export type PropertyType = z.infer<typeof propertySchema>;

export const createPropertySchema = z.object({
    propertyType: TypeProperty,
    propertyOccupationType: PropertyOccupation,
    direction: createDirectionSchema,
    resources: z.array(createResourceImageSchema),
    propertyName: z.string(),
    propertyDescription: z.string(),
    fmi: z.string(),
    predialNumber: z.string(),
    structurePropertyInfo: StructurePropertyInfo,
    economicPropertyInfo: EconomicPropertyInfo,
});

export type CreatePropertyType = z.infer<typeof createPropertySchema>;

export const PropertyMemberSchema = z.object({
    id: z.uuid().optional(),
    userId: z.uuid(),
    propertyId: z.uuid(),
    assignedBy: z.uuid(),
    assignedAt: z.date().optional(),
    updateAt: z.date().optional(),
});

export type PropertyMemberType = z.infer<typeof PropertyMemberSchema>;

export const PropertyMemberRoleSchema = z.object({
    id: z.uuid().optional(),
    propertyMemberId: z.uuid(),
    propertyActorRoleId: z.uuid(),
});

export type PropertyMemberRoleType = z.infer<typeof PropertyMemberRoleSchema>;

//editing property schema
export const editingPropertyInfo = z.object({
    propertyName: z.string().optional(),
    propertyType: TypeProperty.optional(),
    propertyOccupationType: PropertyOccupation.optional(),
    resources: z.array(createResourceImageSchema).optional(),
});

export type EditingPropertyInfo = z.infer<typeof editingPropertyInfo>;
