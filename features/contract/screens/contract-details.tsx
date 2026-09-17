import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrincipalError } from "../../../components/error";
import { RentHeader } from "../../../components/header";
import { RentDescription } from "../../../components/info";
import SplashScreen, {
    SplashWaveBackground,
} from "../../../components/splash-screen";
import type { PaginationParams } from "../../../types/global";
import { GetAllContractDraft } from "../api";

export function ContractDetailsScreen() {
  const { id: propertyId } = useLocalSearchParams<{
    id: string;
  }>();

  const [pagination, setPagination] = useState<PaginationParams>({
    limit: 10,
    page: 1,
  });

  const { isLoading, isError, data } = useQuery({
    queryKey: ["contracts", propertyId],
    queryFn: () =>
      GetAllContractDraft(propertyId, pagination.page, pagination.limit),
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return (
      <PrincipalError error="Error al obtener los contratos para esta propiedad!" />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 12,
        backgroundColor: "white",
      }}
    >
      <SplashWaveBackground />
      <RentHeader sectionName="CONTRATOS" />

      <RentDescription
        title="Lista de contratos"
        description="Visualiza los distintos contratos para esta propiedad!"
      />

      <View style={styles.contractListSection}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contractListSection: {
    width: "100%",
  },
});
