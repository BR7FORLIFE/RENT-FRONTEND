import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrincipalError } from "../../../../components/error";
import { RentHeader } from "../../../../components/header";
import
  {
    EmptyList,
    RentDescription,
    RentPropertyCard,
  } from "../../../../components/info";
import SplashScreen from "../../../../components/splash-screen";
import { PropertyMemberMe } from "../../api";

import ArrowRightIcon from "../../../../assets/icons/arrow-right.svg";

const PolicyButton = ({
  policyName,
  action,
}: {
  policyName: string;
  action: () => void;
}) => (
  <Pressable
    style={({ pressed }) => [
      policyButtonStyle.container,
      pressed && policyButtonStyle.pressed,
    ]}
    onPress={action}
  >
    <Text style={policyButtonStyle.text}>{policyName}</Text>

    <View style={policyButtonStyle.containerImage}>
      <ArrowRightIcon width={16} height={16} />
    </View>
  </Pressable>
);

const policyButtonStyle = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 50,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 14,

    backgroundColor: "#F8FAFC",

    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
  },

  pressed: {
    opacity: 0.7,
    backgroundColor: "#F1F5F9",
  },

  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  containerImage: {
    width: 28,
    height: 28,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#EFF6FF",
    borderRadius: 8,
  },
});

export function PropertyAssociationDetailsScreen() {
  const {
    id: propertyId,
    propertyName,
    propertyDescription,
  } = useLocalSearchParams<{
    id: string;
    propertyName: string;
    propertyDescription: string;
  }>();

  const {
    data: propertyMemberMe,
    isLoading: memberLoading,
    isError: errorLoading,
  } = useQuery({
    queryKey: ["associations", propertyId],
    queryFn: () => PropertyMemberMe(propertyId),
  });

  if (memberLoading) {
    return <SplashScreen />;
  }

  if (errorLoading) {
    return (
      <PrincipalError error="Error al obtener la informacion de propiedad y sus politicas" />
    );
  }

  if (!propertyMemberMe) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white",
        paddingHorizontal: 12,
      }}
    >
      <RentHeader sectionName="ASOCIACIONES" />
      <RentDescription
        title="Conoces tus acciones!"
        description={`En esta seccion podrás realizar diferentes acciones para la vivienda:  ${propertyName}!`}
      />

      {/**card de informacion de la vivienda */}
      <RentPropertyCard
        propertyName={propertyName}
        propertyDescription={propertyDescription}
      />

      {/**lista de politicas */}
      <View style={styles.listPolicies}>
        <Text style={styles.text}>Politicas Permitidas</Text>

        <FlatList
          data={propertyMemberMe.policies}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <PolicyButton
              policyName={item}
              action={() =>
                router.push({
                  pathname: "/property/property-associations/template",
                  params: { id: propertyId, policy: item },
                })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.propertyMemberList}
          ItemSeparatorComponent={() => <View style={styles.memberSeparator} />}
          ListEmptyComponent={
            <EmptyList
              title="Politicas para esta vivienda no encontrados!"
              description="Asegurate de tener roles privilegiados para obtener acciones en esta propiedad."
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listPolicies: {
    marginTop: 12,
    width: "100%",
  },

  text: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 11,
    lineHeight: 18,
    color: "#6B7280",
    maxWidth: "90%",
  },

  propertyMemberList: {
    paddingBottom: 20,
  },
  memberSeparator: {
    height: 10,
  },
});
