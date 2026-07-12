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
    View,
  } from "react-native";
import MapView, { Marker, type LatLng, type Region } from "react-native-maps";
import Toast from "react-native-toast-message";
import { ButtonForm } from "../../../components/buttons/button";
import { Colors } from "../../../themes/themes";
import type { RegisterFormData } from "../screens/property-registration-screen";

import { useQuery } from "@tanstack/react-query";
import AddIcon from "../../../assets/icons/add-square.svg";
import CloseIcon from "../../../assets/icons/close.svg";
import UploadIcon from "../../../assets/icons/upload.svg";
import { SearchInput } from "../../../components/inputs/input";
import { OpenStreetMapApi } from "../api";
import { resourcesImageStorage } from "../services/property-registration.service";

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
function DrapAndDropStep({ saveData, setStep }: RegisterFormData) {
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

function DirectionStep({ saveData, setStep }: RegisterFormData) {
  //le pedimos permiso al usuario para acceder a su ubicacion y poder ubicarlo en el Map View
  const [coords, setCoords] = useState<Region>();
  const [mark, setMark] = useState<LatLng>();
  const [inputPlace, setInputPlace] = useState<string>("Colombia");
  const [debouncedPlace, setDebouncedPlace] = useState("");

  const mapRef = useRef<MapView>(null);

  const { data } = useQuery({
    queryFn: async () => await OpenStreetMapApi(debouncedPlace),
    queryKey: ["openstreet", debouncedPlace],
    enabled: debouncedPlace.trim().length >= 3,
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

      setCoords(initialRegion);
    };
    getPermission();
  }, []);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPlace(inputPlace);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputPlace]);

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
      </View>
    </View>
  );
}

const DirectionStepStyles = StyleSheet.create({
  mapContainer: {
    width: "90%",
    height: 300,

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

const globalStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    alignItems: "center",
    marginTop: 5,
  },
});

export { DirectionStep, DrapAndDropStep };
