import { Pressable, StyleSheet, Text } from "react-native";
import GoogleIcon from "../../../assets/icons/google-icon.svg";

export const GoogleAuthButton = ({
  action,
  disabled,
}: {
  action: () => void;
  disabled?: boolean;
}) => {
  return (
    <Pressable style={styles.container} onPress={action} disabled={disabled}>
      <GoogleIcon width={24} height={24} />
      <Text style={{ fontSize: 17 }}>Google</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderRadius: 7,
    width: "100%",
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
});
