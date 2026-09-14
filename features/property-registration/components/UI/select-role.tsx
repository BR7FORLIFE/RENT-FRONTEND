import { Checkbox } from "expo-checkbox";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ROLES } from "../../constants";
import type { RoleState } from "../../screens/property-members/property-member-role";

//select para los roles y comportamiento de politicas
interface Props {
  name: ROLES;
  setSelectRole: React.Dispatch<React.SetStateAction<RoleState | undefined>>;
  setRolePressed: React.Dispatch<
    React.SetStateAction<
      | {
          isPressed: boolean;
          role: ROLES;
        }
      | undefined
    >
  >;
}

export function SelectRole({ name, setSelectRole, setRolePressed }: Props) {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  return (
    <Pressable
      style={styles.container}
      onPress={() => setRolePressed({ role: name, isPressed: true })}
    >
      <View style={styles.checkboxContainer}>
        <Checkbox
          style={styles.checkbox}
          color="#2563EB"
          onValueChange={(value) => {
            setSelectRole({ role: name, isSelected: value });
            setIsSelected(value);
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
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 12,
    gap: 10,
  },
  checkboxContainer: { justifyContent: "center", alignItems: "center" },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#2563EB",
    borderRadius: 5,
  },
  text: {
    fontSize: 10,
    fontWeight: "400",
    color: "#64748B",
    textAlign: "center",
  },
});

export function SelectRoleOverride() {}
