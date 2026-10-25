import { useQuery } from "@tanstack/react-query";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ButtonForm } from "../../../../components/buttons/button";
import { PrincipalError } from "../../../../components/error";
import { EmptyList } from "../../../../components/info";
import SplashScreen from "../../../../components/splash-screen";
import { Palette } from "../../../../themes/themes";
import { GetRolePolicies } from "../../api";
import { hasPolicyScreen } from "../../constants";
import { formatEnumLabel } from "../../services/format";

interface Props {
  propertyId: string;
  role: string;
  onBack: () => void;
}

// Solo lectura: políticas que incluye un rol, para decidir si asignarlo.
export function RolePoliciesPreview({ propertyId, role, onBack }: Props) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ["rolePolicies", propertyId, role],
    queryFn: () => GetRolePolicies(propertyId, role),
    staleTime: 60000 * 60,
  });

  if (isLoading) return <SplashScreen />;

  if (isError || !data) {
    return <PrincipalError error="No se pudieron obtener las políticas del rol" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{formatEnumLabel(role)}</Text>
        <Text style={styles.subtitle}>
          Políticas que incluye este rol ({data.policies.length}). Podrás
          desactivar las que no quieras después de asignarlo.
        </Text>
      </View>

      <FlatList
        data={data.policies}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const hasScreen = hasPolicyScreen(item.policyName);

          return (
            <View style={[styles.row, !hasScreen && styles.rowDisabled]}>
              <Text style={styles.policyName}>{formatEnumLabel(item.policyName)}</Text>
              {!!item.description && (
                <Text style={styles.policyDescription}>{item.description}</Text>
              )}
              {!hasScreen && (
                <Text style={styles.noScreen}>Sin pantalla disponible aún</Text>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyList
            title="Sin políticas"
            description="Este rol aún no tiene políticas asociadas."
          />
        }
      />

      <View style={styles.footer}>
        <ButtonForm title="Regresar" action={onBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginTop: 20, paddingHorizontal: 20, marginBottom: 8 },
  title: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
    color: Palette.textPrimary,
  },
  subtitle: { marginTop: 3, fontSize: 12, lineHeight: 17, color: Palette.textMuted },
  list: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 20, gap: 8 },
  row: {
    gap: 2,
    padding: 14,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 12,
  },
  rowDisabled: { opacity: 0.45, backgroundColor: Palette.surfaceMuted },
  noScreen: { fontSize: 11, fontStyle: "italic", color: Palette.textFaint },
  policyName: { fontSize: 14, fontWeight: "500", color: Palette.textPrimary },
  policyDescription: { fontSize: 12, color: Palette.textMuted },
  footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
});
