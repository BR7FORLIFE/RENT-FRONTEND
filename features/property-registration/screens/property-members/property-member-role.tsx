import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonForm } from "../../../../components/buttons/button";
import { PrincipalError } from "../../../../components/error";
import { RentHeader } from "../../../../components/header";
import { EmptyList } from "../../../../components/info";
import SplashScreen, {
  SplashWaveBackground,
} from "../../../../components/splash-screen";
import { GetPropertyMemberByIdAndPropertyId } from "../../api";
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

  if (isError) {
    return (
      <PrincipalError error="Error al obtener el miembro en la propiedad" />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        flexDirection: "column",
        paddingHorizontal: 12,
      }}
    >
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

      {/**seccion de roles */}
      <View style={styles.rolesContainer}>
        <View style={styles.rolesHeader}>
          {rolePressed.isPressed ? (
            <Text style={styles.rolesTitle}>
              POLITICAS PARA {rolePressed.role}
            </Text>
          ) : (
            <Text style={styles.rolesTitle}>ROLES</Text>
          )}
        </View>

        {rolePressed?.isPressed ? (
          <FlatList
            key="policies-statements"
            data={selectedRoleData?.policies ?? []}
            keyExtractor={(item) => item}
            numColumns={1}
            contentContainerStyle={styles.rolesList}
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
                title="No se han encontrado politicas en el sistema!"
                description="intente mas tarde.."
              />
            }
            style={{ height: "50%", marginBottom: 12 }}
          />
        ) : (
          <FlatList
            key="roles-statements"
            data={ROLES_AND_POLICIES}
            numColumns={2}
            keyExtractor={(item) => item.role}
            columnWrapperStyle={styles.rolesRow}
            contentContainerStyle={styles.rolesList}
            renderItem={({ item }) => (
              <View style={styles.roleItem}>
                <SelectRole
                  name={item.role}
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
                title="No se han encontrado roles en el sistema!"
                description="intente mas tarde.."
              />
            }
            style={{ height: "50%", marginBottom: 12 }}
          />
        )}
      </View>
      {rolePressed?.isPressed ? (
        <View style={{ width: "100%", paddingHorizontal: 20 }}>
          <ButtonForm
            title="Regresar"
            action={() =>
              setRolePressed((prev) => ({ ...prev, isPressed: false }))
            }
          />
        </View>
      ) : (
        <View style={{ width: "100%", paddingHorizontal: 20 }}>
          <ButtonForm title="Asignar Roles" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 58,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9EEF5",
  },

  brand: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#111827",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },

  memberSection: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 4,
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  propertyName: {
    width: "100%",
    paddingHorizontal: 4,
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    textAlign: "center",
    marginTop: 12,
  },

  rolesContainer: {
    width: "100%",
    marginTop: 18,
  },

  rolesHeader: {
    width: "100%",
    paddingBottom: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    borderStyle: "dashed",
    justifyContent: "center",
  },

  rolesTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    letterSpacing: 0.5,
  },

  rolesList: {
    width: "100%",
    paddingBottom: 20,
  },

  rolesRow: {
    justifyContent: "space-between",
    marginBottom: 10,
  },

  roleItem: {
    width: "100%",
    paddingHorizontal: 20,
  },
});
