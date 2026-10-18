import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ButtonForm } from "../../../../components/buttons/button";
import { PrincipalError } from "../../../../components/error";
import { RentHeader } from "../../../../components/header";
import { EmptyList, RentDescription } from "../../../../components/info";
import { SegmentedTabs } from "../../../../components/ui/segmented-tabs";
import SplashScreen, {
  SplashWaveBackground,
} from "../../../../components/splash-screen";
import { queryClient } from "../../../../core/configs/tanstackconfig";
import { Palette } from "../../../../themes/themes";
import {
  AssignmentRoleToPropertyMember,
  ChangeStatusPropertyMember,
  GetPropertyMemberByIdAndPropertyId,
} from "../../api";
import { RolePolicies } from "../../components/property-members/role-policies";
import { MemberCard } from "../../components/property-members/property-member-card";
import { ASSIGNABLE_ROLE_GROUPS, type AssignableRole } from "../../constants";
import { formatEnumLabel } from "../../services/format";

// mensaje legible del backend (406 con { message }) o uno genérico
function errorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error) && error.response?.data?.message) {
    return String(error.response.data.message);
  }
  return fallback;
}

function RoleOption({
  role,
  selected,
  onToggle,
}: {
  role: AssignableRole;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [
        styles.option,
        selected && styles.optionSelected,
        pressed && styles.optionPressed,
      ]}
    >
      <View style={[styles.check, selected && styles.checkSelected]}>
        {selected && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={styles.optionText} numberOfLines={1}>
        {formatEnumLabel(role)}
      </Text>
    </Pressable>
  );
}

export function PropertyMemberRolesScreen() {
  const { id, propertyId, propertyName } = useLocalSearchParams<{
    id: string;
    propertyId: string;
    propertyName: string;
  }>();

  const [selected, setSelected] = useState<AssignableRole[]>([]);
  const [tab, setTab] = useState<"current" | "assign">("current");
  //rol abierto para ver/editar sus políticas
  const [openRole, setOpenRole] = useState<string | null>(null);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["propertyMember", id, propertyId],
    queryFn: () => GetPropertyMemberByIdAndPropertyId(id, propertyId),
  });

  const refreshMembers = () => {
    queryClient.invalidateQueries({ queryKey: ["propertyMember", id] });
    queryClient.invalidateQueries({
      queryKey: ["propertyMembers", propertyId],
    });
  };

  const assignMutation = useMutation({
    mutationFn: (roles: AssignableRole[]) =>
      AssignmentRoleToPropertyMember(id, propertyId, roles),
    onSuccess: () => {
      Toast.show({ type: "info", text2: "Roles asignados exitosamente!" });
      refreshMembers();
      router.back();
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text2: errorMessage(error, "No se pudieron asignar los roles."),
      });
      // el estado o los roles pudieron cambiar
      refreshMembers();
      setSelected([]);
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: "ACTIVE" | "DESACTIVE") =>
      ChangeStatusPropertyMember(propertyId, status, id),
    onSuccess: (_, status) => {
      Toast.show({
        type: "info",
        text2:
          status === "ACTIVE"
            ? "Miembro activado exitosamente!"
            : "Miembro desactivado exitosamente!",
      });
      setOpenRole(null);
      refreshMembers();
    },
    onError: (error) =>
      Toast.show({
        type: "error",
        text2: errorMessage(error, "No se pudo cambiar el estado del miembro."),
      }),
  });

  const handleToggleStatus = () => {
    if (data?.status === "DESACTIVE") {
      statusMutation.mutate("ACTIVE");
      return;
    }
    Alert.alert(
      "Desactivar miembro",
      `${data?.fullname} perderá el acceso a la propiedad. ¿Deseas continuar?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Desactivar",
          onPress: () => statusMutation.mutate("DESACTIVE"),
        },
      ],
    );
  };

  // el miembro no puede recibir roles que ya posee (el backend rechaza toda la petición)
  const sections = useMemo(
    () =>
      ASSIGNABLE_ROLE_GROUPS.map((group) => ({
        title: group.title,
        data: group.roles.filter((role) => !data?.roles.includes(role)),
      })).filter((group) => group.data.length > 0),
    [data],
  );

  const toggle = (role: AssignableRole) =>
    setSelected((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return (
      <PrincipalError error="Error al obtener el miembro en la propiedad" />
    );
  }

  if (!data) {
    return null;
  }

  const canAssign = data.status !== "DESACTIVE";

  return (
    <SafeAreaView style={styles.screen}>
      <SplashWaveBackground />
      <RentHeader sectionName="ROLES" />

      <View style={styles.memberSection}>
        <Text style={styles.propertyName} numberOfLines={1}>
          {propertyName}
        </Text>
        <MemberCard name={data.fullname} roles={data.roles} />
      </View>

      {canAssign && openRole ? (
        <RolePolicies
          memberId={id}
          propertyId={propertyId}
          role={openRole}
          onBack={() => setOpenRole(null)}
        />
      ) : canAssign ? (
        <>
          <View style={styles.tabs}>
            <SegmentedTabs
              tabs={[
                { label: "Roles actuales", value: "current" },
                { label: "Asignar roles", value: "assign" },
              ]}
              value={tab}
              onChange={setTab}
            />
          </View>

          {tab === "current" ? (
            <FlatList
              data={data.roles}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
              ListHeaderComponent={
                <Text style={styles.rolesSubtitle}>
                  Toca un rol para ver sus políticas y activarlas o
                  desactivarlas.
                </Text>
              }
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setOpenRole(item)}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <Text style={styles.optionText} numberOfLines={1}>
                    {formatEnumLabel(item)}
                  </Text>
                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <EmptyList
                  title="Sin roles"
                  description="Asigna un rol para otorgar permisos a este miembro."
                />
              }
            />
          ) : (
            <>
              <View style={styles.rolesHeader}>
                <Text style={styles.rolesTitle}>Asignar roles</Text>
                <Text style={styles.rolesSubtitle}>
                  {data.status === "IN_PROCESS"
                    ? "Al asignar roles el miembro se activará automáticamente."
                    : "Los roles seleccionados se sumarán a los que ya tiene."}
                </Text>
              </View>

              <SectionList
                sections={sections}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled={false}
                contentContainerStyle={styles.list}
                renderSectionHeader={({ section }) => (
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                )}
                renderItem={({ item }) => (
                  <RoleOption
                    role={item}
                    selected={selected.includes(item)}
                    onToggle={() => toggle(item)}
                  />
                )}
                ListEmptyComponent={
                  <Text style={styles.rolesSubtitle}>
                    Este miembro ya tiene todos los roles asignables.
                  </Text>
                }
              />

              <View style={styles.footer}>
                <ButtonForm
                  variant="primary"
                  title={
                    selected.length > 0
                      ? `Asignar ${selected.length} rol${selected.length === 1 ? "" : "es"}`
                      : "Asignar roles"
                  }
                  disabled={selected.length === 0}
                  isPending={assignMutation.isPending}
                  action={() => assignMutation.mutate(selected)}
                />
              </View>
            </>
          )}
        </>
      ) : (
        <View style={styles.inactive}>
          <RentDescription
            title="Miembro desactivado"
            description={`${data.fullname} no puede recibir roles mientras esté desactivado. Actívalo para continuar.`}
          />
        </View>
      )}

      {/**activar o desactivar al miembro (oculto mientras se editan las políticas de un rol) */}
      {!(canAssign && openRole) && (
        <View style={styles.statusFooter}>
          <ButtonForm
            title={
              data.status === "DESACTIVE"
                ? "Activar miembro"
                : "Desactivar miembro"
            }
            isPending={statusMutation.isPending}
            action={handleToggleStatus}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.background },

  memberSection: { marginTop: 8, paddingHorizontal: 20, gap: 12 },

  propertyName: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: Palette.textMuted,
  },

  rolesHeader: { marginTop: 20, paddingHorizontal: 20, marginBottom: 4 },
  rolesTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
    color: Palette.textPrimary,
  },
  rolesSubtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: Palette.textMuted,
  },

  list: { paddingHorizontal: 20, paddingBottom: 20, gap: 8 },

  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: Palette.textFaint,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 12,
  },
  optionSelected: {
    backgroundColor: Palette.accentSoft,
    borderColor: Palette.accentBorder,
  },
  optionPressed: { opacity: 0.8 },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: Palette.textPrimary,
  },

  check: {
    width: 21,
    height: 21,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Palette.textFaint,
  },
  checkSelected: {
    backgroundColor: Palette.accent,
    borderColor: Palette.accent,
  },
  checkMark: { fontSize: 13, fontWeight: "800", color: "#FFFFFF" },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },

  tabs: { marginTop: 16 },
  chevron: { fontSize: 20, lineHeight: 20, color: Palette.textFaint },

  statusFooter: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  inactive: { marginTop: 16 },
});
