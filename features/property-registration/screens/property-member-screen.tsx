import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchInput } from "../../../components/inputs/input";
//icon assets
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import FilterIcon from "../../../assets/icons/filter.svg";
import NotificationIcon from "../../../assets/icons/notification.svg";
import ScanIcon from "../../../assets/icons/scan.svg";
import SplashScreen from "../../../components/splash-screen";
import { GetAllProperties } from "../api";
import type { PropertyResponseApi } from "../api.response";
import { PropertyPreview } from "../components/property-members/property-preview";

export function PropertyMemberScreen() {
  const [property, setProperty] = useState<PropertyResponseApi[]>();

  //recuperamos las propiedades, gracias a tanstack nosotros podremos
  // obtener las propiedades ya cacheadas en memoria para mostrar sin necesidad de hacer
  // otra peticion

  const { data, isLoading, isError } = useQuery({
    queryKey: ["properties"],
    queryFn: GetAllProperties,
  });

  useEffect(() => {
    if (data) {
      setProperty(data.data);
    }
  }, [data]);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return null;
  }

  return (
    <SafeAreaView style={propertyMemberStyles.container}>
      {/* header y botones de notificacion y scan */}
      <View style={propertyMemberStyles.header}>
        <Text style={propertyMemberStyles.logo}>RENT</Text>

        <View style={propertyMemberStyles.headerActions}>
          <Pressable
            style={({ pressed }) => [
              propertyMemberStyles.iconButton,
              pressed && propertyMemberStyles.iconButtonPressed,
            ]}
          >
            <NotificationIcon width={23} height={23} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              propertyMemberStyles.iconButton,
              pressed && propertyMemberStyles.iconButtonPressed,
            ]}
          >
            <ScanIcon width={23} height={23} />
          </Pressable>
        </View>
      </View>

      {/* titulo y descripcion */}
      <View style={propertyMemberStyles.titleSection}>
        <Text style={propertyMemberStyles.title}>Invitar miembros</Text>

        <Text style={propertyMemberStyles.subtitle}>
          Gestiona las personas que tienen acceso a tus propiedades.
        </Text>
      </View>

      {/* search y filtros */}
      <View style={propertyMemberStyles.inputSection}>
        <View style={propertyMemberStyles.totalRow}>
          <Text style={propertyMemberStyles.totalLabel}>Miembros</Text>

          <View style={propertyMemberStyles.totalBadge}>
            <Text style={propertyMemberStyles.totalValue}>3</Text>
          </View>
        </View>

        <View style={propertyMemberStyles.filters}>
          <View style={propertyMemberStyles.search}>
            <SearchInput
              value=""
              onChangeText={() => null}
              placeholder="Buscar miembro..."
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              propertyMemberStyles.filterButton,
              pressed && propertyMemberStyles.filterButtonPressed,
            ]}
          >
            <FilterIcon width={21} height={21} />
          </Pressable>
        </View>
      </View>

      {/* lista de propiedades */}
      <View style={propertyMemberStyles.list}>
        <FlatList
          data={property}
          keyExtractor={(property) => property.fmi}
          renderItem={({ item }) => <PropertyPreview property={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={propertyMemberStyles.listContent}
          ItemSeparatorComponent={() => (
            <View style={propertyMemberStyles.separator} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const propertyMemberStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },

  logo: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#111827",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,

    justifyContent: "center",
    alignItems: "center",

    marginLeft: 8,

    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  iconButtonPressed: {
    backgroundColor: "#F1F5F9",
    transform: [{ scale: 0.96 }],
  },

  titleSection: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 18,
    color: "#6B7280",
    maxWidth: "90%",
  },

  inputSection: {
    width: "100%",
    paddingHorizontal: 20,
  },

  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  totalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },

  totalBadge: {
    minWidth: 24,
    height: 24,

    marginLeft: 7,
    paddingHorizontal: 7,

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#F1F5F9",
  },

  totalValue: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
  },

  filters: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },

  search: {
    flex: 1,
    marginRight: 8,
  },

  filterButton: {
    width: 46,
    height: 46,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 12,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  filterButtonPressed: {
    backgroundColor: "#F8FAFC",
    transform: [{ scale: 0.97 }],
  },

  list: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  listContent: {
    paddingHorizontal: 2,
    paddingTop: 16,
    paddingBottom: 24,
  },

  separator: {
    height: 12,
  },
});
