import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonForm } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import SplashScreen from "../../../components/splash-screen";
import { EditingProperty, GetPropertyById } from "../api";
import type {
  createResourceImageType,
  EditingPropertyInfo,
  PropertyOccupationType,
  TypePropertyType,
} from "../schemas/property-registration.schema";

//imagenes
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import WaveBackground from "../../../assets/backgrounds/wave-background.svg";
import { Input } from "../../../components/inputs/input";

interface PropertyEditable {
  propertyName: string;
  propertyType: TypePropertyType;
  propertyOccupationType: PropertyOccupationType;
  resources: createResourceImageType[];
}

export function EditProperty() {
  const [editable, setEditable] = useState<PropertyEditable>();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: property,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["properties", id],
    queryFn: () => GetPropertyById(id),
  });

  const mutation = useMutation({
    mutationKey: ["properties", id],
    mutationFn: ({
      id,
      propertyInfo,
    }: {
      id: string;
      propertyInfo: EditingPropertyInfo;
    }) => EditingProperty(id, propertyInfo),
    onError: () => {},
    onSuccess: (res) => {
      Toast.show({
        type: "error",
        text2: res.message,
      });

      router.navigate("/home/(tabs)/property-registration");
    },
  });

  useEffect(() => {
    if (!property) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditable({
      propertyName: property.propertyName,
      propertyOccupationType:
        property.propertyOccupationType as PropertyOccupationType,
      propertyType: property.typeProperty as TypePropertyType,
      resources: property.resources as createResourceImageType[],
    });
  }, [property]);

  const handleEditPropertyInfo = (field: string, value: string) => {
    setEditable((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const submitInfo = async () => {
    await mutation.mutateAsync({
      id,
      propertyInfo: {
        propertyName: editable?.propertyName,
        propertyOccupationType: editable?.propertyOccupationType,
        propertyType: editable?.propertyType,
        resources: editable?.resources,
      },
    });
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return (
      <PrincipalError error="No se ha podido obtener la informacion de la propiedad" />
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 15,
        flexDirection: "column",
        gap: 15,
      }}
    >
      <View style={{ position: "absolute", bottom: -40, right: 0, left: 0 }}>
        <WaveBackground />
      </View>

      <View style={styles.header}>
        {/**titulo y cantidad de miembros en la propiedad */}
        <Text style={{ fontSize: 20, fontWeight: "700" }}>RENT</Text>

        <Text style={{ fontWeight: "700" }}>Editar</Text>
      </View>

      {/**carrusel de imagenes de la propiedad */}
      <View style={styles.imagesContainer}></View>

      {/**inputs de edicion de los campos */}
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <Text style={styles.text}>Nombre de propiedad</Text>
          <Input
            field="propertyName"
            fn={handleEditPropertyInfo}
            label="Nombre"
            placeholder="Nuevo nombre de propiedad"
            value={editable ? editable.propertyName : ""}
          />
        </View>

        {/**select */}
        <View style={styles.input}>
          <Text style={styles.text}>Tipo de propiedad</Text>
          <Picker
            style={{
              width: "100%",
              height: 54,
              color: "#111827",
            }}
            selectedValue={editable ? editable.propertyType : "RESIDENCIAL"}
            onValueChange={(itemValue, _) =>
              handleEditPropertyInfo("propertyType", itemValue)
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

        {/**select */}
        <View style={styles.input}>
          <Text style={styles.text}>Tipo de ocupacion</Text>
          <Picker
            style={{
              width: "100%",
              height: 54,
              color: "#111827",
            }}
            selectedValue={
              editable ? editable.propertyOccupationType : "OCUPADO"
            }
            onValueChange={(itemValue, _) =>
              handleEditPropertyInfo("propertyOccupationType", itemValue)
            }
          >
            <Picker.Item label="Arrendado" value="OCUPADO" />
            <Picker.Item label="En proceso" value="EN_PROCESO" />
            <Picker.Item label="Disponible" value="DESOCUPADO" />
          </Picker>
        </View>
      </View>

      {/**boton de aceptar edicion */}
      <View style={styles.editButtonContainer}>
        <ButtonForm
          title="Editar"
          action={submitInfo}
          disabled={editable?.propertyName.length === 0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 18,
    paddingTop: 8,
  },

  //header
  header: {
    width: "100%",
    height: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9EEF5",
  },

  wave: {
    position: "absolute",
    bottom: -35,
    left: 0,
    right: 0,
    opacity: 0.8,
  },

  imagesContainer: {
    width: "100%",
    height: "32%",
    marginBottom: 10,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  inputContainer: {
    width: "100%",
    height: "39%",
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },

  input: {
    width: "92%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 7,
  },

  editButtonContainer: {
    width: "100%",
    height: 54,
    marginTop: 16,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontWeight: "700",
  },
});
