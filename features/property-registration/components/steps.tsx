import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { ButtonForm } from "../../../components/buttons/button";
import { Colors } from "../../../themes/themes";
import type { RegisterFormData } from "../screens/property-registration-screen";

import CloseIcon from "../../../assets/icons/close.svg";
import UploadIcon from "../../../assets/icons/upload.svg";

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
  setImageUri: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}) => (
  <View style={[drapAndDropStepStyles.preview, { position: "relative" }]}>
    <Image
      source={{ uri }}
      style={{ width: "100%", height: "100%" }}
      resizeMode="cover"
    />
    <Pressable
      style={{ position: "absolute", right: 0, top: 0 }}
      onPress={() => setImageUri(null)}
    >
      <CloseIcon height={30} width={30} />
    </Pressable>
  </View>
);

{
  /*paso 1: cargar la imagen para crear el ResourceImage */
}
function DrapAndDropStep({ saveData, setStep }: RegisterFormData) {
  const [imageUri, setImageUri] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(false);

  const ID = "resourceImage";

  //selecccion de imagen y establecimiento de la uri de la imagen en el estado
  const submitImage = async () => {
    setLoading(true);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Toast.show({
        type: "error",
        text2: "Necesitamos permisos para adjuntar la imagen!",
      });
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
    setImageUri(image.uri);
  };

  //preparar la imagen para cloudinary (POST) y crear parcialmente el resourceImage para setearlo en el estado padre
  // pasar al siguiente step
  const createResourceImage = () => {
    /**
     * Estrategia para cargar a imagen a cloudinary
     *
     * - no se puede cargar la imagen apenas se le presione aceptar ya que el usuario puede desistir de ella
     * - se cargara la imagen antes de hacer la peticion completa al backend para obtener informacion relevante
     *  de cloudinary
     *
     */

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

      {imageUri ? (
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
          <ImagePreview uri={imageUri} setImageUri={setImageUri} />

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
    width: "70%",
    height: "70%",
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

function DirectionStep({ saveData, setStep }: RegisterFormData) {
  //le pedimos permiso al usuario para acceder a su ubicacion y poder ubicarlo en google maps

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

      console.log("permiso concedido");
    };
    getPermission();
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text>Registra la dirección de tu inmueble!</Text>
    </View>
  );
}

const globalStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: "auto",
    alignItems: "center",
    marginTop: 15,
  },
});

export { DirectionStep, DrapAndDropStep };
