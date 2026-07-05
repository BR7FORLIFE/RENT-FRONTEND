import { Animated, Text, View } from "react-native";
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

  const traslateOccupied =
    occupationType === "OCCUPIED"
      ? "ARRENDADO"
      : occupationType === "IN_PROCESS"
        ? "En proceso"
        : "Disponible";
  return (
    <Animated.Text
      style={{
        opacity,
        color:
          occupationType === "OCCUPIED"
            ? "red"
            : occupationType === "VACANT"
              ? "green"
              : "orange",
        fontWeight: "800",
        fontSize: 11,
      }}
    >
      {traslateOccupied}
    </Animated.Text>
  );
}