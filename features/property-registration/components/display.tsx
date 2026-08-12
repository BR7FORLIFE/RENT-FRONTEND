import { Animated, Pressable, StyleSheet, Text } from "react-native";
import UndoIcon from "../../../assets/icons/undo.svg";
import { useTextAnimation } from "../../../hooks/hooks";
import type { PropertyOccupationType } from "../schemas/property-registration.schema";

export function AnimatedOccupationTypeInfo({
  occupationType,
}: {
  occupationType: PropertyOccupationType | undefined;
}) {
  const opacity = useTextAnimation();

  if (!occupationType) {
    return null;
  }

  return (
    <Animated.Text
      style={{
        opacity,
        color:
          occupationType === "OCUPADO"
            ? "red"
            : occupationType === "DESOCUPADO"
              ? "green"
              : "orange",
        fontWeight: "800",
        fontSize: 11,
      }}
    >
      {occupationType}
    </Animated.Text>
  );
}

export const BackButton = ({ action }: { action: () => void }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.backButton,
        pressed && styles.backButtonPressed,
      ]}
      onPress={action}
      hitSlop={8}
    >
      <UndoIcon width={21} height={21} />

      <Text style={styles.backText}>Regresar</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",

    alignItems: "center",

    gap: 6,

    paddingVertical: 8,
    paddingHorizontal: 10,

    borderRadius: 10,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 3,
  },

  backButtonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.75,
  },

  backText: {
    fontSize: 13,

    fontWeight: "600",

    color: "#374151",
  },
});
