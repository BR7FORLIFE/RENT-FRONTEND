import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrincipalError } from "../../../../components/error";
import SplashScreen from "../../../../components/splash-screen";
import { GetPropertyMemberByIdAndPropertyId } from "../../api";

export function PropertyMemberRolesScreen() {
  const { id, propertyId } = useLocalSearchParams<{
    id: string;
    propertyId: string;
  }>();

  const { isLoading, isError, data } = useQuery({
    queryKey: ["propertyMember", id, propertyId],
    queryFn: () => GetPropertyMemberByIdAndPropertyId(id, propertyId),
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return (
      <PrincipalError error="Error al obtener el miembro en la propiedad" />
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.brand}>RENT</Text>
        <Text style={styles.title}>Roles</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 58,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9EEF5",
  },

  brand: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.5,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },
});
