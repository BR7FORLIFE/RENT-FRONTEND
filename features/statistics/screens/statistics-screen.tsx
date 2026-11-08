import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrincipalError } from "../../../components/error";
import { RentHeader } from "../../../components/header";
import { EmptyList, RentDescription } from "../../../components/info";
import SplashScreen, { SplashWaveBackground } from "../../../components/splash-screen";
import { Palette } from "../../../themes/themes";
import { GetAllProperties } from "../../property-registration/api";
import { PropertyStatistics } from "../components/property-statistics";

export function StatisticsScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["properties", "statistics"],
    queryFn: () => GetAllProperties(1, 50),
    staleTime: 60000 * 60,
  });

  if (isLoading) return <SplashScreen />;
  if (isError || !data) {
    return <PrincipalError error="No se han podido obtener las propiedades!" />;
  }

  const properties = data.data;
  const current = properties.find((p) => p.id === selectedId) ?? properties[0];

  return (
    <SafeAreaView style={styles.screen}>
      <SplashWaveBackground />
      <RentHeader sectionName="Estadísticas" />

      <RentDescription
        title="Estadísticas"
        description="Tu historial financiero y lo que el modelo predice para los próximos meses."
      />

      {!current ? (
        <EmptyList
          title="No tienes propiedades asociadas"
          description="Cuando tengas una asociación, aparecerán aquí sus estadísticas."
        />
      ) : (
        <>
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}
            >
              {properties.map((p) => {
                const active = p.id === current.id;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => setSelectedId(p.id)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
                      {p.propertyName}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.content}>
            <PropertyStatistics key={current.id} propertyId={current.id} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.background },
  content: { flex: 1 },
  chips: { paddingHorizontal: 20, paddingVertical: 10, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
    maxWidth: 220,
  },
  chipActive: { backgroundColor: Palette.accent, borderColor: Palette.accent },
  chipText: { fontSize: 13, fontWeight: "600", color: Palette.textSecondary },
  chipTextActive: { color: "#FFFFFF" },
});
