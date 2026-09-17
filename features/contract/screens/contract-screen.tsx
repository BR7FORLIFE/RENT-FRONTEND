import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrincipalError } from "../../../components/error";
import { RentHeader } from "../../../components/header";
import { EmptyList, RentDescription } from "../../../components/info";
import SplashScreen, {
  SplashWaveBackground,
} from "../../../components/splash-screen";
import type { PaginationParams } from "../../../types/global";
import { GetAllProperties } from "../../property-registration/api";
import { AssociationProperty } from "../../property-registration/screens/property-associations/property-associations-screen";

//imagenes

export function ContractScreen() {
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: 10,
    page: 1,
  });

  const { isLoading, data, isError } = useQuery({
    queryKey: ["properties"],
    queryFn: () => GetAllProperties(pagination.page, pagination.limit),
    staleTime: 60000 * 60,
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return <PrincipalError error="No se han podido obtener las propiedades!" />;
  }

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: "white", flex: 1, flexDirection: "column" }}
    >
      <SplashWaveBackground />

      <RentHeader sectionName="CONTRATOS" />

      <RentDescription
        title="Ver contratos"
        description="Gestiona los contratos asociados a tus propiedades."
      />

      <View style={styles.asociationProperties}>
        <FlatList
          data={data.data}
          renderItem={({ item }) => (
            <AssociationProperty
              name={item.propertyName}
              description={item.propertyDescription}
              action={() =>
                router.push({
                  pathname: "/contracts/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.associationList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyList
              title="No tienes propiedades asociadas"
              description="Cuando tengas una asociación, aparecerá aquí para que puedas consultarla y gestionarla."
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 58,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9EEF5",
  },

  brand: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#111827",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },

  asociationProperties: {
    width: "100%",
    flex: 1,
    paddingHorizontal: 10,
  },

  associationList: {
    width: "100%",
    paddingHorizontal: 2,
    paddingTop: 4,
    paddingBottom: 6,
    gap: 12,
  },
});
