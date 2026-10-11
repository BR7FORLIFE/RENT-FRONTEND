import { Pressable, StyleSheet } from "react-native";
import { Palette } from "../../themes/themes";

// Botón cuadrado con borde suave para iconos SVG (menú, notificaciones, escáner…).
export function IconButton({
  children,
  onPress,
  size = 42,
  tone = "default",
  accessibilityLabel,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  size?: number;
  tone?: "default" | "primary";
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        { width: size, height: size },
        tone === "primary" && styles.primary,
        pressed && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
  },

  primary: {
    backgroundColor: Palette.accent,
    borderColor: Palette.accent,
  },

  pressed: {
    backgroundColor: Palette.surfaceMuted,
    transform: [{ scale: 0.96 }],
  },
});
