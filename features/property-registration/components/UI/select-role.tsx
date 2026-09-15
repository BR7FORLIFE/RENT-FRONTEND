import { Checkbox } from "expo-checkbox";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { POLICY_STATEMENT, ROLES } from "../../constants";

//select para los roles y comportamiento de politicas
interface SelectRoleProps {
  name: ROLES;
  isSelected: boolean;
  setSelectRole: React.Dispatch<
    React.SetStateAction<
      {
        role: ROLES;
        policies: POLICY_STATEMENT[];
      }[]
    >
  >;
  setRolePressed: React.Dispatch<
    React.SetStateAction<{
      isPressed: boolean;
      role: ROLES;
    }>
  >;
}

export function SelectRole({
  name,
  isSelected,
  setSelectRole,
  setRolePressed,
}: SelectRoleProps) {
  
  const handleSelected = () => {
    setRolePressed({ role: name, isPressed: true })
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handleSelected}
    >
      <View style={styles.checkboxContainer}>
        <Checkbox
          style={styles.checkbox}
          color="#2563EB"
          onValueChange={(value) => {
            setSelectRole((prev) => {
              //si el valor del select esta desactivado entonces lo que hacemos es desaparecerlo
              //del estado
              if (!value) {
                return prev.filter((item) => item.role !== name);
              }

              //aca verificamos si existe el rol entonces retornamos el valor del estado sin ningun cambio
              const existsRole = prev.some((item) => item.role === name);

              if (existsRole) {
                return prev;
              }

              //en caso tal no exista lo que hacemos es resetear el rol y sus politicas vacias
              return [
                ...prev,
                {
                  role: name,
                  policies: [],
                },
              ];
            });
          }}
          value={isSelected}
        />
      </View>
      <Text style={styles.text}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  containerSelected: { backgroundColor: "#EFF6FF", borderColor: "#93C5FD" },
  checkboxContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
  },
  text: {
    flex: 1,
    fontSize: 8,
    lineHeight: 18,
    fontWeight: "500",
    color: "#374151",
  },
});

interface SelectPolicyProps {
  rolName: ROLES;
  policyName: POLICY_STATEMENT;
  setOverridePolicy: React.Dispatch<
    React.SetStateAction<
      {
        role: ROLES;
        policies: POLICY_STATEMENT[];
      }[]
    >
  >;
}

export function SelectPolicyOverride({
  rolName,
  policyName,
  setOverridePolicy,
}: SelectPolicyProps) {
  const [isSelected, setIsSelected] = useState<boolean>(true);

  return (
    <View style={policyStyles.container}>
      <View style={policyStyles.checkboxContainer}>
        <Checkbox
          style={policyStyles.checkbox}
          color="#2563EB"
          onValueChange={(value) => {
            setOverridePolicy((prev) => {
              //buscamos el rol para ver si existe
              const role = prev.find((item) => item.role === rolName);

              //si el estado de la politica (select actual) esta activo
              if (value) {
                if (!role) {
                  //si no encuentra el rol en el estado entonces devolvemos el valor del estado
                  return prev;
                }

                return prev
                  .map((item) =>
                    item.role === rolName
                      ? {
                          ...item,
                          policies: item.policies.filter(
                            (policy) => policy !== policyName,
                          ),
                        }
                      : item,
                  )
                  .filter((item) => item.policies.length > 0);
              }

              if (!role) {
                return [
                  ...prev,
                  {
                    role: rolName,
                    policies: [policyName],
                  },
                ];
              }

              const policyExists = role.policies.includes(policyName);

              if (policyExists) {
                return prev;
              }

              return prev.map((item) =>
                item.role === rolName
                  ? {
                      ...item,
                      policies: [...item.policies, policyName],
                    }
                  : item,
              );
            });
            setIsSelected(value);
          }}
          value={isSelected}
        />
      </View>
      <Text style={policyStyles.text}>{policyName}</Text>
    </View>
  );
}

const policyStyles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  containerSelected: { backgroundColor: "#EFF6FF", borderColor: "#93C5FD" },
  checkboxContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
  },
  text: {
    flex: 1,
    fontSize: 8,
    lineHeight: 18,
    fontWeight: "500",
    color: "#374151",
  },
});
