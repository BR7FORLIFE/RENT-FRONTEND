import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//assets
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CommunityIcon from "../../../../assets/icons/community.svg";
import { PrincipalError } from "../../../../components/error";
import SplashScreen from "../../../../components/splash-screen";
import type { PaginationParams } from "../../../../types/global";
import { getAllPropertyMembers, GetPropertyById } from "../../api";
import type { StatusPropertyMemberType } from "../../schemas/property-registration.schema";

export function PropertyMemberDetailsScreen() {
  const { id: propertyId } = useLocalSearchParams<{ id: string }>();
  const [search, setSearch] = useState<
    PaginationParams & { status: StatusPropertyMemberType }
  >({
    limit: 10,
    page: 1,
    status: "ACTIVE",
  });

  const {
    data: propertyData,
    isLoading: propertyLoading,
    isError: propertyError,
  } = useQuery({
    // nos aprovechamos de la cache de details en la seccion de properties
    queryKey: ["properties", propertyId],
    queryFn: () => GetPropertyById(propertyId),
  });

  //este use query es para obtener los miembros de la propiedad
  const {
    data: propertyMemberData,
    isLoading: memberLoading,
    isError: memberError,
  } = useQuery({
    queryKey: ["propertyMembers", propertyId], // cache tanstack -> propertyId vinculado con sus miembros
    queryFn: () =>
      getAllPropertyMembers(
        propertyId,
        search.page,
        search.limit,
        search.status,
      ),
  });

  if (propertyLoading && memberLoading) {
    return <SplashScreen />;
  }

  //cualquiera de los dos que falle hay que mandar el error o notificar a la aplicacion
  if (propertyError || memberError) {
    return <PrincipalError error="error al obtener los datos!" />; // hay que crear la interfaz de error XD
  }

  if (!propertyData || !propertyMemberData) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.header}>
        {/**titulo y cantidad de miembros en la propiedad */}
        <Text style={{ fontSize: 20, fontWeight: "700" }}>RENT</Text>

        {/**cantidad de properties members */}
        <View style={styles.headerInfoMembers}>
          <CommunityIcon width={24} height={24} />
          <Text>25 miembros</Text>
        </View>
      </View>

      {/**seccion de imagen y pequeña informacion relevante sobre ella (FIJO) */}
      <View style={styles.propertyInfo}>
        {/**contenedor de la imagen de la propiedad */}
        <View style={styles.propertyInfoImage}>
          {propertyData?.resources[0].secureUrl ? (
            <Image
              source={{ uri: propertyData?.resources[0].secureUrl }}
              style={{ width: "100%", height: "100%", borderRadius: 12 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700" }}>
                Imagen no disponible
              </Text>
            </View>
          )}
        </View>

        {/**la pequeña informacion relacionada a la propiedad */}
        <View style={styles.propertyInfoDescription}>
          
        </View>
      </View>

      {/**filtros y busquedas */}
      <View></View>

      {/**lista de properties members */}
      <View></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9EEF5",
  },

  headerInfoMembers: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#2F91F9",
    backgroundColor: "#F4F9FF",
  },

  propertyInfo: {
    marginTop: 24,
    width: "100%",
    height: "20%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    paddingHorizontal: 20,
  },

  propertyInfoImage: {
    width: "45%",
    height: "100%",
    borderWidth: 1,
    borderRadius: 12,
  },

  propertyInfoDescription: {
    width: "55%",
    height: "100%",
    flexDirection: "column",
    gap: 6,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },

  propertyInfoDescriptionText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#667085",
    lineHeight: 19,
  },
});
