import { router, useLocalSearchParams } from "expo-router";
import
  {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//assets
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PrincipalError } from "../../../../components/error";
import SplashScreen from "../../../../components/splash-screen";
import { Colors } from "../../../../themes/themes";
import type { PaginationParams } from "../../../../types/global";
import { GetAllPropertyMembers, GetPropertyById } from "../../api";
import { PropertyMemberCard } from "../../components/property-members/property-member-card";
import type { StatusPropertyMemberType } from "../../schemas/property-registration.schema";

//images
import WaveBackground from "../../../../assets/backgrounds/wave-background.svg";
import CommunityIcon from "../../../../assets/icons/community.svg";
import FilterIcon from "../../../../assets/icons/filter.svg";

import { EmptyList } from "../../../../components/info";
import { SearchInput } from "../../../../components/inputs/input";

export function PropertyMemberDetailsScreen() {
  const { id: propertyId } = useLocalSearchParams<{ id: string }>();
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<
    PaginationParams & { status: StatusPropertyMemberType }
  >({
    limit: 10,
    page: 1,
    status: "ACTIVE",
  });

  const {
    data: propertyData,
    isLoading: propertyLoading,
    isError: propertyError,
  } = useQuery({
    // nos aprovechamos de la cache de details en la seccion de properties
    queryKey: ["properties", propertyId],
    queryFn: () => GetPropertyById(propertyId),
  });

  //este use query es para obtener los miembros de la propiedad
  const {
    data: propertyMemberData,
    isLoading: memberLoading,
    isError: memberError,
  } = useQuery({
    queryKey: ["propertyMembers", propertyId], // cache tanstack -> propertyId vinculado con sus miembros
    queryFn: () =>
      GetAllPropertyMembers(
        propertyId,
        pagination.page,
        pagination.limit,
        pagination.status,
      ),
  });

  if (propertyLoading && memberLoading) {
    return <SplashScreen />;
  }

  //cualquiera de los dos que falle hay que mandar el error o notificar a la aplicacion
  if (propertyError || memberError) {
    return <PrincipalError error="error al obtener los datos!" />; // hay que crear la interfaz de error XD
  }

  if (!propertyData || !propertyMemberData) {
    return null;
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", position: "relative" }}
    >
      <View style={{ position: "absolute", bottom: -40, right: 0, left: 0 }}>
        <WaveBackground />
      </View>

      <View style={styles.header}>
        {/**titulo y cantidad de miembros en la propiedad */}
        <Text style={{ fontSize: 20, fontWeight: "700" }}>RENT</Text>

        {/**cantidad de properties members */}
        <View style={styles.headerInfoMembers}>
          <CommunityIcon width={24} height={24} />
          <Text>{propertyMemberData.data.length.toString()}</Text>
        </View>

        <Text style={{ fontWeight: "700" }}>Miembros</Text>
      </View>

      {/**seccion de imagen y pequeña informacion relevante sobre ella (FIJO) */}
      <View style={styles.propertyInfo}>
        <View style={styles.propertyInfoImage}>
          {propertyData?.resources[0].secureUrl ? (
            <Image
              source={{ uri: propertyData.resources[0].secureUrl }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageText}>Imagen no disponible</Text>
            </View>
          )}
        </View>

        <View style={styles.propertyInfoDescription}>
          <Text
            style={styles.propertyName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {propertyData.propertyName}
          </Text>

          <View style={styles.identifierRow}>
            <Text style={styles.label}>ID</Text>
            <Text style={styles.value} numberOfLines={1}>
              {propertyData.id}
            </Text>
          </View>

          <View style={styles.identifierRow}>
            <Text style={styles.label}>FMI</Text>
            <Text style={styles.value} numberOfLines={1}>
              {propertyData.fmi}
            </Text>
          </View>

          <View style={styles.identifierRow}>
            <Text style={styles.label}>Tipo</Text>
            <Text style={styles.value} numberOfLines={1}>
              {propertyData.typeProperty}
            </Text>
          </View>
        </View>
      </View>

      {/**filtros y busquedas */}
      <View style={styles.searchContainer}>
        <View style={{ width: "80%", height: "50%" }}>
          <SearchInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar miembro.."
          />
        </View>
        <Pressable
          style={{
            width: "20%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FilterIcon width={24} height={24} />
        </Pressable>
      </View>

      {/**lista de properties members */}
      <View style={styles.propertyMemberContainer}>
        <View
          style={{
            width: "100%",
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: Colors.PRIMARY,
            borderStyle: "dashed",
          }}
        >
          <Text style={{ fontWeight: "700", color: Colors.NEUTRAL }}>
            Miembros en la propiedad
          </Text>
        </View>

        <FlatList
          data={propertyMemberData.data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PropertyMemberCard
              name={item.fullname}
              policies={item.policies}
              roles={item.roles}
              status={item.status}
              action={() =>
                router.push({
                  pathname: "/property-member/roles/[id]",
                  params: {
                    id: item.id,
                    propertyId,
                    propertyName: propertyData.propertyName,
                  },
                })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.propertyMemberList}
          ItemSeparatorComponent={() => <View style={styles.memberSeparator} />}
          ListEmptyComponent={
            <EmptyList
              title="Miembros nos encontrados"
              description="Asegurate de invitar o añadir miembros a tu propiedad!"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  //header
  header: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9EEF5",
  },

  headerInfoMembers: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "#2F91F9",
    backgroundColor: "#F4F9FF",
  },

  //search
  searchContainer: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    marginTop: 12,
  },

  //informacion de propiedad
  propertyInfo: {
    marginTop: 12,
    width: "100%",
    height: 130,
    flexDirection: "row",
    paddingHorizontal: 20,
  },

  propertyInfoImage: {
    width: "42%",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F2F4F7",
  },

  propertyImage: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  noImageText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#667085",
  },

  propertyInfoDescription: {
    flex: 1,
    justifyContent: "flex-start",
    paddingLeft: 16,
    gap: 7,
  },

  propertyName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 3,
  },

  identifierRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#667085",
    width: 25,
  },

  value: {
    flex: 1,
    fontSize: 11,
    color: "#475467",
  },

  //lista de property members
  propertyMemberBanner: {},

  propertyMemberContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 20,
  },

  propertyMemberList: {
    paddingBottom: 20,
  },

  memberSeparator: {
    height: 10,
  },
});
