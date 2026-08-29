import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AIButton } from "../../../components/ai";
import { FilterButton } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import { SearchInput } from "../../../components/inputs/input";
import PropertyCard from "../../../components/property-card";
import SplashScreen from "../../../components/splash-screen";
import { useBehaviorAside } from "../../../stores/global-store";
import { Colors } from "../../../themes/themes";
import { GetAllProperties } from "../api";
import type { PropertyResponseApi } from "../api.response";
import type {
  PropertyOccupationType,
  TypePropertyType,
} from "../schemas/property-registration.schema";

import AsideIcon from "../../../assets/icons/bar-right.svg";
import PlusIcon from "../../../assets/icons/plus.svg";
import { ContentAside } from "../../../components/aside";
import { Me } from "../../../core/api/api-endpoints";
import { useMe } from "../../../stores/auth-store";

const FILTER_BUTTONS = ["Todas", "Disponibles", "Ocupadas"];

const emptyItems = () => <Text>No data</Text>;

export default function PropertyScreen() {
  const { isOpen, toggle } = useBehaviorAside();
  const { setUser } = useMe();
  const [properties, setProperties] = useState<PropertyResponseApi[]>();
  const [text, setText] = useState("");
  const [debounce, setDebounce] = useState();
  const [Ai, setAI] = useState<boolean>(false);

  //informacion de todas las propiedades
  const { isLoading, data, isError } = useQuery({
    queryKey: ["properties"],
    queryFn: GetAllProperties,
    staleTime: 60000 * 60,
  });

  //informacion del usuario cuando ya ha hecho login
  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: Me,
  });

  useEffect(() => {
    if (meData) {
      setUser(meData);
    }
  }, [meData, setUser]);

  //debounce para las paginaciones y busquedas cuando se agregue busquedas por nombre en el backend
  useEffect(() => {
    const debounce = setTimeout(() => {}, 1500);

    return () => clearInterval(debounce);
  }, [text]);

  useEffect(() => {
    if (data) {
      setProperties(data.data);
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
      <AIButton onPress={() => setAI((prev) => !prev)} />

      {isOpen && <ContentAside />}

      <View style={styles.headerSection}>
        <View style={styles.titleRow}>
          <View style={styles.asidebutton}>
            <Pressable onPress={toggle}>
              <AsideIcon width={27} height={27} />
            </Pressable>
            <Text style={styles.title}>Mis Propiedades</Text>
          </View>

          <Pressable
            onPress={() => router.navigate("/property/property-registration")}
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
              direction={item.direction?.city}
              occupationType={
                item.propertyOccupationType as PropertyOccupationType
              }
              typeProperty={item.typeProperty as TypePropertyType}
              resourcesImages={item.resourcesImages}
              action={() =>
                router.push({
                  pathname: "/property/property-registration/[id]",
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

  asidebutton: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
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
