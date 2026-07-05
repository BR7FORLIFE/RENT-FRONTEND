import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PlusIcon from "../../../assets/icons/plus.svg";
import { AIButton } from "../../../components/ai";
import { FilterButton } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import Header from "../../../components/header";
import { SearchInput } from "../../../components/inputs/input";
import PropertyCard from "../../../components/property-card";
import SplashScreen from "../../../components/splash-screen";
import { Colors } from "../../../themes/themes";
import { GetAllProperties } from "../api";
import { normalizePropertyInformation } from "../services/property-registration.service";
import type { PropertyInfoCard } from "../types";

const FILTER_BUTTONS = ["Todas", "Disponibles", "Ocupadas"];

export default function PropertyScreen() {
  const [properties, setProperties] = useState<PropertyInfoCard[]>();
  const [text, setText] = useState("");
  const [Ai, setAt] = useState<boolean>(false);

  const { isLoading, data, isError } = useQuery({
    queryKey: ["properties"],
    queryFn: GetAllProperties,
    staleTime: 60000 * 60,
  });

  useEffect(() => {
    if (data) {
      setProperties(normalizePropertyInformation(data.data));
    }
  }, [data]);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return <PrincipalError error="error al obtener los datos..." />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#ffffff",
        gap: 24,
      }}
    >
      <AIButton />

      <AIButton onPress={() => setAt((prev) => !prev)} />
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Header />
        <View
          style={{
            flexDirection: "row",
            gap: 6,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => router.navigate("/home/property-registration")}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <PlusIcon width={22} height={22} />
          </Pressable>
        </View>
      </View>

      {/*seccion de titulo y text input y botones de paginaciones */}
      <View style={{ marginHorizontal: 16, flexDirection: "column", gap: 4 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            opacity: 0.5,
          }}
        >
          Mis Propiedades
        </Text>
        <SearchInput onChangeText={setText} value={text} />

        <FlatList
          horizontal
          data={FILTER_BUTTONS}
          renderItem={({ item }) => (
            <FilterButton title={item} onPress={() => null} />
          )}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          contentContainerStyle={{ marginTop: 12 }}
        />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <View style={{ width: "100%", height: 20 }} />
        <FlatList
          data={properties}
          keyExtractor={(property) => property.fmi}
          renderItem={({ item }) => (
            <PropertyCard
              propertyName={item.propertyName}
              fmi={item.fmi}
              direction={item.direction}
              occupationType={item.occupationType}
              typeProperty={item.typeProperty}
              action={() =>
                router.push({
                  pathname: "/home/property-registration/[id]",
                  params: { id: item.id as string },
                })
              }
            />
          )}
        />
        <View style={{ width: "100%", height: 80 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 24,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: Colors.NEUTRAL,

    marginRight: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,

    elevation: 6,
  },

  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
});
