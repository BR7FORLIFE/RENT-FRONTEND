import { StyleSheet, Text, View } from "react-native";
import { Palette } from "../../themes/themes";

// Avatar con iniciales del nombre (no hay foto de perfil en el backend).
export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.34 }]}>
        {initials || "?"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Palette.accentSoft,
    borderWidth: 1,
    borderColor: Palette.accentBorder,
  },

  initials: {
    fontWeight: "700",
    color: Palette.accentStrong,
  },
});
