import { StyleSheet, View } from "react-native";

interface Props {
  name: string;
  policies: string[];
  roles: string[];
  status: string;
}

export function PropertyMemberCard({ name, policies, roles, status }: Props) {
  return (
    <View style={styles.container}>
      {/**informacion de perfil de cada property member */}
      <View></View>

      {/**seccion de informacion de miembro (nombre, rols y policies) */}
      <View></View>

      {/**estado de dicho miembro (ACTIVE / INP_PROCCESS / DESACTIVE)*/}
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "2%",
  },
});
