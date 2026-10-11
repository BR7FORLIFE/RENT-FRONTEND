import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonForm } from "../../../../components/buttons/button";
import { PrincipalError } from "../../../../components/error";
import { RentHeader } from "../../../../components/header";
import SplashScreen from "../../../../components/splash-screen";
import { InfoRow } from "../../../../components/ui/info-row";
import { StatusBadge } from "../../../../components/ui/status-badge";
import { Palette } from "../../../../themes/themes";
import { GetPublishedPropertyById } from "../../api";
import { BackButton } from "../../components/display";
import { formatEnumLabel } from "../../services/format";

export function FeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: property,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["publishedProperties", id],
    queryFn: () => GetPublishedPropertyById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError || !property) {
    return (
      <PrincipalError error="Este inmueble ya no está disponible o no pudo cargarse." />
    );
  }

  const structure = property.propertyStructureDescription;
  const { email, cellphone } = property.ownerContact;

  return (
    <SafeAreaView style={styles.screen}>
      <RentHeader sectionName="FEED" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <BackButton action={() => router.back()} />

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{property.propertyName}</Text>
          <StatusBadge
            label={formatEnumLabel(property.typeProperty)}
            tone="accent"
          />
        </View>

        {structure && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Características</Text>
            <InfoRow label="Habitaciones" value={String(structure.bedrooms)} />
            <InfoRow label="Baños" value={String(structure.bathrooms)} />
            <InfoRow label="Pisos" value={String(structure.floors)} />
            <InfoRow
              label="Parqueaderos"
              value={String(structure.parkingSpaces)}
            />
            <InfoRow label="Área construida" value={`${structure.area} m²`} />
            <InfoRow label="Área de lote" value={`${structure.lotArea} m²`} />
            {structure.constructionYear && (
              <InfoRow
                label="Año de construcción"
                value={String(structure.constructionYear)}
              />
            )}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contacto del dueño</Text>
          <InfoRow label="Correo" value={email} />
          <InfoRow label="Teléfono" value={cellphone} />

          <View style={styles.actions}>
            <ButtonForm
              title="Escribir"
              variant="primary"
              action={() => Linking.openURL(`mailto:${email}`)}
            />
            <ButtonForm
              title="Llamar"
              action={() => Linking.openURL(`tel:${cellphone}`)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 16,
  },

  titleBlock: {
    gap: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: Palette.textPrimary,
  },

  card: {
    padding: 16,
    gap: 12,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Palette.textPrimary,
  },

  actions: {
    gap: 8,
    marginTop: 4,
  },
});
