import { Animated } from "react-native";
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
