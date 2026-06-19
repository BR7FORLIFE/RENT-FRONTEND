import { Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../../themes/themes";

export interface ButtonProps {
  title: string;
  action?: () => void;
  disabled?: boolean;
}

function ButtonForm({ title, action, disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={action}
      style={[
        styles.button,
        { backgroundColor: disabled ? "#9aacec" : Colors.PRIMARY },
      ]}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
  },
});

export { ButtonForm };
