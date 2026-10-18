import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useMemo } from "react";
import { FlatList, StyleSheet, Switch, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { ButtonForm } from "../../../../components/buttons/button";
import { PrincipalError } from "../../../../components/error";
import { EmptyList } from "../../../../components/info";
import SplashScreen from "../../../../components/splash-screen";
import { queryClient } from "../../../../core/configs/tanstackconfig";
import { Palette } from "../../../../themes/themes";
import { GetMemberRolePolicies, ToggleMemberRolePolicy } from "../../api";
import type { MemberRolePoliciesResponseApi } from "../../api.response";
import { formatEnumLabel } from "../../services/format";

interface Props {
  memberId: string;
  propertyId: string;
  role: string;
  onBack: () => void;
}

// Políticas de un rol del miembro: cada switch crea/quita un override para ese miembro.
export function RolePolicies({ memberId, propertyId, role, onBack }: Props) {
  const queryKey = ["memberRolePolicies", memberId, propertyId, role];

  const { isLoading, isError, data } = useQuery({
    queryKey,
    queryFn: () => GetMemberRolePolicies(memberId, propertyId, role),
  });

  const mutation = useMutation({
    mutationFn: ({ policyId, active }: { policyId: string; active: boolean }) =>
      ToggleMemberRolePolicy(memberId, propertyId, role, policyId, active),
    onSuccess: (_, { policyId, active }) => {
      queryClient.setQueryData<MemberRolePoliciesResponseApi>(queryKey, (prev) =>
        prev && {
          ...prev,
          policies: prev.policies.map((p) =>
            p.id === policyId ? { ...p, active } : p,
          ),
        },
      );
      // las políticas efectivas del miembro cambiaron; otros roles pueden compartir la política
      queryClient.invalidateQueries({ queryKey: ["propertyMember", memberId] });
      queryClient.invalidateQueries({ queryKey: ["propertyMembers", propertyId] });
      queryClient.invalidateQueries({
        queryKey: ["memberRolePolicies", memberId, propertyId],
      });
    },
    onError: (error) =>
      Toast.show({
        type: "error",
        text2:
          isAxiosError(error) && error.response?.data?.message
            ? String(error.response.data.message)
            : "No se pudo actualizar la política.",
      }),
  });

  // el backend puede repetir una política dentro del mismo rol; la lista necesita ids únicos
  const policies = useMemo(
    () => [...new Map((data?.policies ?? []).map((p) => [p.id, p])).values()],
    [data],
  );

  if (isLoading) return <SplashScreen />;

  if (isError || !data) {
    return <PrincipalError error="No se pudieron obtener las políticas del rol" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{formatEnumLabel(role)}</Text>
        <Text style={styles.subtitle}>
          Desactiva las políticas que no quieres otorgar a este miembro. Si otro de sus roles
          comparte la política, también se verá afectado.
        </Text>
      </View>

      <FlatList
        data={policies}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.policyName}>{formatEnumLabel(item.policyName)}</Text>
              {!!item.description && (
                <Text style={styles.policyDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
            </View>
            <Switch
              value={item.active}
              disabled={mutation.isPending}
              trackColor={{ true: Palette.accent, false: Palette.borderStrong }}
              onValueChange={(active) =>
                mutation.mutate({ policyId: item.id, active })
              }
            />
          </View>
        )}
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
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 12,
  },
  rowText: { flex: 1, gap: 2 },
  policyName: { fontSize: 14, fontWeight: "500", color: Palette.textPrimary },
  policyDescription: { fontSize: 12, color: Palette.textMuted },
  footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
});
