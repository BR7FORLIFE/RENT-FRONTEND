import { Checkbox } from "expo-checkbox";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Palette } from "../../../../themes/themes";
import type { POLICY_STATEMENT, ROLES } from "../../constants";
import { formatEnumLabel } from "../../services/format";

//select para los roles y comportamiento de politicas
interface SelectRoleProps {
  name: ROLES;
  subtitle?: string;
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
  subtitle,
  isSelected,
  setSelectRole,
  setRolePressed,
}: SelectRoleProps) {
  
  const handleSelected = () => {
    setRolePressed({ role: name, isPressed: true })
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isSelected && styles.containerSelected,
        pressed && styles.containerPressed,
      ]}
      onPress={handleSelected}
    >
      <View style={styles.checkboxContainer}>
        <Checkbox
          style={styles.checkbox}
          color={Palette.accent}
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
      <View style={styles.textBlock}>
        <Text style={styles.text}>{formatEnumLabel(name)}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Text style={styles.chevron}>›</Text>
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
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  containerSelected: {
    backgroundColor: Palette.accentSoft,
    borderColor: Palette.accentBorder,
  },
  containerPressed: { backgroundColor: Palette.surfaceMuted },
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
    borderColor: Palette.textFaint,
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "500",
    color: Palette.textPrimary,
  },
  textBlock: {
    flex: 1,
    gap: 1,
  },
  subtitle: {
    fontSize: 11,
    color: Palette.textMuted,
  },
  chevron: {
    fontSize: 20,
    lineHeight: 20,
    color: Palette.textFaint,
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
          color={Palette.accent}
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
      <Text style={policyStyles.text}>{formatEnumLabel(policyName)}</Text>
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
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
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
    borderColor: Palette.textFaint,
  },
  text: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: Palette.textPrimary,
  },
});
