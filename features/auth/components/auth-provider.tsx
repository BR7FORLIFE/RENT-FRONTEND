import { StyleSheet, Text, View } from "react-native";
import GoogleIcon from "../../../assets/icons/google-icon.svg";
import { ButtonProps } from "../../../components/buttons/button";

export const GoogleAuthButton = ({ action, title, disabled }: ButtonProps) => {
  return (
    <View style={styles.container}>
      <GoogleIcon width={24} height={24} />
      <Text style={{ fontSize: 17 }}>Google</Text>
    </View>
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
