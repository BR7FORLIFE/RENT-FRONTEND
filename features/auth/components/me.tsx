import { StyleSheet, Text, View } from "react-native";

import { Avatar } from "../../../components/ui/avatar";
import { Palette } from "../../../themes/themes";
import { useMe } from "../../../stores/auth-store";

export function MeCard() {
  const { user } = useMe();

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Avatar name={user.fullname} size={52} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {user.fullname}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user.email}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  info: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Palette.textPrimary,
  },

  email: {
    fontSize: 12,
    color: Palette.textMuted,
  },
});
