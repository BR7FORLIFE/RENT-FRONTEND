import
  {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text
  } from "react-native";

interface ButtonStyle {
  height?: number;
  fontSize?: number;
}

export interface ButtonProps {
  title: string;
  action?: () => void;
  disabled?: boolean;
  isPending?: boolean;
  style?: ButtonStyle;
}

function ButtonForm({
  title,
  action,
  disabled = false,
  isPending = false,
  style,
}: ButtonProps) {
  return (
    <Pressable
      onPress={action}
      disabled={disabled || isPending}
      style={({ pressed }) => [
        styles.button,

        // Estado normal / disabled
        disabled ? styles.disabledButton : styles.enabledButton,

        // Feedback al presionar
        pressed && !disabled && styles.pressedButton,

        style,
      ]}
    >
      {isPending ? (
        <ActivityIndicator
          size="small"
          color={disabled ? "#64748B" : "#111827"}
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              fontSize: style?.fontSize ?? 14,
            },
            disabled && styles.disabledText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    minHeight: 46,

    paddingHorizontal: 16,

    borderRadius: 12,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,

    // Sombra
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,

    elevation: 3,
  },

  enabledButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
  },

  disabledButton: {
    backgroundColor: "#E5E7EB",
    borderColor: "#D1D5DB",

    shadowOpacity: 0,
    elevation: 0,
  },

  pressedButton: {
    transform: [{ scale: 0.98 }],
    opacity: 0.85,
  },

  text: {
    color: "#111827",
    fontWeight: "700",
  },

  disabledText: {
    color: "#9CA3AF",
  },
});

type FilterButtonProps = {
  title: string;
  active?: boolean;
  onPress: () => void;
};

function FilterButton({ title, active = false, onPress }: FilterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        stylesFilter.button,
        active && stylesFilter.activeButton,
        pressed && stylesFilter.pressedButton,
      ]}
    >
      <Text style={[stylesFilter.text, active && stylesFilter.activeText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const stylesFilter = StyleSheet.create({
  button: {
    height: 34,

    paddingHorizontal: 16,

    borderRadius: 999,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#D8DDE6",

    backgroundColor: "#FFFFFF",
  },

  activeButton: {
    backgroundColor: "#111827",
    borderColor: "#111827",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,

    elevation: 2,
  },

  pressedButton: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },

  text: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  activeText: {
    color: "#FFFFFF",
  },
});

export { ButtonForm, FilterButton };
