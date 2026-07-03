import { Pressable, StyleSheet } from "react-native";
import AIIcon from "../assets/icons/ai.svg";

type AIButtonProps = {
  onPress?: () => void;
};

export function AIButton({ onPress }: AIButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <AIIcon width={28} height={28} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 24,
    right: 20,

    width: 60,
    height: 60,
    borderRadius: 30,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,

    elevation: 10,
    zIndex: 10,
  },

  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
});
