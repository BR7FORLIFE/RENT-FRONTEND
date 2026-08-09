import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import
  {
    FlatList,
    Image,
    Pressable,
    Text,
    TextInput,
    View,
  } from "react-native";
import MapView, { Marker, type LatLng, type Region } from "react-native-maps";
import Toast from "react-native-toast-message";
import { ButtonForm } from "../../../components/buttons/button";
import { Colors } from "../../../themes/themes";
import type { RegisterFormData } from "../screens/property-registration-screen";

import { Picker } from "@react-native-picker/picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import AddIcon from "../../../assets/icons/add-square.svg";
import IAIcon from "../../../assets/icons/ai.svg";
import UploadIcon from "../../../assets/icons/upload.svg";
import { NumberInput, SearchInput } from "../../../components/inputs/input";
import type { ApiError } from "../../../types/global";
import { IAPropertyRegistrationSuggestion, OpenStreetMapApi } from "../api";
import type {
  CreateDirectionType,
  CreatePropertyType,
  EconomicPropertyInfoType,
  PropertyOccupationType,
  StructurePropertyInfoType,
  TypePropertyType,
} from "../schemas/property-registration.schema";
import { resourcesImageStorage } from "../services/property-registration.domain.service";

/**
 * Mejoras a tener en cuenta
 *
 * - hacer persistente en los steps, precargar los datos para no perder progreso por si se sale el usuario
 */

const ImagePreview = ({
  uri,
  setImageUri,
}: {
  uri: string;
  setImageUri: React.Dispatch<React.SetStateAction<string[]>>;
}) => (
  <View
    style={{
      position: "relative",
      width: "31%",
      aspectRatio: 1,
      marginBottom: 10,
      borderRadius: 14,
      overflow: "hidden",
      backgroundColor: "#F3F4F6",
      borderWidth: 1,
      borderColor: "#E5E7EB",
    }}
  >
    <Image
      source={{ uri }}
      style={{
        width: "100%",
        height: "100%",
      }}
      resizeMode="cover"
    />

    <Pressable
      style={{
        position: "absolute",
        top: 6,
        right: 6,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.65)",
      }}
      onPress={() =>
        setImageUri((prev) => prev.filter((image) => image !== uri))
      }
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: "700",
          lineHeight: 18,
        }}
      >
        ×
      </Text>
    </Pressable>
  </View>
);

export function DrapAndDropStep({ setStep }: RegisterFormData) {
  const [imagesUris, setImagesUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startedData = async () => {
      const resourcesImages = await resourcesImageStorage().get();

      if (!resourcesImages) {
        setImagesUris([]);
        return;
      }

      setImagesUris(resourcesImages);
    };

    startedData();
  }, []);

  const submitImage = async () => {
    setLoading(true);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setLoading(false);

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

    if (result.canceled) {
      setLoading(false);
      return;
    }

    const image = result.assets[0];

    setImagesUris((prev) => [...prev, image.uri]);
    setLoading(false);
  };

  const createResourceImage = async () => {
    await resourcesImageStorage().set(imagesUris);
    setStep((prev) => prev + 1);
  };

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          width: "100%",
          fontSize: 24,
          lineHeight: 30,
          fontWeight: "800",
          color: "#111827",
          textAlign: "center",
          marginTop: 8,
        }}
      >
        Registra tu inmueble!
      </Text>

      <Text
        style={{
          width: "90%",
          marginTop: 10,
          fontSize: 14,
          lineHeight: 21,
          textAlign: "center",
          fontWeight: "400",
          color: "#6B7280",
        }}
      >
        Adjunta una o varias imágenes para la propiedad que deseas agregar.
      </Text>

      {imagesUris.length !== 0 ? (
        <View
          style={{
            width: "100%",
            flex: 1,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <FlatList
            data={imagesUris}
            keyExtractor={(item) => item}
            numColumns={3}
            renderItem={({ item }) => (
              <ImagePreview uri={item} setImageUri={setImagesUris} />
            )}
            style={{
              width: "100%",
              flexGrow: 0,
            }}
            contentContainerStyle={{
              paddingHorizontal: 4,
              paddingBottom: 8,
            }}
            columnWrapperStyle={{
              justifyContent: "space-between",
            }}
            showsVerticalScrollIndicator={false}
          />

          {imagesUris.length !== 6 ? (
            <Pressable
              disabled={loading}
              onPress={submitImage}
              style={({ pressed }) => [
                {
                  minHeight: 44,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: Colors.TERTIARY,
                  backgroundColor: "#FFFFFF",
                },
                pressed && {
                  opacity: 0.65,
                  transform: [{ scale: 0.98 }],
                },
                loading && {
                  opacity: 0.5,
                },
              ]}
            >
              <AddIcon height={20} width={20} />

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: Colors.TERTIARY,
                }}
              >
                {loading ? "Abriendo galería..." : "Añadir otra imagen"}
              </Text>
            </Pressable>
          ) : (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: "#FEF3C7",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#92400E",
                }}
              >
                Capacidad máxima de imágenes alcanzada
              </Text>
            </View>
          )}
          <View
            style={{
              width: "100%",
              maxWidth: 400,
              marginTop: 20,
              paddingHorizontal: 8,
            }}
          >
            <ButtonForm title="Aceptar" action={createResourceImage} />
          </View>
        </View>
      ) : (
        <Pressable
          onPress={submitImage}
          disabled={loading}
          style={({ pressed }) => [
            {
              width: "100%",
              maxWidth: 400,
              minHeight: 230,

              alignItems: "center",
              justifyContent: "center",

              marginTop: 28,
              paddingHorizontal: 24,

              borderRadius: 20,
              borderWidth: 1.5,
              borderStyle: "dashed",
              borderColor: Colors.TERTIARY,

              backgroundColor: "#F9FAFB",
            },

            pressed && {
              transform: [{ scale: 0.98 }],
            },

            loading && {
              opacity: 0.5,
            },
          ]}
        >
          <View
            style={{
              width: 82,
              height: 82,
              alignItems: "center",
              justifyContent: "center",

              borderRadius: 41,

              backgroundColor: "#FFFFFF",

              marginBottom: 16,

              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <UploadIcon width={54} height={54} />
          </View>

          <Text
            style={{
              fontSize: loading ? 13 : 16,
              fontWeight: "700",
              color: "#111827",
              textAlign: "center",
            }}
          >
            {loading ? "Abriendo panel de selección..." : "Cargar imágenes"}
          </Text>

          {!loading && (
            <Text
              style={{
                marginTop: 7,
                fontSize: 13,
                lineHeight: 19,
                color: "#6B7280",
                textAlign: "center",
              }}
            >
              Puedes seleccionar hasta 6 imágenes de tu propiedad.
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

export function DirectionStep({ saveData, setStep }: RegisterFormData) {
  //le pedimos permiso al usuario para acceder a su ubicacion y poder ubicarlo en el Map View
  const [coords, setCoords] = useState<Region>();
  const [mark, setMark] = useState<LatLng>();
  const [inputPlace, setInputPlace] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const mapRef = useRef<MapView>(null);

  const { data, isSuccess, error } = useQuery({
    queryKey: ["openstreet", search],
    queryFn: () => {
      return OpenStreetMapApi(search);
    },
    retry: false,
    enabled: search.trim().length >= 3,
  });

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Toast.show({
          type: "error",
          text2:
            "Necesitamos permisos para obtener informacion de la ubicación!",
        });
      }

      let location = await Location.getCurrentPositionAsync();

      const initialRegion: Region = {
        latitude: location.coords.latitude,
        latitudeDelta: 0.005,
        longitude: location.coords.longitude,
        longitudeDelta: 0.005,
      };
      setMark({
        latitude: initialRegion.latitude,
        longitude: initialRegion.longitude,
      });
      setCoords(initialRegion);
    };
    getPermission();
  }, []);

  const handleInformation = () => {
    // setSearch(inputPlace); -> ejecuta la api de geolocalizacion

    //hardcodeamos para despues probar con la API
    const direction: CreateDirectionType = {
      city: "Cartagena",
      department: "Bolivar",
      latitute: 90,
      longitud: 90,
      neighborhood: "Barrio Bocagrande",
      numberStreet: 12,
      typeStreet: "CARRERA",
      complement: "cerca al mar",
    };

    saveData((prev) => ({ ...prev, direction }));

    setStep((prev) => prev + 1);
  };

  useEffect(() => {
    if (!data) return;

    const latitude = Number(data.lat);
    const longitude = Number(data.lon);

    setMark({ latitude, longitude });

    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  }, [data]);

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 12,
      }}
    >
      <Text
        style={{
          width: "100%",
          fontSize: 18,
          lineHeight: 24,
          fontWeight: "800",
          color: "#111827",
          textAlign: "center",
          marginBottom: 6,
        }}
      >
        Registra la dirección de tu inmueble
      </Text>

      <Text
        style={{
          width: "92%",
          fontSize: 11,
          lineHeight: 17,
          fontWeight: "400",
          color: "#6B7280",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Busca la ubicación de tu inmueble o selecciónala directamente en el
        mapa.
      </Text>

      <View
        style={{
          width: "100%",
          maxWidth: 480,
          marginBottom: 10,
        }}
      >
        <SearchInput
          value={inputPlace}
          onChangeText={(text) => setInputPlace(text)}
          placeholder="Busca una dirección..."
        />
      </View>

      {coords ? (
        <View
          style={{
            width: "100%",
            maxWidth: 500,

            height: 220,

            overflow: "hidden",

            borderRadius: 18,
            borderWidth: 1,
            borderColor: "#E5E7EB",

            backgroundColor: "#F3F4F6",

            shadowColor: "#000000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.1,
            shadowRadius: 6,

            elevation: 3,

            marginBottom: 10,
          }}
        >
          <MapView
            ref={mapRef}
            initialRegion={coords}
            style={{
              flex: 1,
            }}
            onPress={(e) => setMark(e.nativeEvent.coordinate)}
          >
            {mark && <Marker coordinate={mark} />}
          </MapView>

          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 10,
              left: 10,

              paddingHorizontal: 9,
              paddingVertical: 6,

              borderRadius: 9,

              backgroundColor: "rgba(255,255,255,0.92)",

              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,

              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: "#374151",
              }}
            >
              📍 Selecciona la ubicación
            </Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            maxWidth: 500,

            height: 220,

            alignItems: "center",
            justifyContent: "center",

            borderRadius: 18,
            borderWidth: 1,
            borderColor: "#E5E7EB",

            backgroundColor: "#F9FAFB",

            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              color: "#6B7280",
            }}
          >
            Cargando mapa...
          </Text>
        </View>
      )}

      <View
        style={{
          width: "100%",
          maxWidth: 500,

          paddingHorizontal: 12,
          paddingVertical: 9,

          borderRadius: 10,

          backgroundColor: "#F8FAFC",

          borderWidth: 1,
          borderColor: "#E5E7EB",

          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            lineHeight: 16,

            color: "#64748B",

            textAlign: "center",
          }}
        >
          Puedes tocar cualquier punto del mapa para ajustar la ubicación exacta
          del inmueble.
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          maxWidth: 340,

          paddingHorizontal: 16,

          marginBottom: 8,
        }}
      >
        <ButtonForm
          title="Continuar"
          action={handleInformation}
          disabled={!coords || inputPlace.trim().length === 0 || !mark}
        />
      </View>
    </View>
  );
}

export function FmiAndPredialNumberStep({
  saveData,
  setStep,
}: RegisterFormData) {
  const [data, setData] = useState({
    FMI: "",
    PredialNumber: "",
  });

  const handleData = (key: keyof typeof data, value: string) => {
    const info = {
      ...data,
      [key]: value,
    };
    setData(info);
  };

  const isValid = data.FMI.trim() !== "" && data.PredialNumber.trim() !== "";

  const handleSubmit = () => {
    saveData((prev) => ({
      ...prev,
      fmi: data.FMI,
      predialNumber: data.PredialNumber,
    }));
    setStep((prev) => prev + 1);
  };

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
    >
      <Text
        style={{
          width: "100%",
          fontSize: 18,
          lineHeight: 24,
          fontWeight: "800",
          color: "#111827",
          textAlign: "center",
          marginBottom: 6,
        }}
      >
        Ingresa el FMI y el número predial de tu vivienda
      </Text>

      <Text
        style={{
          width: "90%",
          fontSize: 11,
          lineHeight: 17,
          fontWeight: "400",
          color: "#6B7280",
          textAlign: "center",
          marginBottom: 18,
        }}
      >
        Esta información se utilizará para identificar el inmueble.
      </Text>

      <View
        style={{
          width: "100%",
          maxWidth: 500,
          padding: 16,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          backgroundColor: "#FFFFFF",
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <View
          style={{
            width: "100%",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 6,
            }}
          >
            FMI
          </Text>

          <TextInput
            placeholder="Ej. 060-123456"
            placeholderTextColor="#9CA3AF"
            style={{
              width: "100%",
              height: 48,
              borderWidth: 1,
              borderColor:
                data.FMI.trim().length > 0 ? Colors.TERTIARY : "#D1D5DB",
              borderRadius: 10,
              paddingHorizontal: 12,
              fontSize: 14,
              color: "#111827",
              backgroundColor: "#FFFFFF",
            }}
            value={data.FMI}
            onChangeText={(text) => handleData("FMI", text)}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>

        <View
          style={{
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Número Predial
          </Text>

          <TextInput
            inputMode="numeric"
            keyboardType="number-pad"
            placeholder="Ej. 010203040506"
            placeholderTextColor="#9CA3AF"
            style={{
              width: "100%",
              height: 48,
              borderWidth: 1,
              borderColor:
                data.PredialNumber.trim().length > 0
                  ? Colors.TERTIARY
                  : "#D1D5DB",
              borderRadius: 10,
              paddingHorizontal: 12,
              fontSize: 14,
              color: "#111827",
              backgroundColor: "#FFFFFF",
            }}
            value={data.PredialNumber}
            onChangeText={(text) => handleData("PredialNumber", text)}
          />
        </View>
      </View>

      <View
        style={{
          width: "90%",
          maxWidth: 460,
          marginTop: 14,
          marginBottom: 14,
          paddingHorizontal: 12,
          paddingVertical: 9,
          borderRadius: 10,
          backgroundColor: "#F8FAFC",
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            lineHeight: 16,
            color: "#64748B",
            textAlign: "center",
          }}
        >
          Verifica que ambos números coincidan con los documentos oficiales del
          inmueble.
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          maxWidth: 340,
          paddingHorizontal: 16,
          marginTop: 2,
        }}
      >
        <ButtonForm
          title="Continuar"
          disabled={!isValid}
          action={handleSubmit}
        />
      </View>
    </View>
  );
}

export function PropertyInfo({ saveData, setStep }: RegisterFormData) {
  //estado de el nombre de la propiedad y descripcion de esta misma
  const [info, setInfo] = useState<{
    propertyName: string;
    propertyDescription: string;
  }>({
    propertyName: "",
    propertyDescription: "",
  });

  //estasync async async ado que controla cuando la IA esta trabajando
  const [IsGeneratePrompt, setGeneratePrompt] = useState<boolean>();

  const mutation = useMutation({
    mutationFn: IAPropertyRegistrationSuggestion,
    mutationKey: ["IA-registration-suggestion"],
    onError: (err: AxiosError<ApiError>) => {
      const data = err.response?.data;

      if (data) {
        Toast.show({
          text1: "Error en la generacion con IA",
          type: "error",
        });
      }
    },
    onSuccess: (data) => {
      setInfo({
        propertyName: data.name,
        propertyDescription: data.description,
      });
    },
  });

  //generacion de contenido con IA
  const generationIA = async () => {
    setGeneratePrompt(true);

    //limpiamos el estado de propertyName y descripcion para no montar sobre capas
    setInfo({ propertyName: "", propertyDescription: "" });

    mutation.mutate("PropertyName"); //llamamos al servidor para sugerir los nombres y descripcion

    setGeneratePrompt(false);
  };

  const onChangeText = (id: string, value: string) => {
    const currentInfo = {
      ...info,
      [id]: value,
    };

    setInfo(currentInfo);
  };

  const submitInfo = () => {
    saveData((prev) => ({
      ...prev,
      propertyName: info.propertyName,
      propertyDescription: info.propertyDescription,
    }));
    setStep((prev) => prev + 1);
  };

  const isValid =
    info.propertyName.trim() !== "" && info.propertyDescription.trim() !== "";

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
    >
      <Text
        style={{
          width: "100%",
          fontSize: 18,
          lineHeight: 24,
          fontWeight: "800",
          color: "#111827",
          textAlign: "center",
          marginBottom: 6,
        }}
      >
        Describe tu inmueble
      </Text>

      <Text
        style={{
          width: "90%",
          fontSize: 11,
          lineHeight: 17,
          color: "#6B7280",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Añade un nombre y una descripción para que los posibles arrendatarios
        conozcan mejor tu propiedad.
      </Text>

      <View
        style={{
          width: "100%",
          maxWidth: 500,
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          backgroundColor: "#FFFFFF",
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <View
          style={{
            width: "100%",
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Nombre de la propiedad
          </Text>

          <TextInput
            value={info.propertyName}
            style={{
              width: "100%",
              height: 48,
              borderWidth: 1,
              borderColor:
                info.propertyName.trim().length > 0
                  ? Colors.TERTIARY
                  : "#D1D5DB",
              borderRadius: 10,
              paddingHorizontal: 12,
              fontSize: 14,
              color: "#111827",
              backgroundColor: "#FFFFFF",
            }}
            placeholder="Ej. Apartamento Vista al Mar"
            placeholderTextColor="#9CA3AF"
            onChangeText={(text) => onChangeText("propertyName", text)}
            maxLength={80}
            autoCapitalize="sentences"
          />

          <Text
            style={{
              fontSize: 10,
              color: "#9CA3AF",
              textAlign: "right",
              marginTop: 4,
            }}
          >
            {info.propertyName.length}/80
          </Text>
        </View>

        <View
          style={{
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Descripción de la propiedad
          </Text>

          <TextInput
            value={info.propertyDescription}
            style={{
              width: "100%",
              height: 110,
              borderWidth: 1,
              borderColor:
                info.propertyDescription.trim().length > 0
                  ? Colors.TERTIARY
                  : "#D1D5DB",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 14,
              lineHeight: 19,
              color: "#111827",
              backgroundColor: "#FFFFFF",
              textAlignVertical: "top",
            }}
            multiline
            numberOfLines={5}
            placeholder="Ej. Apartamento amplio, iluminado y ubicado cerca de zonas comerciales..."
            placeholderTextColor="#9CA3AF"
            onChangeText={(text) => onChangeText("propertyDescription", text)}
            maxLength={500}
            autoCapitalize="sentences"
          />

          <Text
            style={{
              fontSize: 10,
              color: "#9CA3AF",
              textAlign: "right",
              marginTop: 4,
            }}
          >
            {info.propertyDescription.length}/500
          </Text>
        </View>
      </View>

      <Pressable
        onPress={generationIA}
        disabled={mutation.isPending}
        style={({ pressed }) => [
          {
            width: "100%",
            maxWidth: 500,
            minHeight: 44,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 7,
            marginTop: 12,
            borderWidth: 1,
            borderColor: "#1B81FF",
            borderRadius: 10,
            backgroundColor: "#EFF6FF",
            paddingHorizontal: 14,
          },
          pressed && {
            opacity: 0.7,
            transform: [{ scale: 0.98 }],
          },
          mutation.isPending && {
            opacity: 0.55,
          },
        ]}
      >
        <IAIcon width={20} height={20} />

        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "#1B81FF",
          }}
        >
          {mutation.isPending ? "Generando sugerencia..." : "Generar con IA"}
        </Text>
      </Pressable>

      <View
        style={{
          width: "100%",
          maxWidth: 340,
          paddingHorizontal: 16,
          marginTop: 12,
          marginBottom: 4,
        }}
      >
        <ButtonForm
          title="Continuar"
          action={submitInfo}
          disabled={!isValid || mutation.isPending}
        />
      </View>
    </View>
  );
}

export function StructurePropertyInfo({ saveData, setStep }: RegisterFormData) {
  const [structureProperty, setStructureProperty] =
    useState<StructurePropertyInfoType>({
      area: 0,
      bathrooms: 0,
      bedrooms: 0,
      constructionYear: 0,
      floors: 0,
      lotArea: 0,
      parkingSpaces: 0,
    });

  //guardamos la informacion estructural de la vivienda
  const submitData = () => {
    saveData((prev) => ({ ...prev, structurePropertyInfo: structureProperty }));
    setStep((prev) => prev + 1);
  };

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 16,
        marginTop: 4,
      }}
    >
      <Text
        style={{
          width: "100%",
          fontSize: 18,
          lineHeight: 24,
          fontWeight: "800",
          color: "#111827",
          textAlign: "center",
          marginBottom: 5,
        }}
      >
        Características del inmueble
      </Text>

      <Text
        style={{
          width: "90%",
          fontSize: 11,
          lineHeight: 17,
          color: "#6B7280",
          textAlign: "center",
          marginBottom: 14,
        }}
      >
        Cuéntanos un poco más sobre las características físicas de tu inmueble.
      </Text>

      <View
        style={{
          width: "100%",
          maxWidth: 500,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          paddingHorizontal: 14,
          paddingVertical: 14,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: "#E5E7EB",
          backgroundColor: "#FFFFFF",
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <View
          style={{
            width: "48%",
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 5,
            }}
          >
            N° de baños
          </Text>

          <NumberInput field="bathrooms" saveData={setStructureProperty} />
        </View>

        <View
          style={{
            width: "48%",
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 5,
            }}
          >
            N° de habitaciones
          </Text>

          <NumberInput field="bedrooms" saveData={setStructureProperty} />
        </View>

        <View
          style={{
            width: "48%",
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 5,
            }}
          >
            N° de pisos
          </Text>

          <NumberInput field="floors" saveData={setStructureProperty} />
        </View>

        <View
          style={{
            width: "48%",
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 5,
            }}
          >
            N° de parqueaderos
          </Text>

          <NumberInput field="parkingSpaces" saveData={setStructureProperty} />
        </View>

        <View
          style={{
            width: "48%",
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 5,
            }}
          >
            Área del terreno (m²)
          </Text>

          <NumberInput field="area" saveData={setStructureProperty} />
        </View>

        <View
          style={{
            width: "48%",
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 5,
            }}
          >
            Área construida (m²)
          </Text>

          <NumberInput field="lotArea" saveData={setStructureProperty} />
        </View>

        <View
          style={{
            width: "48%",
            marginBottom: 2,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 5,
            }}
          >
            Año de construcción
          </Text>

          <NumberInput
            field="constructionYear"
            saveData={setStructureProperty}
          />
        </View>
      </View>

      <View
        style={{
          width: "100%",
          maxWidth: 340,
          paddingHorizontal: 16,
          marginTop: 14,
          marginBottom: 4,
        }}
      >
        <ButtonForm title="Continuar" action={submitData} />
      </View>
    </View>
  );
}

export function EconomicPropertyInfo({ saveData, setStep }: RegisterFormData) {
  const [economicInfo, setEconomicInfo] = useState<EconomicPropertyInfoType>({
    currency: "COP",
    depositAmount: 0,
    monthlyRent: 0,
    utilitiesIncluded: false,
  });

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 8,
        paddingTop: 2,
      }}
    >
      <Text
        style={{
          width: "100%",
          fontSize: 18,
          lineHeight: 24,
          fontWeight: "800",
          color: "#111827",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        Información económica del inmueble
      </Text>

      <Text
        style={{
          width: "90%",
          fontSize: 11,
          lineHeight: 17,
          color: "#6B7280",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Define el valor de renta, depósito y los servicios incluidos.
      </Text>

      <View
        style={{
          width: "94%",
          maxWidth: 500,

          paddingHorizontal: 14,
          paddingVertical: 12,

          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#E5E7EB",

          backgroundColor: "#FFFFFF",

          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.06,
          shadowRadius: 5,

          elevation: 2,
        }}
      >
        <View style={{ marginBottom: 10 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 5,
            }}
          >
            Valor de renta mensual
          </Text>

          <View
            style={{
              height: 42,
              flexDirection: "row",
              alignItems: "center",

              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 9,

              backgroundColor: "#FFFFFF",
            }}
          >
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              $
            </Text>

            <TextInput
              value={
                economicInfo.monthlyRent === 0
                  ? ""
                  : String(economicInfo.monthlyRent)
              }
              onChangeText={(value) =>
                setEconomicInfo((prev) => ({
                  ...prev,
                  monthlyRent: Number(value.replace(/[^0-9]/g, "")),
                }))
              }
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              style={{
                flex: 1,
                height: "100%",
                paddingHorizontal: 8,
                fontSize: 14,
                color: "#111827",
              }}
            />
          </View>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 5,
            }}
          >
            Valor del depósito
          </Text>

          <View
            style={{
              height: 42,
              flexDirection: "row",
              alignItems: "center",

              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 9,

              backgroundColor: "#FFFFFF",
            }}
          >
            <Text
              style={{
                paddingLeft: 10,
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              $
            </Text>

            <TextInput
              value={
                economicInfo.depositAmount === 0
                  ? ""
                  : String(economicInfo.depositAmount)
              }
              onChangeText={(value) =>
                setEconomicInfo((prev) => ({
                  ...prev,
                  depositAmount: Number(value.replace(/[^0-9]/g, "")),
                }))
              }
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              style={{
                flex: 1,
                height: "100%",
                paddingHorizontal: 8,
                fontSize: 14,
                color: "#111827",
              }}
            />
          </View>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 5,
            }}
          >
            Tipo de moneda
          </Text>

          <View
            style={{
              height: 42,
              justifyContent: "center",

              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 9,

              backgroundColor: "#FFFFFF",
              overflow: "hidden",
            }}
          >
            <Picker
              selectedValue={economicInfo.currency}
              onValueChange={(itemValue) =>
                setEconomicInfo((prev) => ({
                  ...prev,
                  currency: itemValue,
                }))
              }
              style={{
                width: "100%",
                height: 56,
                color: "#111827",
              }}
            >
              <Picker.Item label="Peso colombiano (COP)" value="COP" />
              <Picker.Item label="Dólar estadounidense (USD)" value="USD" />
            </Picker>
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 5,
            }}
          >
            ¿Servicios incluidos?
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 8,
            }}
          >
            <Pressable
              onPress={() =>
                setEconomicInfo((prev) => ({
                  ...prev,
                  utilitiesIncluded: true,
                }))
              }
              style={{
                flex: 1,
                height: 38,

                alignItems: "center",
                justifyContent: "center",

                borderWidth: 1,
                borderColor: economicInfo.utilitiesIncluded
                  ? "#111827"
                  : "#D1D5DB",

                borderRadius: 8,

                backgroundColor: economicInfo.utilitiesIncluded
                  ? "#F3F4F6"
                  : "#FFFFFF",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Sí
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                setEconomicInfo((prev) => ({
                  ...prev,
                  utilitiesIncluded: false,
                }))
              }
              style={{
                flex: 1,
                height: 38,

                alignItems: "center",
                justifyContent: "center",

                borderWidth: 1,
                borderColor: !economicInfo.utilitiesIncluded
                  ? "#111827"
                  : "#D1D5DB",

                borderRadius: 8,

                backgroundColor: !economicInfo.utilitiesIncluded
                  ? "#F3F4F6"
                  : "#FFFFFF",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                No
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          maxWidth: 320,
          paddingHorizontal: 20,
          marginTop: 12,
        }}
      >
        <ButtonForm
          title="Continuar"
          action={() => {
            saveData((prev) => ({
              ...prev,
              economicPropertyInfo: economicInfo,
            }));

            return setStep((prev) => prev + 1);
          }}
        />
      </View>
    </View>
  );
}

interface TypeAndOccupationProps {
  typeProperty: TypePropertyType;
  occupationType: PropertyOccupationType;
}

export function TypeAndOccupationStep({
  saveData,
  setIsCreateProperty,
  disabled,
}: {
  disabled: boolean;
  saveData: React.Dispatch<
    React.SetStateAction<Partial<CreatePropertyType> | undefined>
  >;
  setIsCreateProperty: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [info, setInfo] = useState<TypeAndOccupationProps>({
    occupationType: "DESOCUPADO",
    typeProperty: "RESIDENCIAL",
  });

  const handlePropertyType = (key: string, value: string) => {
    const data = {
      ...info,
      [key]: value,
    };

    setInfo(data);
  };

  const submitData = () => {
    saveData((prev) => ({
      ...prev,
      propertyOccupationType: info.occupationType,
      propertyType: info.typeProperty,
    }));

    setIsCreateProperty(true);
  };

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 4,
        marginTop: 8,
      }}
    >
      <Text
        style={{
          width: "100%",
          fontSize: 18,
          lineHeight: 24,
          fontWeight: "800",
          color: "#111827",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        Últimos detalles de tu inmueble
      </Text>

      <Text
        style={{
          width: "90%",
          fontSize: 11,
          lineHeight: 17,
          fontWeight: "400",
          color: "#6B7280",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Selecciona el tipo y el estado actual de ocupación de tu propiedad.
      </Text>

      <View
        style={{
          width: "100%",
          maxWidth: 500,

          paddingHorizontal: 18,
          paddingVertical: 20,

          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#E5E7EB",

          backgroundColor: "#FFFFFF",

          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.07,
          shadowRadius: 8,

          elevation: 3,
        }}
      >
        <View
          style={{
            width: "100%",
            marginBottom: 22,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#374151",
              marginBottom: 8,
            }}
          >
            Tipo de inmueble
          </Text>

          <View
            style={{
              width: "100%",
              height: 54,

              justifyContent: "center",

              borderWidth: 1,
              borderColor: "#D1D5DB",

              borderRadius: 12,

              backgroundColor: "#FFFFFF",

              overflow: "hidden",
            }}
          >
            <Picker
              style={{
                width: "100%",
                height: 54,
                color: "#111827",
              }}
              selectedValue={info.typeProperty}
              onValueChange={(itemValue, _) =>
                handlePropertyType("typeProperty", itemValue)
              }
            >
              <Picker.Item label="Residencial" value="RESIDENCIAL" />
              <Picker.Item label="Comercial" value="COMERCIAL" />
              <Picker.Item label="Industrial" value="INDUSTRIAL" />
              <Picker.Item label="Terreno" value="TERRENO" />
              <Picker.Item label="Urbano" value="URBANO" />
              <Picker.Item label="Agrario" value="AGRARIO" />
              <Picker.Item label="Mixto" value="MIXTO" />
            </Picker>
          </View>
        </View>

        <View
          style={{
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#374151",
              marginBottom: 8,
            }}
          >
            Estado de ocupación
          </Text>

          <View
            style={{
              width: "100%",
              height: 54,

              justifyContent: "center",

              borderWidth: 1,
              borderColor: "#D1D5DB",

              borderRadius: 12,

              backgroundColor: "#FFFFFF",

              overflow: "hidden",
            }}
          >
            <Picker
              style={{
                width: "100%",
                height: 54,
                color: "#111827",
              }}
              selectedValue={info.occupationType}
              onValueChange={(itemValue, _) =>
                handlePropertyType("occupationType", itemValue)
              }
            >
              <Picker.Item label="Arrendado" value="ARRENDADO" />
              <Picker.Item label="En proceso" value="EN PROCESO" />
              <Picker.Item label="Disponible" value="DISPONIBLE" />
            </Picker>
          </View>
        </View>
      </View>

      <View
        style={{
          width: "90%",
          maxWidth: 460,

          marginTop: 16,
          marginBottom: 18,

          paddingHorizontal: 14,
          paddingVertical: 11,

          borderRadius: 12,

          backgroundColor: "#F8FAFC",

          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            lineHeight: 18,
            color: "#64748B",
            textAlign: "center",
          }}
        >
          Revisa que la información seleccionada sea correcta antes de registrar
          tu propiedad.
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          maxWidth: 360,
          paddingHorizontal: 20,
        }}
      >
        <ButtonForm
          title="Registrar propiedad"
          action={submitData}
          disabled={disabled}
        />
      </View>
    </View>
  );
}
