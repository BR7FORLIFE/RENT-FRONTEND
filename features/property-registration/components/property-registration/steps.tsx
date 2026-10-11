import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, type LatLng, type Region } from "react-native-maps";
import Toast from "react-native-toast-message";

import AddIcon from "../../../../assets/icons/add-square.svg";
import IAIcon from "../../../../assets/icons/ai.svg";
import UploadIcon from "../../../../assets/icons/upload.svg";
import { ButtonForm } from "../../../../components/buttons/button";
import { NumberInput, SearchInput } from "../../../../components/inputs/input";
import { Palette } from "../../../../themes/themes";
import type { ApiError } from "../../../../types/global";
import { IAPropertyRegistrationSuggestion, OpenStreetMapApi } from "../../api";
import {
  EconomicPropertyInfo as EconomicInfoSchema,
  StructurePropertyInfo as StructureInfoSchema,
  type CreateDirectionType,
  type EconomicPropertyInfoType,
  type PropertyOccupationType,
  type StructurePropertyInfoType,
  type TypePropertyType,
  type TypeStreet,
} from "../../schemas/property-registration.schema";
import { resourcesStorage } from "../../services/property-registration.domain.service";
import type { RegisterFormData } from "../../screens/property-registration-screen";
import {
  Counter,
  Field,
  FormCard,
  HintBox,
  OptionChips,
  StepLayout,
  TextField,
} from "./step-ui";

const MAX_IMAGES = 6;

// Bogotá: región por defecto si el usuario no concede permiso de ubicación
const DEFAULT_REGION: Region = {
  latitude: 4.711,
  longitude: -74.0721,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

/* ------------------------------ Paso 1: imágenes ------------------------------ */

function ImagePreview({
  uri,
  setImageUri,
}: {
  uri: string;
  setImageUri: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <View style={imageStyles.item}>
      <Image source={{ uri }} style={imageStyles.image} resizeMode="cover" />

      <Pressable
        style={imageStyles.remove}
        hitSlop={6}
        onPress={() =>
          setImageUri((prev) => prev.filter((image) => image !== uri))
        }
      >
        <Text style={imageStyles.removeText}>×</Text>
      </Pressable>
    </View>
  );
}

export function DrapAndDropStep({ setStep }: RegisterFormData) {
  const [imagesUris, setImagesUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startedData = async () => {
      const resources = await resourcesStorage().get();
      setImagesUris(resources ?? []);
    };

    startedData();
  }, []);

  const submitImage = async () => {
    setLoading(true);

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Toast.show({
          type: "error",
          text2: "Necesitamos permisos para adjuntar la imagen!",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      // evitamos duplicados: el uri se usa como key
      setImagesUris((prev) => (prev.includes(uri) ? prev : [...prev, uri]));
    } finally {
      setLoading(false);
    }
  };

  const goNext = async () => {
    await resourcesStorage().set(imagesUris);
    setStep((prev) => prev + 1);
  };

  const hasImages = imagesUris.length > 0;

  return (
    <StepLayout
      title="Registra tu inmueble"
      subtitle={`Adjunta hasta ${MAX_IMAGES} imágenes de la propiedad que deseas agregar.`}
      footer={
        <ButtonForm
          title={hasImages ? "Continuar" : "Continuar sin imágenes"}
          action={goNext}
          disabled={loading}
        />
      }
    >
      {hasImages ? (
        <>
          <View style={imageStyles.grid}>
            {imagesUris.map((uri) => (
              <ImagePreview key={uri} uri={uri} setImageUri={setImagesUris} />
            ))}
          </View>

          {imagesUris.length < MAX_IMAGES ? (
            <Pressable
              disabled={loading}
              onPress={submitImage}
              style={({ pressed }) => [
                imageStyles.addMore,
                pressed && styles.pressed,
                loading && styles.disabled,
              ]}
            >
              <AddIcon height={20} width={20} />
              <Text style={imageStyles.addMoreText}>
                {loading ? "Abriendo galería..." : "Añadir otra imagen"}
              </Text>
            </Pressable>
          ) : (
            <HintBox>Alcanzaste el máximo de imágenes permitidas.</HintBox>
          )}
        </>
      ) : (
        <Pressable
          onPress={submitImage}
          disabled={loading}
          style={({ pressed }) => [
            imageStyles.dropzone,
            pressed && styles.pressed,
            loading && styles.disabled,
          ]}
        >
          <View style={imageStyles.dropzoneIcon}>
            <UploadIcon width={44} height={44} />
          </View>

          <Text style={imageStyles.dropzoneTitle}>
            {loading ? "Abriendo galería..." : "Cargar imágenes"}
          </Text>
          <Text style={imageStyles.dropzoneText}>
            Toca para seleccionar fotos de tu propiedad.
          </Text>
        </Pressable>
      )}
    </StepLayout>
  );
}

const imageStyles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  item: {
    width: "31%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 14,
    backgroundColor: Palette.surfaceMuted,
    borderWidth: 1,
    borderColor: Palette.border,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  remove: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.7)",
  },

  removeText: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  addMore: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Palette.accent,
    backgroundColor: Palette.accentSoft,
  },

  addMoreText: {
    fontSize: 13,
    fontWeight: "600",
    color: Palette.accentStrong,
  },

  dropzone: {
    minHeight: 240,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Palette.accent,
    backgroundColor: Palette.surfaceMuted,
  },

  dropzoneIcon: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderRadius: 40,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },

  dropzoneTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Palette.textPrimary,
  },

  dropzoneText: {
    marginTop: 6,
    fontSize: 13,
    textAlign: "center",
    color: Palette.textMuted,
  },
});

/* ------------------------------ Paso 2: dirección ------------------------------ */

// Deduce el tipo y número de vía a partir de lo que devuelve el geocodificador
function parseStreet(
  street?: string | null,
  streetNumber?: string | null,
): { typeStreet: TypeStreet; numberStreet: number } {
  const text = `${street ?? ""}`.toLowerCase();

  let typeStreet: TypeStreet = "CALLE";
  if (/\b(avenida|av)\b/.test(text)) typeStreet = "AVENIDA";
  else if (/\b(diagonal|diag)\b/.test(text)) typeStreet = "DIAGONAL";
  else if (/\b(carrera|cra|kr)\b/.test(text)) typeStreet = "CARRERA";

  const digits = /\d+/.exec(street ?? "") ?? /\d+/.exec(streetNumber ?? "");

  return { typeStreet, numberStreet: digits ? Number(digits[0]) : 0 };
}

export function DirectionStep({ saveData, setStep, data }: RegisterFormData) {
  const previous = data?.direction;

  const [coords, setCoords] = useState<Region | undefined>(
    previous
      ? {
          latitude: previous.latitute,
          longitude: previous.longitud,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }
      : undefined,
  );
  const [mark, setMark] = useState<LatLng | undefined>(
    previous
      ? { latitude: previous.latitute, longitude: previous.longitud }
      : undefined,
  );
  const [inputPlace, setInputPlace] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const mapRef = useRef<MapView>(null);

  const {
    data: place,
    error: searchError,
    isFetching,
  } = useQuery({
    queryKey: ["openstreet", search],
    queryFn: () => OpenStreetMapApi(search),
    retry: false,
    enabled: search.trim().length >= 3,
  });

  // ubicación inicial: la del usuario, o una por defecto si no hay permiso
  useEffect(() => {
    if (previous) return;

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Toast.show({
            type: "info",
            text2: "Sin permiso de ubicación. Busca o marca la dirección.",
          });
          setCoords(DEFAULT_REGION);
          return;
        }

        const location = await Location.getCurrentPositionAsync();
        const region: Region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        setMark({ latitude: region.latitude, longitude: region.longitude });
        setCoords(region);
      } catch {
        setCoords(DEFAULT_REGION);
      }
    };

    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // resultado de la búsqueda: movemos el marcador y la cámara
  useEffect(() => {
    if (!place) return;

    const latitude = Number(place.lat);
    const longitude = Number(place.lon);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMark({ latitude, longitude });

    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  }, [place]);

  useEffect(() => {
    if (!searchError) return;

    Toast.show({
      type: "error",
      text2:
        searchError.message === "PLACE_NOT_FOUND"
          ? "No encontramos esa dirección. Prueba con otra o marca el punto en el mapa."
          : "No se pudo buscar la dirección. Inténtalo de nuevo.",
    });
  }, [searchError]);

  const handleSearch = () => {
    const term = inputPlace.trim();
    if (term.length < 3) return;
    setSearch(term);
  };

  // armamos la dirección a partir del punto marcado en el mapa
  const handleInformation = async () => {
    if (!mark) return;

    setSaving(true);

    try {
      const [found] = await Location.reverseGeocodeAsync(mark);

      const city = found?.city ?? found?.subregion;

      if (!found || !city) {
        Toast.show({
          type: "error",
          text2: "No pudimos identificar la ciudad. Mueve el marcador.",
        });
        return;
      }

      const { typeStreet, numberStreet } = parseStreet(
        found.street,
        found.streetNumber,
      );

      const direction: CreateDirectionType = {
        city,
        department: found.region ?? city,
        neighborhood: found.district ?? found.subregion ?? city,
        latitute: mark.latitude,
        longitud: mark.longitude,
        typeStreet,
        numberStreet,
        complement: found.name ?? (inputPlace.trim() || undefined),
      };

      saveData((prev) => ({ ...prev, direction }));
      setStep((prev) => prev + 1);
    } catch {
      Toast.show({
        type: "error",
        text2: "No se pudo obtener la dirección del punto seleccionado.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <StepLayout
      title="Dirección del inmueble"
      subtitle="Busca la ubicación o márcala directamente en el mapa."
      footer={
        <ButtonForm
          title="Continuar"
          action={handleInformation}
          disabled={!coords || !mark || saving || isFetching}
          isPending={saving}
        />
      }
    >
      <SearchInput
        value={inputPlace}
        onChangeText={setInputPlace}
        onSubmit={handleSearch}
        placeholder="Busca una dirección..."
      />

      {coords ? (
        <View style={directionStyles.mapContainer}>
          <MapView
            ref={mapRef}
            initialRegion={coords}
            style={directionStyles.map}
            onPress={(e) => setMark(e.nativeEvent.coordinate)}
          >
            {mark && <Marker coordinate={mark} />}
          </MapView>

          <View pointerEvents="none" style={directionStyles.mapBadge}>
            <Text style={directionStyles.mapBadgeText}>
              {isFetching ? "Buscando..." : "Toca el mapa para ajustar"}
            </Text>
          </View>
        </View>
      ) : (
        <View style={[directionStyles.mapContainer, directionStyles.mapLoading]}>
          <Text style={directionStyles.mapLoadingText}>Cargando mapa...</Text>
        </View>
      )}

      <HintBox>
        Usaremos el punto marcado para registrar la ciudad, el barrio y la
        vía del inmueble.
      </HintBox>
    </StepLayout>
  );
}

const directionStyles = StyleSheet.create({
  mapContainer: {
    height: 260,
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surfaceMuted,
  },

  map: {
    flex: 1,
  },

  mapBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.94)",
  },

  mapBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: Palette.textSecondary,
  },

  mapLoading: {
    alignItems: "center",
    justifyContent: "center",
  },

  mapLoadingText: {
    fontSize: 13,
    color: Palette.textMuted,
  },
});

/* --------------------------- Paso 3: FMI y predial --------------------------- */

export function FmiAndPredialNumberStep({
  saveData,
  setStep,
  data: saved,
}: RegisterFormData) {
  const [data, setData] = useState({
    FMI: saved?.fmi ?? "",
    PredialNumber: saved?.predialNumber ?? "",
  });

  const isValid = data.FMI.trim() !== "" && data.PredialNumber.trim() !== "";

  const handleSubmit = () => {
    saveData((prev) => ({
      ...prev,
      fmi: data.FMI.trim(),
      predialNumber: data.PredialNumber.trim(),
    }));
    setStep((prev) => prev + 1);
  };

  return (
    <StepLayout
      title="FMI y número predial"
      subtitle="Esta información se utilizará para identificar el inmueble."
      footer={
        <ButtonForm
          title="Continuar"
          disabled={!isValid}
          action={handleSubmit}
        />
      }
    >
      <FormCard>
        <Field label="FMI">
          <TextField
            placeholder="Ej. 060-123456"
            value={data.FMI}
            onChangeText={(text) => setData((prev) => ({ ...prev, FMI: text }))}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </Field>

        <Field label="Número predial">
          <TextField
            placeholder="Ej. 010203040506"
            value={data.PredialNumber}
            onChangeText={(text) =>
              setData((prev) => ({ ...prev, PredialNumber: text }))
            }
            inputMode="numeric"
            keyboardType="number-pad"
          />
        </Field>
      </FormCard>

      <HintBox>
        Verifica que ambos números coincidan con los documentos oficiales del
        inmueble.
      </HintBox>
    </StepLayout>
  );
}

/* ------------------------- Paso 4: nombre y descripción ------------------------- */

export function PropertyInfo({ saveData, setStep, data: saved }: RegisterFormData) {
  const [info, setInfo] = useState({
    propertyName: saved?.propertyName ?? "",
    propertyDescription: saved?.propertyDescription ?? "",
  });

  const mutation = useMutation({
    mutationFn: IAPropertyRegistrationSuggestion,
    mutationKey: ["IA-registration-suggestion"],
    onError: (_err: AxiosError<ApiError>) => {
      Toast.show({
        text1: "Error en la generación con IA",
        type: "error",
      });
    },
    onSuccess: (data) => {
      setInfo({
        propertyName: data.name,
        propertyDescription: data.description,
      });
    },
  });

  const isValid =
    info.propertyName.trim() !== "" && info.propertyDescription.trim() !== "";

  const submitInfo = () => {
    saveData((prev) => ({
      ...prev,
      propertyName: info.propertyName.trim(),
      propertyDescription: info.propertyDescription.trim(),
    }));
    setStep((prev) => prev + 1);
  };

  return (
    <StepLayout
      title="Describe tu inmueble"
      subtitle="Añade un nombre y una descripción para que conozcan mejor tu propiedad."
      footer={
        <ButtonForm
          title="Continuar"
          action={submitInfo}
          disabled={!isValid || mutation.isPending}
        />
      }
    >
      <FormCard>
        <Field label="Nombre de la propiedad">
          <TextField
            value={info.propertyName}
            placeholder="Ej. Apartamento Vista al Mar"
            onChangeText={(text) =>
              setInfo((prev) => ({ ...prev, propertyName: text }))
            }
            maxLength={80}
          />
          <Counter current={info.propertyName.length} max={80} />
        </Field>

        <Field label="Descripción de la propiedad">
          <TextField
            value={info.propertyDescription}
            placeholder="Ej. Apartamento amplio, iluminado y cerca de zonas comerciales..."
            onChangeText={(text) =>
              setInfo((prev) => ({ ...prev, propertyDescription: text }))
            }
            maxLength={500}
            multiline
          />
          <Counter current={info.propertyDescription.length} max={500} />
        </Field>
      </FormCard>

      <Pressable
        onPress={() => mutation.mutate("PropertyName")}
        disabled={mutation.isPending}
        style={({ pressed }) => [
          infoStyles.aiButton,
          pressed && styles.pressed,
          mutation.isPending && styles.disabled,
        ]}
      >
        <IAIcon width={20} height={20} />
        <Text style={infoStyles.aiText}>
          {mutation.isPending ? "Generando sugerencia..." : "Generar con IA"}
        </Text>
      </Pressable>
    </StepLayout>
  );
}

const infoStyles = StyleSheet.create({
  aiButton: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.accentBorder,
    backgroundColor: Palette.accentSoft,
  },

  aiText: {
    fontSize: 13,
    fontWeight: "700",
    color: Palette.accentStrong,
  },
});

/* ------------------------- Paso 5: características ------------------------- */

const STRUCTURE_FIELDS: {
  field: keyof StructurePropertyInfoType;
  label: string;
}[] = [
  { field: "bedrooms", label: "Habitaciones" },
  { field: "bathrooms", label: "Baños" },
  { field: "floors", label: "Pisos" },
  { field: "parkingSpaces", label: "Parqueaderos" },
  // area = construida, lotArea = terreno (las etiquetas estaban invertidas)
  { field: "area", label: "Área construida (m²)" },
  { field: "lotArea", label: "Área del terreno (m²)" },
  { field: "constructionYear", label: "Año de construcción" },
];

export function StructurePropertyInfo({
  saveData,
  setStep,
  data,
}: RegisterFormData) {
  const [structureProperty, setStructureProperty] =
    useState<StructurePropertyInfoType>({
      area: data?.structurePropertyInfo?.area ?? 0,
      bathrooms: data?.structurePropertyInfo?.bathrooms ?? 0,
      bedrooms: data?.structurePropertyInfo?.bedrooms ?? 0,
      constructionYear: data?.structurePropertyInfo?.constructionYear ?? 0,
      floors: data?.structurePropertyInfo?.floors ?? 0,
      lotArea: data?.structurePropertyInfo?.lotArea ?? 0,
      parkingSpaces: data?.structurePropertyInfo?.parkingSpaces ?? 0,
    });

  // el backend exige valores positivos en todos los campos
  const isValid = StructureInfoSchema.safeParse(structureProperty).success;

  const submitData = () => {
    saveData((prev) => ({ ...prev, structurePropertyInfo: structureProperty }));
    setStep((prev) => prev + 1);
  };

  return (
    <StepLayout
      title="Características del inmueble"
      subtitle="Cuéntanos las características físicas de tu inmueble. Todos los campos son obligatorios."
      footer={
        <ButtonForm
          title="Continuar"
          action={submitData}
          disabled={!isValid}
        />
      }
    >
      <FormCard>
        <View style={structureStyles.grid}>
          {STRUCTURE_FIELDS.map(({ field, label }) => (
            <View key={field} style={structureStyles.cell}>
              <Field label={label}>
                <NumberInput
                  field={field}
                  saveData={setStructureProperty}
                  initValue={structureProperty[field]}
                />
              </Field>
            </View>
          ))}
        </View>
      </FormCard>

      {!isValid && (
        <HintBox>Completa todos los campos con valores mayores a cero.</HintBox>
      )}
    </StepLayout>
  );
}

const structureStyles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },

  cell: {
    width: "48%",
  },
});

/* ------------------------- Paso 6: información económica ------------------------- */

export function EconomicPropertyInfo({
  saveData,
  setStep,
  data,
}: RegisterFormData) {
  const [economicInfo, setEconomicInfo] = useState<EconomicPropertyInfoType>({
    currency: data?.economicPropertyInfo?.currency ?? "COP",
    depositAmount: data?.economicPropertyInfo?.depositAmount ?? 0,
    monthlyRent: data?.economicPropertyInfo?.monthlyRent ?? 0,
    utilitiesIncluded: data?.economicPropertyInfo?.utilitiesIncluded ?? false,
  });

  // la renta debe ser mayor a cero; el depósito puede ser cero
  const isValid =
    EconomicInfoSchema.safeParse(economicInfo).success &&
    economicInfo.monthlyRent > 0;

  const toNumber = (value: string) => Number(value.replace(/[^0-9]/g, ""));
  const format = (value: number) =>
    value === 0 ? "" : value.toLocaleString("es-CO");

  const submit = () => {
    saveData((prev) => ({ ...prev, economicPropertyInfo: economicInfo }));
    setStep((prev) => prev + 1);
  };

  return (
    <StepLayout
      title="Información económica"
      subtitle="Define el valor de renta, el depósito y los servicios incluidos."
      footer={
        <ButtonForm title="Continuar" action={submit} disabled={!isValid} />
      }
    >
      <FormCard>
        <Field label="Valor de renta mensual">
          <TextField
            prefix="$"
            value={format(economicInfo.monthlyRent)}
            onChangeText={(value) =>
              setEconomicInfo((prev) => ({
                ...prev,
                monthlyRent: toNumber(value),
              }))
            }
            keyboardType="numeric"
            placeholder="0"
          />
        </Field>

        <Field label="Valor del depósito">
          <TextField
            prefix="$"
            value={format(economicInfo.depositAmount)}
            onChangeText={(value) =>
              setEconomicInfo((prev) => ({
                ...prev,
                depositAmount: toNumber(value),
              }))
            }
            keyboardType="numeric"
            placeholder="0"
          />
        </Field>

        <Field label="Tipo de moneda">
          <OptionChips
            value={economicInfo.currency}
            onChange={(currency) =>
              setEconomicInfo((prev) => ({ ...prev, currency }))
            }
            options={[
              { label: "Peso colombiano (COP)", value: "COP" },
              { label: "Dólar (USD)", value: "USD" },
            ]}
          />
        </Field>

        <Field label="¿Servicios incluidos?">
          <OptionChips
            value={economicInfo.utilitiesIncluded ? "yes" : "no"}
            onChange={(value) =>
              setEconomicInfo((prev) => ({
                ...prev,
                utilitiesIncluded: value === "yes",
              }))
            }
            options={[
              { label: "Sí", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
        </Field>
      </FormCard>

      {economicInfo.monthlyRent === 0 && (
        <HintBox>Ingresa un valor de renta mayor a cero para continuar.</HintBox>
      )}
    </StepLayout>
  );
}

/* ------------------------- Paso 7: tipo y ocupación ------------------------- */

const PROPERTY_TYPES: { label: string; value: TypePropertyType }[] = [
  { label: "Residencial", value: "RESIDENCIAL" },
  { label: "Comercial", value: "COMERCIAL" },
  { label: "Industrial", value: "INDUSTRIAL" },
  { label: "Terreno", value: "TERRENO" },
  { label: "Urbano", value: "URBANO" },
  { label: "Agrario", value: "AGRARIO" },
  { label: "Mixto", value: "MIXTO" },
];

const OCCUPATION_TYPES: { label: string; value: PropertyOccupationType }[] = [
  { label: "Disponible", value: "DESOCUPADO" },
  { label: "En proceso", value: "EN_PROCESO" },
  { label: "Arrendado", value: "OCUPADO" },
];

export function TypeAndOccupationStep({
  saveData,
  disabled,
  setIsCreateProperty,
  data,
}: {
  disabled: boolean;
  data?: RegisterFormData["data"];
  saveData: RegisterFormData["saveData"];
  setIsCreateProperty: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [info, setInfo] = useState<{
    typeProperty: TypePropertyType;
    propertyOccupationType: PropertyOccupationType;
  }>({
    propertyOccupationType: data?.propertyOccupationType ?? "DESOCUPADO",
    typeProperty: data?.propertyType ?? "RESIDENCIAL",
  });

  const submitData = () => {
    saveData((prev) => ({
      ...prev,
      propertyOccupationType: info.propertyOccupationType,
      propertyType: info.typeProperty,
    }));

    setIsCreateProperty(true);
  };

  return (
    <StepLayout
      title="Últimos detalles"
      subtitle="Selecciona el tipo y el estado actual de ocupación de tu propiedad."
      footer={
        <ButtonForm
          title="Registrar propiedad"
          action={submitData}
          disabled={disabled}
          isPending={disabled}
        />
      }
    >
      <FormCard>
        <Field label="Tipo de inmueble">
          <OptionChips
            options={PROPERTY_TYPES}
            value={info.typeProperty}
            onChange={(typeProperty) =>
              setInfo((prev) => ({ ...prev, typeProperty }))
            }
          />
        </Field>

        <Field label="Estado de ocupación">
          <OptionChips
            options={OCCUPATION_TYPES}
            value={info.propertyOccupationType}
            onChange={(propertyOccupationType) =>
              setInfo((prev) => ({ ...prev, propertyOccupationType }))
            }
          />
        </Field>
      </FormCard>

      <HintBox>
        Revisa que la información sea correcta antes de registrar tu
        propiedad.
      </HintBox>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  disabled: {
    opacity: 0.5,
  },
});
