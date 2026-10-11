import { StyleSheet, Text, View } from "react-native";
import { Palette } from "../themes/themes";

export function PrincipalError({ error }: { error: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>!</Text>
      </View>
      <Text style={styles.title}>Algo salió mal</Text>
      <Text style={styles.description}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 50,
    backgroundColor: Palette.background,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: Palette.dangerSoft,
  },

  icon: {
    fontSize: 24,
    fontWeight: "800",
    color: Palette.danger,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Palette.textPrimary,
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textMuted,
    textAlign: "center",
    maxWidth: 300,
  },
});
