import { StyleSheet, Text, View } from "react-native";
import { type Tone, ToneStyles } from "../../themes/themes";

// Etiqueta de estado con punto de color. El tono comunica el estado.
export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: Tone;
}) {
  const colors = ToneStyles[tone];

  return (
    <View style={[styles.badge, { backgroundColor: colors.background }]}>
      <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      <Text style={[styles.text, { color: colors.text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  text: {
    fontSize: 11,
    fontWeight: "600",
  },
});
