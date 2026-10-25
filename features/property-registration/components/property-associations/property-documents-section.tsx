import { useQuery } from "@tanstack/react-query";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { PrincipalError } from "../../../../components/error";
import { EmptyList, RentDescription } from "../../../../components/info";
import SplashScreen from "../../../../components/splash-screen";
import { Palette } from "../../../../themes/themes";
import { GetAllDocumentationByPropertyId } from "../../api";

export function PropertyDocumentsSection({
  propertyId,
}: {
  propertyId: string;
}) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["propertyDocumentation", propertyId],
    queryFn: () => GetAllDocumentationByPropertyId(propertyId, 1, 20),
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError || !data) {
    return (
      <PrincipalError error="Error al obtener los documentos de la propiedad!" />
    );
  }

  return (
    <View style={styles.container}>
      <RentDescription
        title="Documentos del inmueble"
        description="Visualiza los documentos y recursos asociados a esta propiedad!"
      />
      <FlatList
        data={data.data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.secureUrl ?? item.url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        ListEmptyComponent={
          <EmptyList
            title="Sin documentos"
            description="Esta propiedad aun no tiene documentos registrados."
          />
        }
      />
      {data.data.length > 0 && (
        <Text style={styles.count}>{data.data.length} documento(s)</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 20, gap: 10 },
  row: { gap: 10 },
  image: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surfaceMuted,
  },
  count: {
    textAlign: "center",
    paddingBottom: 12,
    fontSize: 12,
    color: Palette.textMuted,
  },
});
