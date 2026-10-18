import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonForm } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import { RentHeader } from "../../../components/header";
import { EmptyList } from "../../../components/info";
import SplashScreen, {
  SplashWaveBackground,
} from "../../../components/splash-screen";
import {
  SegmentedTabs,
  type SegmentedTab,
} from "../../../components/ui/segmented-tabs";
import { Palette } from "../../../themes/themes";
import { PropertyMemberMe } from "../../property-registration/api";
import { SummarySection } from "../components/summary-section";
import { TransactionsSection } from "../components/transactions-section";
import { FINANCE_POLICY } from "../services/format";

type Sections = "SUMMARY" | "TRANSACTIONS" | "HISTORY";

const TABS: SegmentedTab<Sections>[] = [
  { label: "Resumen", value: "SUMMARY" },
  { label: "Movimientos", value: "TRANSACTIONS" },
  { label: "Historial", value: "HISTORY" },
];

export function PropertyFinanceScreen() {
  const { id: propertyId, propertyName } = useLocalSearchParams<{
    id: string;
    propertyName: string;
  }>();
  const [section, setSection] = useState<Sections>("SUMMARY");

  const { isLoading, isError, data } = useQuery({
    queryKey: ["propertyMemberMe", propertyId],
    queryFn: () => PropertyMemberMe(propertyId),
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError || !data) {
    return (
      <PrincipalError error="Error al obtener la información de esta propiedad!" />
    );
  }

  const canView = data.policies.includes(FINANCE_POLICY.view);
  const canCreate = data.policies.includes(FINANCE_POLICY.create);

  return (
    <SafeAreaView style={styles.screen}>
      <SplashWaveBackground />
      <RentHeader sectionName="Finanzas" />

      <View style={styles.title}>
        <Text style={styles.label}>Propiedad</Text>
        <Text style={styles.name} numberOfLines={1}>
          {propertyName}
        </Text>
      </View>

      {!canView ? (
        <EmptyList
          title="Sin acceso a las finanzas"
          description="Tu rol en esta propiedad no incluye consultar la información financiera."
        />
      ) : (
        <>
          <SegmentedTabs tabs={TABS} value={section} onChange={setSection} />

          <View style={styles.content}>
            {section === "SUMMARY" && <SummarySection propertyId={propertyId} />}
            {section === "TRANSACTIONS" && (
              <TransactionsSection propertyId={propertyId} />
            )}
            {section === "HISTORY" && (
              <TransactionsSection propertyId={propertyId} history />
            )}
          </View>

          {canCreate && (
            <View style={styles.footer}>
              <ButtonForm
                title="Registrar movimiento"
                action={() =>
                  router.push({
                    pathname: "/finance/form",
                    params: { propertyId },
                  })
                }
              />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.background },
  title: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, gap: 2 },
  label: { fontSize: 12, fontWeight: "500", color: Palette.textMuted },
  name: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: Palette.textPrimary,
  },
  content: { flex: 1 },
  footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
});
