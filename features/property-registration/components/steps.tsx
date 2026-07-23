import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import
  {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
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
import CloseIcon from "../../../assets/icons/close.svg";
import UploadIcon from "../../../assets/icons/upload.svg";
import { SearchInput } from "../../../components/inputs/input";
import type { ApiError } from "../../../types/global";
import { IAPropertyRegistrationSuggestion, OpenStreetMapApi } from "../api";
import type {
  CreateDirectionType,
  CreatePropertyType,
  PropertyOccupationType,
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
  <View style={[imagesStyles.imageContainer, { position: "relative" }]}>
    <Image source={{ uri }} style={imagesStyles.image} resizeMode="cover" />
    <Pressable
      style={imagesStyles.deleteButton}
      onPress={() =>
        setImageUri((prev) => prev.filter((image) => image !== uri))
      }
    >
      <CloseIcon height={20} width={20} />
    </Pressable>
  </View>
);

{
  /*paso 1: cargar la imagen para crear el ResourceImage */
}
export function DrapAndDropStep({ setStep }: RegisterFormData) {
  const [imagesUris, setImagesUris] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const startedData = async () => {
      const resourcesImages = await resourcesImageStorage().get();

      if (!resourcesImageStorage) {
        setImagesUris([]);
        return;
      }

      setImagesUris(resourcesImages!);
    };
    startedData();
  }, []);

  //selecccion de imagen y establecimiento de la uri de la imagen en el estado
  const submitImage = async () => {
    setLoading(true);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

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

    if (result.canceled) {
      return;
    }

    const image = result.assets[0];
    setLoading(false);
    setImagesUris((prev) => [...prev, image.uri]);
  };

  //preparar la imagen para cloudinary (POST) y crear parcialmente el resourceImage para setearlo en el estado padre
  // pasar al siguiente step
  const createResourceImage = async () => {
    /**async
     * Estrategia para cargar a imagen a cloudinary
     *
     * - no se puede cargar la imagen apenas se le presione aceptar ya que el usuario puede desistir de ella
     * - se cargara la imagen antes de hacer la peticion completa al backend para obtener informacion relevante
     *  de cloudinary
     *
     */
    //guardamos la lista de uris en el storage ya sea para reconstrir toda la peticion o mantener persistencia
    // si el usuario se sale de la aplicacion sin querer
    await resourcesImageStorage().set(imagesUris);
    setStep((prev) => prev + 1);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={{ fontSize: 24, fontWeight: 700 }}>
        Registra tu inmueble!
      </Text>
      <Text
        style={{
          width: "80%",
          marginTop: 12,
          textAlign: "center",
          fontWeight: "300",
        }}
      >
        Adjunta una o varias imagenes para la propiedad que deseas agregar!
      </Text>

      {imagesUris.length !== 0 ? (
        <View
          style={{
            flexDirection: "column",
            gap: 20,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            height: "70%",
            marginTop: 12,
            position: "relative",
          }}
        >
          <FlatList
            style={{ width: "95%", flexGrow: 0 }}
            data={imagesUris}
            keyExtractor={(item) => item}
            numColumns={3}
            renderItem={({ item }) => (
              <ImagePreview uri={item} setImageUri={setImagesUris} />
            )}
            contentContainerStyle={imagesStyles.list}
            columnWrapperStyle={imagesStyles.row}
          />

          {imagesUris.length !== 6 ? (
            <Pressable
              disabled={loading}
              onPress={submitImage}
              style={{
                width: "50%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
            >
              <AddIcon height={24} width={24} />
              <Text>{loading ? "Abriendo Panel.." : "Añadir otra imagen"}</Text>
            </Pressable>
          ) : (
            <Text>Capacidad maxima de imagenes !</Text>
          )}

          <View style={{ width: "50%", height: "20%" }}>
            <ButtonForm title="Aceptar" action={createResourceImage} />
          </View>
        </View>
      ) : (
        <Pressable
          style={[
            drapAndDropStepStyles.preview,
            { opacity: loading ? 0.5 : 1 },
          ]}
          onPress={submitImage}
          disabled={loading}
        >
          <UploadIcon width={70} height={70} />
          <Text
            style={[
              { color: Colors.NEUTRAL, fontWeight: "600" },
              { fontSize: loading ? 12 : 14 },
            ]}
          >
            {loading
              ? "Abriendo panel de selección de imagen..."
              : "Cargar imagen"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const drapAndDropStepStyles = StyleSheet.create({
  preview: {
    width: "75%",
    height: "75%",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    gap: 4,
  },
});

const imagesStyles = StyleSheet.create({
  list: {
    paddingHorizontal: 10,
    paddingBottom: 15,
  },

  row: {
    justifyContent: "space-between",
  },

  imageContainer: {
    width: "31%",
    aspectRatio: 1,

    marginBottom: 8,

    borderRadius: 10,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  deleteButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
  },
});

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
      typeStreet: "CAREER",
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
    <View style={globalStyles.container}>
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Text>Registra la dirección de tu inmueble!</Text>

        <View style={{ width: "80%" }}>
          <SearchInput
            value={inputPlace}
            onChangeText={(text) => setInputPlace(text)}
          />
        </View>
        {coords ? (
          <View style={DirectionStepStyles.mapContainer}>
            <MapView
              ref={mapRef}
              initialRegion={coords}
              style={DirectionStepStyles.map}
              onPress={(e) => setMark(e.nativeEvent.coordinate)}
            >
              {mark && <Marker coordinate={mark} />}
            </MapView>
          </View>
        ) : (
          <Text>Cargando Mapa...</Text>
        )}
        <View style={{ width: "40%" }}>
          <ButtonForm
            title="Buscar"
            action={handleInformation}
            disabled={!coords || inputPlace.trim().length === 0}
          />
        </View>
      </View>
    </View>
  );
}

const DirectionStepStyles = StyleSheet.create({
  mapContainer: {
    width: "90%",
    height: 240,

    borderRadius: 18,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    backgroundColor: "#FFF",

    elevation: 4, // Android
    shadowColor: "#000", // iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  map: {
    flex: 1,
  },
});

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
    <View style={globalStyles.container}>
      <View style={stylesFmiAndPredialNumber.container}>
        <Text style={stylesFmiAndPredialNumber.title}>
          Ingresa el FMI y el número predial de tu vivienda
        </Text>

        <Text style={stylesFmiAndPredialNumber.subtitle}>
          Esta información se utilizará para identificar el inmueble.
        </Text>

        <View style={stylesFmiAndPredialNumber.field}>
          <Text style={stylesFmiAndPredialNumber.label}>FMI</Text>
          <TextInput
            placeholder="Ej. 060-123456"
            style={stylesFmiAndPredialNumber.input}
            value={data.FMI}
            onChangeText={(text) => handleData("FMI", text)}
          />
        </View>

        <View style={stylesFmiAndPredialNumber.field}>
          <Text style={stylesFmiAndPredialNumber.label}>Número Predial</Text>
          <TextInput
            inputMode="numeric"
            placeholder="Ej. 010203040506"
            style={stylesFmiAndPredialNumber.input}
            value={data.PredialNumber}
            onChangeText={(text) => handleData("PredialNumber", text)}
          />
        </View>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <View style={{ width: "50%" }}>
            <ButtonForm
              title="Aceptar"
              disabled={!isValid}
              action={handleSubmit}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const stylesFmiAndPredialNumber = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 30,
    gap: 24,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },

  field: {
    width: "100%",
    gap: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 4,
  },

  input: {
    width: "100%",
    height: 52,
    borderWidth: 1,
    borderColor: Colors.TERTIARY,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#FFF",
    color: "#111827",
  },
});

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
    <View style={globalStyles.container}>
      <View
        style={{
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          height: "100%",
          gap: 30,
        }}
      >
        {/**Nombre de la propiedad */}
        <View
          style={{
            width: "100%",
            height: "20%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text style={{ fontWeight: "700" }}>Nombre de la propiedad</Text>
          <TextInput
            value={info.propertyName}
            style={{
              borderWidth: 2,
              borderColor: "black",
              width: "70%",
              height: 50,
              borderRadius: 12,
              textAlign: "center",
            }}
            placeholder="NOMBRE PROPIEDAD"
            onChangeText={(text) => onChangeText("propertyName", text)}
          />
        </View>

        {/**Descripcion de la propiedad */}
        <View
          style={{
            width: "100%",
            height: "30%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text style={{ fontWeight: "700" }}>Descripción de la propiedad</Text>
          <TextInput
            value={info.propertyDescription}
            style={{
              borderWidth: 2,
              borderColor: "black",
              width: "70%",
              height: "100%",
              borderRadius: 12,
              textAlign: "center",
            }}
            multiline
            numberOfLines={4}
            placeholder="DESCRIPCION DE LA PROPIEDAD"
            onChangeText={(text) => onChangeText("propertyDescription", text)}
          />
        </View>

        {/** Boton para establecer la informacion */}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <View style={{ width: "40%" }}>
            <ButtonForm
              title="Aceptar"
              action={submitInfo}
              disabled={!isValid}
            />
          </View>
          <Pressable
            onPress={generationIA}
            style={{
              flexDirection: "row",
              gap: 4,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderColor: "#1b81ff",
              paddingHorizontal: 8,
              borderRadius: 12,
            }}
            disabled={IsGeneratePrompt}
          >
            <IAIcon width={24} height={24} />
            {mutation.isPending ? (
              <Text style={{ fontWeight: "700", color: "#1b81ff" }}>
                Generando...
              </Text>
            ) : (
              <Text style={{ fontWeight: "700", color: "#1b81ff" }}>
                Generar con IA
              </Text>
            )}
          </Pressable>
        </View>
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
    occupationType: "VACANT",
    typeProperty: "RESIDENTIAL",
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
    <View style={globalStyles.container}>
      <View
        style={{
          width: "100%",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          height: "100%",
          gap: 30,
          marginTop: 24,
        }}
      >
        <View style={{ width: "80%" }}>
          <Text>Tipo de inmueble</Text>
          <View style={PickerStyles.container}>
            <Picker
              style={PickerStyles.picker}
              selectedValue={info.typeProperty}
              onValueChange={(itemValue, _) =>
                handlePropertyType("typeProperty", itemValue)
              }
            >
              <Picker.Item label="RESIDENCIAL" value="RESIDENTIAL" />
              <Picker.Item label="COMERCIAL" value="COMMERCIAL" />
              <Picker.Item label="INDUSTRIAL" value="INDUSTRIAL" />
              <Picker.Item label="TERRENO" value="LAND_OR_SOIL" />
              <Picker.Item label="URBANO" value="URBAN" />
              <Picker.Item label="AGRARIO" value="AGRARIAN" />
              <Picker.Item label="MIXTO" value="MIXED" />
            </Picker>
          </View>
        </View>

        <View style={{ width: "80%" }}>
          <Text>Estado de ocupacion del inmueble</Text>
          <View style={PickerStyles.container}>
            <Picker
              style={PickerStyles.picker}
              selectedValue={info.occupationType}
              onValueChange={(itemValue, _) =>
                handlePropertyType("occupationType", itemValue)
              }
            >
              <Picker.Item label="ARRENDADO" value="OCCUPIED" />
              <Picker.Item label="EN PROCESO" value="IN_PROCESS" />
              <Picker.Item label="DISPONIBLE" value="VACANT" />
            </Picker>
          </View>
        </View>

        <View style={{ width: "80%" }}>
          <ButtonForm
            title="Registrar Propiedad"
            action={submitData}
            disabled={disabled}
          />
        </View>
      </View>
    </View>
  );
}

const PickerStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginVertical: 8,
  },
  picker: {
    color: "#111827",
    height: 56,
    width: "100%",
  },
});

const globalStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    alignItems: "center",
    marginTop: 5,
  },
});
