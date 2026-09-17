import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
import { PrincipalError } from "../../../../components/error";
import SplashScreen, {
  SplashWaveBackground,
} from "../../../../components/splash-screen";
import { GetAllPropertiesByPropertyMember } from "../../api";
import type { StatusPropertyMemberType } from "../../schemas/property-registration.schema";

//iconos
import ArrowRightIcon from "../../../../assets/icons/arrow-right.svg";
import HomeIcon from "../../../../assets/icons/home.svg";

import { RentHeader } from "../../../../components/header";
import { EmptyList } from "../../../../components/info";
import { NumberInput } from "../../../../components/inputs/input";

interface PropertyAssociationPagination {
  propertyMemberStatus: StatusPropertyMemberType;
  page: number;
  limit: number;
}

export function AssociationProperty({
  name,
  description,
  action,
}: {
  name: string;
  description: string;
  action: () => void;
}) {
  return (
    <View style={associationsStyles.associationCard}>
      <View style={associationsStyles.iconContainer}>
        <HomeIcon width={23} height={23} />
      </View>

      <View style={associationsStyles.infoContainer}>
        <Text style={associationsStyles.name} numberOfLines={1}>
          {name}
        </Text>

        <Text style={associationsStyles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>

      <Pressable style={associationsStyles.arrowButton} onPress={action}>
        <ArrowRightIcon width={20} height={20} />
      </Pressable>
    </View>
  );
}

const associationsStyles = StyleSheet.create({
  associationCard: {
    width: "100%",
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },

  infoContainer: {
    flex: 1,
    gap: 4,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  description: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 17,
    color: "#64748B",
  },

  arrowButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
});

export function PropertyAssociationScreen() {
  const [debounce, setDebounce] = useState<PropertyAssociationPagination>({
    propertyMemberStatus: "ACTIVE",
    limit: 10,
    page: 1,
  });
  const [pagination, setPagination] = useState<PropertyAssociationPagination>({
    propertyMemberStatus: "ACTIVE",
    limit: 10,
    page: 1,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "associations",
      debounce.propertyMemberStatus,
      debounce.page,
      debounce.limit,
    ],
    queryFn: () =>
      GetAllPropertiesByPropertyMember(
        debounce.propertyMemberStatus,
        debounce.page,
        debounce.limit,
      ),
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(pagination);
    }, 1000);

    return () => clearInterval(timeout);
  }, [pagination]);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return (
      <PrincipalError error="Error al tener todas las propiedades asociadas!" />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <RentHeader sectionName="ASOCIACIONES" />
      <SplashWaveBackground />

      <View style={styles.headerPicker}>
        <View>
          <Image
            source={require("../../../../assets/images/logo-recortado.png")}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
        <Text style={styles.info}>
          Elige y visualiza las asociaciones que posees dentro de las
          propiedades!
        </Text>

        <View style={styles.paginationContainer}>
          <View style={styles.pickerContainer}>
            <Text
              style={{ fontSize: 8, fontWeight: "400", alignSelf: "center" }}
            >
              Estado
            </Text>
            <Picker
              style={styles.picker}
              selectedValue={pagination.propertyMemberStatus}
              onValueChange={(itemValue, _) =>
                setPagination((prev) => ({
                  ...prev,
                  propertyMemberStatus: itemValue,
                }))
              }
            >
              <Picker.Item label="EN PROCESO" value="IN_PROCESS" />
              <Picker.Item label="ACTIVOS" value="ACTIVE" />
            </Picker>
          </View>

          <View style={styles.numberInputContainer}>
            <Text style={{ fontSize: 8, fontWeight: "400" }}>Página</Text>
            <NumberInput
              field="page"
              saveData={setPagination}
              initValue={debounce.page}
            />
          </View>

          <View style={styles.numberInputContainer}>
            <Text style={{ fontSize: 8, fontWeight: "400" }}>Límite</Text>
            <NumberInput
              field="limit"
              saveData={setPagination}
              initValue={debounce.limit}
            />
          </View>
        </View>
      </View>

      <View />

      <View style={styles.asociationProperties}>
        <FlatList
          data={data.data}
          renderItem={({ item }) => (
            <AssociationProperty
              name={item.propertyName}
              description={item.propertyDescription}
              action={() => null}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.associationList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyList
              title="No tienes propiedades asociadas"
              description="Cuando tengas una asociación, aparecerá aquí para que puedas consultarla
        y gestionarla."
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    gap: 18,
    flexDirection: "column",
    alignItems: "center",
  },

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

  logo: {
    width: 70,
    height: 70,
    objectFit: "cover",
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

  headerPicker: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    overflow: "hidden",
    padding: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  paginationContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingBottom: 12,
  },

  pickerContainer: {
    flex: 1,
    height: 70,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },

  picker: {
    width: "100%",
    height: "100%",
    color: "#111827",
  },

  numberInputContainer: {
    width: 70,
    height: 56,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },

  info: {
    textAlign: "center",
    marginBottom: 15,
  },

  asociationProperties: {
    width: "100%",
    flex: 1,
    paddingHorizontal: 4,
  },

  associationList: {
    width: "100%",
    paddingHorizontal: 2,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 12,
  },
});
