import { Text } from "react-native";

export function PrincipalError({ error }: { error: string }) {
  return <Text>{error}</Text>;
}
