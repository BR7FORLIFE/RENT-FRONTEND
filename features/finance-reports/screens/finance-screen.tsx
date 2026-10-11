import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrincipalError } from "../../../components/error";
import { RentHeader } from "../../../components/header";
import { EmptyList, RentDescription } from "../../../components/info";
import SplashScreen, {
  SplashWaveBackground,
} from "../../../components/splash-screen";
import { Palette } from "../../../themes/themes";
import { GetAllProperties } from "../../property-registration/api";
import { AssociationProperty } from "../../property-registration/screens/property-associations/property-associations-screen";

export function FinancialScreen() {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["properties"],
    queryFn: () => GetAllProperties(1, 10),
    staleTime: 60000 * 60,
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError || !data) {
    return <PrincipalError error="No se han podido obtener las propiedades!" />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <SplashWaveBackground />
      <RentHeader sectionName="Finanzas" />

      <RentDescription
        title="Finanzas"
        description="Elige una propiedad para ver su resumen, movimientos e historial."
      />

      <View style={styles.content}>
        <FlatList
          data={data.data}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <AssociationProperty
              name={item.propertyName}
              description={item.propertyDescription}
              action={() =>
                router.push({
                  pathname: "/finance/[id]",
                  params: { id: item.id, propertyName: item.propertyName },
                })
              }
            />
          )}
          ListEmptyComponent={
            <EmptyList
              title="No tienes propiedades asociadas"
              description="Cuando tengas una asociación, aparecerá aquí para que consultes sus finanzas."
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.background },
  content: { flex: 1, paddingHorizontal: 20 },
  list: { flexGrow: 1, paddingBottom: 24, gap: 12 },
});
