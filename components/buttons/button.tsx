import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../../themes/themes";

export interface ButtonProps {
  title: string;
  action?: () => void;
  disabled?: boolean;
  isPending?: boolean;
}

function ButtonForm({ title, action, disabled, isPending }: ButtonProps) {
  return (
    <Pressable
      onPress={action}
      style={[
        styles.button,
        { backgroundColor: disabled ? "#9aacec" : Colors.PRIMARY },
      ]}
      disabled={disabled}
    >
      <Text style={styles.text}>
        {isPending ? <ActivityIndicator size="small" /> : title}
      </Text>
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

type FilterButtonProps = {
  title: string;
  active?: boolean;
  onPress: () => void;
};

export default function FilterButton({
  title,
  active = false,
  onPress,
}: FilterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[stylesFilter.button, active && stylesFilter.activeButton]}
    >
      <Text style={[stylesFilter.text, active && stylesFilter.activeText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const stylesFilter = StyleSheet.create({
  button: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D8DDE6",
    backgroundColor: "#fff",
  },

  activeButton: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },

  text: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },

  activeText: {
    color: "#fff",
  },
});

export { ButtonForm, FilterButton };
