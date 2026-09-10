import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrincipalError } from "../../../components/error";
import SplashScreen from "../../../components/splash-screen";
import { GetPropertyById } from "../api";
import type {
    createResourceImageType,
    PropertyOccupationType,
    TypePropertyType,
} from "../schemas/property-registration.schema";

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

  useEffect(() => {
    
  }, [property]);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return (
      <PrincipalError error="No se ha podido obtener la informacion de la propiedad" />
    );
  }

  return (
    <SafeAreaView>
      <View></View>
    </SafeAreaView>
  );
}
