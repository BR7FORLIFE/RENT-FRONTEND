import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ButtonForm } from "../../../../components/buttons/button";
import { PrincipalError } from "../../../../components/error";
import { RentHeader } from "../../../../components/header";
import { EmptyList, RentDescription } from "../../../../components/info";
import SplashScreen, {
  SplashWaveBackground,
} from "../../../../components/splash-screen";
import { Palette } from "../../../../themes/themes";
import { queryClient } from "../../../../core/configs/tanstackconfig";
import
  {
    ChangeStatusPropertyMember,
    GetPropertyMemberByIdAndPropertyId,
  } from "../../api";
import { MemberCard } from "../../components/property-members/property-member-card";
import
  {
    SelectPolicyOverride,
    SelectRole,
  } from "../../components/UI/select-role";
import
  {
    ROLES_AND_POLICIES,
    type POLICY_STATEMENT,
    type ROLES,
  } from "../../constants";
import { formatEnumLabel } from "../../services/format";

export function PropertyMemberRolesScreen() {
  // creamos una referencia persistente entre render para solamente insertar una sola vez
  //los roles y politicas
  const initialized = useRef(false);

  const { id, propertyId, propertyName } = useLocalSearchParams<{
    id: string;
    propertyId: string;
    propertyName: string;
  }>();

  //estado para aquellas politicas que estan desactivados para cierto rol (nivel de cliente o componente)
  const [selectOverridePolicy, setSelectOverridePolicy] = useState<
    {
      role: ROLES;
      policies: POLICY_STATEMENT[];
    }[]
  >([]);

  //estado para saber si un rol esta presionado para cambiar la UI y mostrar las politicas vinculadas a ese rol
  const [rolePressed, setRolePressed] = useState<{
    isPressed: boolean;
    role: ROLES;
  }>({ isPressed: false, role: "ADMINISTRADOR" });

  //estado para ir agregando roles y politicas para las previsualizaciones
  const [rolsAndPolicies, setRolsAndPolicies] = useState<{
    roles: string[];
    policies: string[];
  }>({
    roles: [],
    policies: [],
  });

  const { isLoading, isError, data } = useQuery({
    queryKey: ["propertyMember", id, propertyId],
    queryFn: () => GetPropertyMemberByIdAndPropertyId(id, propertyId),
  });

  //mutation para poder activar al miembro en cuestion
  const mutation = useMutation({
    mutationKey: ["propertyMember", id, propertyId],
    mutationFn: ({
      propertyId,
      status,
      propertyMemberId,
    }: {
      propertyId: string;
      status: "ACTIVE" | "DESACTIVE" | "IN_PROCESS";
      propertyMemberId: string;
    }) => ChangeStatusPropertyMember(propertyId, status, propertyMemberId),
  });

  const activeProperyMember = async () => {
    await mutation.mutateAsync({
      propertyId,
      status: "ACTIVE",
      propertyMemberId: id,
    });

    Toast.show({
      type: "info",
      text2: "Miembro activado exitosamente!",
    });

    //invalidamos cache para que refresque la informacion
    queryClient.invalidateQueries({
      queryKey: ["properties", propertyId],
    });

    //redirigimos a miembros
    router.push({
      pathname: "/property-member/[id]",
      params: { id: propertyId },
    });
  };

  //logica
  const handleMemberInfo = () => {};

  //esto permitira simplificar y obtener las politicas mas facilmente dependiendo del rol
  const selectedRoleData = ROLES_AND_POLICIES.find(
    (item) => item.role === rolePressed?.role,
  );
  //efectos

  //inicializamos el estado del miembro activo
  useEffect(() => {
    if (!data || initialized.current) return;

    setRolsAndPolicies({
      roles: [...data.roles],
      policies: [...data.policies],
    });

    initialized.current = true;
  }, [data]);

  //logica de renderizado
  if (isLoading) {
    return <SplashScreen />;
  }

  if (mutation.isPending) {
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

  return (
    <SafeAreaView style={styles.screen}>
      <SplashWaveBackground />
      <RentHeader sectionName="ROLES" />

      {/**titulo de la propiedad y previsualizacion de la tarjeta de miembro */}
      <View style={styles.memberSection}>
        <Text style={styles.propertyName} numberOfLines={1}>
          {propertyName}
        </Text>

        <MemberCard
          name={data.fullname}
          roles={rolsAndPolicies.roles}
          onInfoPress={handleMemberInfo}
        />
      </View>

      {/**seccion de roles y activacion de usuarios */}
      {data.status === "ACTIVE" && (
        <>
          <View style={styles.rolesContainer}>
            <View style={styles.rolesHeader}>
              {rolePressed.isPressed ? (
                <>
                  <Text style={styles.rolesTitle}>
                    {formatEnumLabel(rolePressed.role)}
                  </Text>
                  <Text style={styles.rolesSubtitle}>
                    Desmarca las políticas que no quieres otorgar con este rol.
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.rolesTitle}>Asignar roles</Text>
                  <Text style={styles.rolesSubtitle}>
                    {selectOverridePolicy.length === 0
                      ? "Marca los roles del miembro o toca uno para ver sus políticas."
                      : `${selectOverridePolicy.length} seleccionado${selectOverridePolicy.length === 1 ? "" : "s"} · toca un rol para ver sus políticas.`}
                  </Text>
                </>
              )}
            </View>

            {rolePressed?.isPressed ? (
              <FlatList
                key="policies-statements"
                data={selectedRoleData?.policies ?? []}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.rolesList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.roleItem}>
                    <SelectPolicyOverride
                      rolName={rolePressed.role}
                      policyName={item}
                      setOverridePolicy={setSelectOverridePolicy}
                    />
                  </View>
                )}
                ListEmptyComponent={
                  <EmptyList
                    title="No se han encontrado políticas"
                    description="Inténtalo de nuevo más tarde."
                  />
                }
                style={styles.list}
              />
            ) : (
              <FlatList
                key="roles-statements"
                data={ROLES_AND_POLICIES}
                keyExtractor={(item) => item.role}
                contentContainerStyle={styles.rolesList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.roleItem}>
                    <SelectRole
                      name={item.role}
                      subtitle={`${item.policies.length} políticas`}
                      isSelected={selectOverridePolicy.some(
                        (role) => role.role === item.role,
                      )}
                      setRolePressed={setRolePressed}
                      setSelectRole={setSelectOverridePolicy}
                    />
                  </View>
                )}
                ListEmptyComponent={
                  <EmptyList
                    title="No se han encontrado roles"
                    description="Inténtalo de nuevo más tarde."
                  />
                }
                style={styles.list}
              />
            )}
          </View>
          {rolePressed?.isPressed ? (
            <View style={styles.footer}>
              <ButtonForm
                title="Regresar"
                action={() =>
                  setRolePressed((prev) => ({ ...prev, isPressed: false }))
                }
              />
            </View>
          ) : (
            <View style={styles.footer}>
              <ButtonForm title="Asignar roles" />
            </View>
          )}
        </>
      )}

      {/**cuando el miembro tiene un estado distinto a active y esta en proceso para activarse */}
      {data.status === "IN_PROCESS" && (
        <>
          <View style={styles.activateSection}>
            <RentDescription
              title="Activa al miembro"
              description={`${data.fullname} aún no puede realizar acciones en la app. Actívalo para habilitar su acceso.`}
            />

            <View style={styles.footer}>
              <ButtonForm
                title="Activar miembro"
                action={activeProperyMember}
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  memberSection: {
    width: "100%",
    marginTop: 8,
    paddingHorizontal: 20,
    gap: 12,
  },

  propertyName: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: Palette.textMuted,
    marginTop: 12,
  },

  rolesContainer: {
    flex: 1,
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 20,
  },

  rolesHeader: {
    width: "100%",
    marginBottom: 12,
    justifyContent: "center",
  },

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

  list: {
    flex: 1,
  },

  rolesList: {
    width: "100%",
    paddingBottom: 20,
  },

  roleItem: {
    width: "100%",
  },

  footer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },

  activateSection: {
    marginTop: 16,
  },
});
