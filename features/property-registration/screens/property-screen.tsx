import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PlusIcon from "../../../assets/icons/plus.svg";
import { AIButton } from "../../../components/ai";
import { FilterButton } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import { SearchInput } from "../../../components/inputs/input";
import PropertyCard from "../../../components/property-card";
import SplashScreen from "../../../components/splash-screen";
import { useBehaviorAside } from "../../../stores/auth-store";
import { Colors } from "../../../themes/themes";
import { GetAllProperties } from "../api";
import { normalizePropertyInformation } from "../services/property-registration.domain.service";
import type { PropertyInfoCard } from "../types";

const FILTER_BUTTONS = ["Todas", "Disponibles", "Ocupadas"];

const emptyItems = () => <Text>No data</Text>;

export default function PropertyScreen() {
  const { isOpen } = useBehaviorAside();
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
    <SafeAreaView style={styles.screen}>
      <AIButton onPress={() => setAt((prev) => !prev)} />

      <View style={styles.headerSection}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Mis Propiedades</Text>

          <Pressable
            onPress={() => router.navigate("/home/property-registration")}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <PlusIcon width={18} height={18} />
          </Pressable>
        </View>

        <SearchInput
          onChangeText={setText}
          value={text}
          placeholder="Buscar propiedad..."
        />

        <FlatList
          horizontal
          data={FILTER_BUTTONS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <FilterButton title={item} onPress={() => null} />
          )}
          ItemSeparatorComponent={() => <View style={styles.filterSeparator} />}
          contentContainerStyle={styles.filterList}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={emptyItems}
        />
      </View>

      <View style={styles.propertiesSection}>
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
          contentContainerStyle={styles.propertiesList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={styles.propertySeparator} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No tienes propiedades</Text>

              <Text style={styles.emptyDescription}>
                Agrega tu primera propiedad para comenzar a administrarla.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  headerSection: {
    width: "100%",

    paddingHorizontal: 20,
    paddingTop: 12,

    gap: 12,
  },

  titleRow: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 22,
    lineHeight: 28,

    fontWeight: "800",

    color: "#111827",
  },

  addButton: {
    width: 40,
    height: 40,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 20,

    backgroundColor: Colors.NEUTRAL,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    elevation: 4,
  },

  buttonPressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.8,
  },


  filterList: {
    paddingRight: 20,
    paddingVertical: 2,
  },

  filterSeparator: {
    width: 8,
  },


  propertiesSection: {
    flex: 1,

    width: "100%",

    marginTop: 8,

    paddingHorizontal: 20,
  },

  propertiesList: {
    flexGrow: 1,

    paddingTop: 12,
    paddingBottom: 32,
  },

  propertySeparator: {
    height: 12,
  },

  emptyContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 32,
    paddingTop: 80,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",

    textAlign: "center",

    color: "#111827",

    marginBottom: 6,
  },

  emptyDescription: {
    maxWidth: 300,

    fontSize: 14,
    lineHeight: 20,

    textAlign: "center",

    color: "#6B7280",
  },
});
