import { Pressable, StyleSheet, Text } from "react-native";
import GoogleIcon from "../../../assets/icons/google-icon.svg";
import { Palette } from "../../../themes/themes";

export const GoogleAuthButton = ({
  action,
  disabled,
}: {
  action: () => void;
  disabled?: boolean;
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={action}
      disabled={disabled}
    >
      <GoogleIcon width={20} height={20} />
      <Text style={styles.text}>Continuar con Google</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    minHeight: 46,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    borderRadius: 12,
    backgroundColor: Palette.surface,
  },

  pressed: {
    backgroundColor: Palette.surfaceMuted,
    transform: [{ scale: 0.98 }],
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.textPrimary,
  },
});
