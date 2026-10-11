import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchInput } from "../../../../components/inputs/input";
//icon assets
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import FilterIcon from "../../../../assets/icons/filter.svg";
import NotificationIcon from "../../../../assets/icons/notification.svg";
import ScanIcon from "../../../../assets/icons/scan.svg";
import { PrincipalError } from "../../../../components/error";
import { EmptyList, RentDescription } from "../../../../components/info";
import SplashScreen, {
  SplashWaveBackground,
} from "../../../../components/splash-screen";
import type { PaginationParams } from "../../../../types/global";
import { GetAllProperties } from "../../api";
import { IconButton } from "../../../../components/ui/icon-button";
import { PropertyPreview } from "../../components/property-members/property-preview";
import
  {
    InvitePropertyMemberCard,
    QrScan,
  } from "../../components/property-members/qr";
import { useBehaviorQr } from "../../stores/property.store";

export function PropertyMemberScreen() {
  const { isOpen } = useBehaviorQr(); // comportamiento de la card de qr
  const [openQrScan, setOpenQrScan] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  });
  //recuperamos las propiedades, gracias a tanstack nosotros podremos
  // obtener las propiedades ya cacheadas en memoria para mostrar sin necesidad de hacer
  // otra peticion
  const { data, isLoading, isError } = useQuery({
    queryKey: ["properties"],
    queryFn: () => GetAllProperties(pagination.page, pagination.limit),
  });

  const processScan = () => {
    setOpenQrScan(true);
  };

  if (openQrScan) {
    return <QrScan setOpenQrScan={setOpenQrScan}/>;
  }

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return <PrincipalError error="No se han podido obtener las propiedades!" />;
  }

  return (
    <SafeAreaView style={propertyMemberStyles.container}>
      <SplashWaveBackground bottom={-70} />
      {/* header y botones de notificacion y scan */}
      <View style={propertyMemberStyles.header}>
        <Text style={propertyMemberStyles.logo}>RENT</Text>

        <View style={propertyMemberStyles.headerActions}>
          <IconButton accessibilityLabel="Notificaciones">
            <NotificationIcon width={22} height={22} />
          </IconButton>

          <IconButton onPress={processScan} accessibilityLabel="Escanear QR">
            <ScanIcon width={22} height={22} />
          </IconButton>
        </View>
      </View>

      {/* titulo y descripcion */}
      <RentDescription
        title="Invitar miembros"
        description="Elige una propiedad para invitar personas con su código QR o por correo."
      />

      {/* search y filtros */}
      <View style={propertyMemberStyles.inputSection}>
        <View style={propertyMemberStyles.totalRow}>
          <Text style={propertyMemberStyles.totalLabel}>Propiedades</Text>

          <View style={propertyMemberStyles.totalBadge}>
            <Text style={propertyMemberStyles.totalValue}>
              {data?.data.length}
            </Text>
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

          <IconButton size={46} accessibilityLabel="Filtrar">
            <FilterIcon width={20} height={20} />
          </IconButton>
        </View>
      </View>

      {/* lista de propiedades */}
      <View style={propertyMemberStyles.list}>
        <FlatList
          data={data?.data}
          keyExtractor={(property) => property.fmi}
          renderItem={({ item }) => <PropertyPreview property={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={propertyMemberStyles.listContent}
          ItemSeparatorComponent={() => (
            <View style={propertyMemberStyles.separator} />
          )}
          ListEmptyComponent={
            <EmptyList
              title="No hay propiedades"
              description="asegurate de registrar una propiedad y vuelve a intentarlo!"
            />
          }
        />
      </View>

      {isOpen && <InvitePropertyMemberCard />}
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
    gap: 8,
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
    paddingTop: 8,
  },

  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },

  separator: {
    height: 12,
  },
});
