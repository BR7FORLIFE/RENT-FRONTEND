import { StyleSheet, Text, View } from "react-native";
import { Palette } from "../../themes/themes";

// Par etiqueta / valor, para tarjetas de detalle.
export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

// Bloque con etiqueta arriba y valor destacado debajo (cifras y fechas).
export function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockLabel}>{label}</Text>
      <Text style={styles.blockValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  label: {
    fontSize: 12,
    color: Palette.textMuted,
  },

  value: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "600",
    color: Palette.textPrimary,
  },

  block: {
    flex: 1,
    gap: 4,
  },

  blockLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: Palette.textFaint,
  },

  blockValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.textPrimary,
  },
});
