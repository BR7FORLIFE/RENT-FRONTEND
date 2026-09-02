import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import
  {
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ResourceImageType } from "../schemas/property-registration.schema";

//svgs
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PrincipalError } from "../../../components/error";
import SplashScreen from "../../../components/splash-screen";
import { GetPropertyById } from "../api";
import { BackButton } from "../components/display";

interface PropertyDescriptionProps {
  propertyName: string;
  description: string;
}

const PropertyDescription = ({
  propertyName,
  description,
}: PropertyDescriptionProps) => {
  return (
    <View style={propertyDescriptionStyles.descriptionContainer}>
      <Text style={propertyDescriptionStyles.propertyName}>{propertyName}</Text>

      <Text style={propertyDescriptionStyles.description}>{description}</Text>
    </View>
  );
};

const propertyDescriptionStyles = StyleSheet.create({
  descriptionContainer: {
    width: "100%",

    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  propertyName: {
    fontSize: 21,
    lineHeight: 28,

    fontWeight: "700",

    color: "#111827",

    marginBottom: 6,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,

    color: "#6B7280",
  },
});

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ImagesSlider = ({
  resources,
}: {
  resources: ResourceImageType[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const index = Math.round(offsetX / SCREEN_WIDTH);

    setCurrentIndex(index);
  };

  if (!resources.length) {
    return (
      <View style={imageSliderStyles.emptyContainer}>
        <Text style={imageSliderStyles.emptyText}>
          No hay imágenes disponibles
        </Text>
      </View>
    );
  }

  return (
    <View style={imageSliderStyles.container}>
      <FlatList
        data={resources}
        keyExtractor={(item, index) => item.id ?? `${item.url}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={imageSliderStyles.imageContainer}>
            {item.secureUrl ? (
              <Image
                source={{ uri: item.secureUrl }}
                resizeMode="cover"
                style={imageSliderStyles.image}
              />
            ) : (
              <View style={imageSliderStyles.imageFallback}>
                <Text style={imageSliderStyles.fallbackText}>
                  Imagen no disponible
                </Text>
              </View>
            )}
          </View>
        )}
      />

      {resources.length > 1 && (
        <View style={imageSliderStyles.indicators}>
          {resources.map((_, index) => (
            <View
              key={index}
              style={[
                imageSliderStyles.indicator,
                index === currentIndex && imageSliderStyles.activeIndicator,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const imageSliderStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: 280,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },

  imageContainer: {
    width: SCREEN_WIDTH,
    height: 280,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
  },

  fallbackText: {
    color: "#A0A0A0",
    fontSize: 14,
  },

  emptyContainer: {
    width: "100%",
    height: 280,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
  },

  emptyText: {
    color: "#A0A0A0",
    fontSize: 14,
  },

  indicators: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  indicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    opacity: 0.45,
  },

  activeIndicator: {
    width: 20,
    opacity: 1,
  },
});

interface PropertyRegistrationInfoProps {
  fmi: string;
  numberPredial: string;
  createAt: string;
  propertyId: string;
}

const PropertyRegistrationInfo = ({
  fmi,
  numberPredial,
  createAt,
  propertyId,
}: PropertyRegistrationInfoProps) => {
  return (
    <View style={propertyInfoStyles.container}>
      <View style={propertyInfoStyles.header}>
        <Text style={propertyInfoStyles.headerIcon}>#</Text>
        <Text style={propertyInfoStyles.headerTitle}>Datos de registro</Text>
      </View>

      <View style={propertyInfoStyles.info}>
        <Text style={propertyInfoStyles.label}>FMI</Text>

        <Text style={propertyInfoStyles.value} numberOfLines={1}>
          {fmi}
        </Text>
      </View>

      <View style={propertyInfoStyles.info}>
        <Text style={propertyInfoStyles.label}>N.° predial</Text>

        <Text style={propertyInfoStyles.value}>{numberPredial}</Text>
      </View>

      <View style={propertyInfoStyles.info}>
        <Text style={propertyInfoStyles.label}>Creada</Text>

        <Text style={propertyInfoStyles.value}>{formatDate(createAt)}</Text>
      </View>

      <View style={propertyInfoStyles.idContainer}>
        <Ionicons name="copy-outline" size={16} color="#9A9A9A" />

        <Text style={propertyInfoStyles.idText} numberOfLines={1}>
          ID: {propertyId}
        </Text>
      </View>
    </View>
  );
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

const propertyInfoStyles = StyleSheet.create({
  container: {
    width: "100%",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 18,

    paddingHorizontal: 20,
    paddingVertical: 20,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,

    elevation: 2,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,
  },

  headerIcon: {
    fontSize: 20,

    color: "#6B7280",

    marginRight: 8,
  },

  headerTitle: {
    fontSize: 18,
    lineHeight: 24,

    fontWeight: "700",

    color: "#111827",
  },

  info: {
    width: "100%",

    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  label: {
    fontSize: 15,
    lineHeight: 20,

    color: "#6B7280",
  },

  value: {
    flexShrink: 1,

    marginLeft: 20,

    fontSize: 15,
    lineHeight: 20,

    fontWeight: "600",

    color: "#111827",

    textAlign: "right",
  },

  idContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 18,
  },

  idText: {
    flex: 1,

    marginLeft: 7,

    fontSize: 13,
    lineHeight: 18,

    color: "#9CA3AF",
  },
});

interface EconomicPropertyInfoProps {
  monthlyRent: number;
  depositAmount: number;
  currency: string;
  utilitiesIncluded: boolean;
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

const EconomicPropertyInfo = ({
  monthlyRent,
  depositAmount,
  currency,
  utilitiesIncluded,
}: EconomicPropertyInfoProps) => {
  return (
    <View style={economicStyles.container}>
      <View style={economicStyles.header}>
        <Text style={economicStyles.icon}>▣</Text>

        <Text style={economicStyles.title}>Canon mensual</Text>
      </View>

      <View style={economicStyles.rentContainer}>
        <Text style={economicStyles.rent}>
          {formatCurrency(monthlyRent, currency)}
        </Text>

        <Text style={economicStyles.currency}>{currency} / mes</Text>
      </View>

      <View style={economicStyles.separator} />

      <View style={economicStyles.infoRow}>
        <View style={economicStyles.labelContainer}>
          <Text style={economicStyles.labelIcon}>♢</Text>

          <Text style={economicStyles.label}>Depósito</Text>
        </View>

        <Text style={economicStyles.value}>
          {formatCurrency(depositAmount, currency)}
        </Text>
      </View>

      <View style={economicStyles.infoRow}>
        <View style={economicStyles.labelContainer}>
          <Text style={economicStyles.labelIcon}>ϟ</Text>

          <Text style={economicStyles.label}>Servicios incluidos</Text>
        </View>

        <View
          style={[
            economicStyles.badge,
            utilitiesIncluded
              ? economicStyles.badgeIncluded
              : economicStyles.badgeNotIncluded,
          ]}
        >
          <Text style={economicStyles.badgeText}>
            {utilitiesIncluded ? "Sí" : "No"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const economicStyles = StyleSheet.create({
  container: {
    width: "100%",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 18,

    paddingHorizontal: 20,
    paddingVertical: 20,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,

    elevation: 2,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 4,
  },

  icon: {
    fontSize: 20,

    color: "#6B7280",

    marginRight: 9,
  },

  title: {
    fontSize: 18,
    lineHeight: 24,

    fontWeight: "600",

    color: "#111827",
  },

  rentContainer: {
    marginTop: 2,
  },

  rent: {
    fontSize: 34,
    lineHeight: 40,

    fontWeight: "800",

    color: "#111827",

    letterSpacing: -0.5,
  },

  currency: {
    marginTop: 1,

    fontSize: 15,
    lineHeight: 20,

    color: "#6B7280",
  },

  separator: {
    width: "100%",

    height: 1,

    backgroundColor: "#E5E7EB",

    marginVertical: 18,
  },

  infoRow: {
    minHeight: 42,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",

    flex: 1,
  },

  labelIcon: {
    width: 24,

    fontSize: 20,

    color: "#6B7280",

    marginRight: 5,
  },

  label: {
    fontSize: 15,
    lineHeight: 20,

    color: "#6B7280",
  },

  value: {
    fontSize: 15,
    lineHeight: 20,

    fontWeight: "600",

    color: "#111827",

    textAlign: "right",
  },

  badge: {
    minWidth: 52,
    height: 34,

    paddingHorizontal: 14,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 17,
  },

  badgeIncluded: {
    backgroundColor: "#DCFCE7",
  },

  badgeNotIncluded: {
    backgroundColor: "#F3F4F6",
  },

  badgeText: {
    fontSize: 14,

    fontWeight: "600",

    color: "#374151",
  },
});

interface StructureInfo {
  bedrooms: number;
  bathrooms: number;
  floors: number;
  parkingSpaces: number;
  area: number;
  lotArea: number;
  constructionYear: number | null;
}

interface PropertyStructureInfoProps {
  structureInfo: StructureInfo;
}

const PropertyStructureInfo = ({
  structureInfo,
}: PropertyStructureInfoProps) => {
  const characteristics = [
    {
      label: "Habitaciones",
      value: structureInfo.bedrooms.toString(),
      icon: "bed-outline" as const,
    },
    {
      label: "Baños",
      value: structureInfo.bathrooms.toString(),
      icon: "water-outline" as const,
    },
    {
      label: "Pisos",
      value: structureInfo.floors.toString(),
      icon: "layers-outline" as const,
    },
    {
      label: "Parqueaderos",
      value: structureInfo.parkingSpaces.toString(),
      icon: "car-outline" as const,
    },
    {
      label: "Área construida",
      value: `${structureInfo.area} m²`,
      icon: "resize-outline" as const,
    },
    {
      label: "Área de lote",
      value: `${structureInfo.lotArea} m²`,
      icon: "map-outline" as const,
    },
    {
      label: "Año de construcción",
      value: structureInfo.constructionYear
        ? structureInfo.constructionYear.toString()
        : "No especificado",
      icon: "calendar-outline" as const,
    },
  ];

  return (
    <View style={propertyStructureStyles.container}>
      <View style={propertyStructureStyles.header}>
        <View style={propertyStructureStyles.headerIconContainer}>
          <Ionicons name="business-outline" size={20} color="#6B7280" />
        </View>

        <Text style={propertyStructureStyles.title}>Características</Text>
      </View>

      <View style={propertyStructureStyles.grid}>
        {characteristics.map((item) => (
          <View
            key={item.label}
            style={propertyStructureStyles.characteristicCard}
          >
            <View style={propertyStructureStyles.iconContainer}>
              <Ionicons name={item.icon} size={21} color="#6B7280" />
            </View>

            <View style={propertyStructureStyles.textContainer}>
              <Text style={propertyStructureStyles.label} numberOfLines={1}>
                {item.label}
              </Text>

              <Text
                style={propertyStructureStyles.value}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const propertyStructureStyles = StyleSheet.create({
  container: {
    width: "100%",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 18,

    paddingHorizontal: 20,
    paddingVertical: 20,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,

    elevation: 2,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 18,
  },

  headerIconContainer: {
    width: 32,
    height: 32,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 8,
  },

  title: {
    fontSize: 18,
    lineHeight: 24,

    fontWeight: "700",

    color: "#111827",
  },

  grid: {
    width: "100%",

    flexDirection: "row",
    flexWrap: "wrap",

    gap: 12,
  },

  characteristicCard: {
    width: "45%",

    minHeight: 70,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,

    backgroundColor: "#F9FAFB",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 16,
  },

  iconContainer: {
    width: 32,
    height: 32,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 12,

    backgroundColor: "#F3F4F6",

    marginRight: 10,
  },

  textContainer: {
    flex: 1,

    justifyContent: "center",
  },

  label: {
    fontSize: 13,
    lineHeight: 18,

    color: "#6B7280",

    marginBottom: 2,
  },

  value: {
    fontSize: 17,
    lineHeight: 22,

    fontWeight: "700",

    color: "#111827",
  },
});

interface Direction {
  typeStreet: string;
  numberStreet: number;
  complement: string | null;
  neighborhood: string;
  city: string;
  department: string;
  latitute: number;
  longitud: number;
}

interface PropertyLocationInfoProps {
  direction: Direction;
}

const PropertyLocationInfo = ({ direction }: PropertyLocationInfoProps) => {
  const street = `${capitalize(direction.typeStreet)} ${direction.numberStreet}`;

  const rows = [
    {
      label: "Dirección",
      value: direction.complement
        ? `${street} · ${direction.complement}`
        : street,
    },
    {
      label: "Barrio",
      value: direction.neighborhood,
    },
    {
      label: "Ciudad",
      value: direction.city,
    },
    {
      label: "Departamento",
      value: direction.department,
    },
    ...(direction.complement
      ? [
          {
            label: "Complemento",
            value: direction.complement,
          },
        ]
      : []),
    {
      label: "Coordenadas",
      value: `${direction.latitute}, ${direction.longitud}`,
    },
  ];

  return (
    <View style={propertyLocationStyles.container}>
      <View style={propertyLocationStyles.header}>
        <View style={propertyLocationStyles.headerIconContainer}>
          <Ionicons name="location-outline" size={21} color="#6B7280" />
        </View>

        <Text style={propertyLocationStyles.title}>Ubicación</Text>
      </View>

      <View style={propertyLocationStyles.rows}>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={[
              propertyLocationStyles.infoRow,
              index === rows.length - 1 && propertyLocationStyles.lastRow,
            ]}
          >
            <Text style={propertyLocationStyles.label}>{row.label}</Text>

            <Text style={propertyLocationStyles.value} numberOfLines={2}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const capitalize = (value: string) => {
  return value.charAt(0) + value.slice(1).toLowerCase();
};

const propertyLocationStyles = StyleSheet.create({
  container: {
    width: "100%",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 18,

    paddingHorizontal: 20,
    paddingVertical: 20,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,

    elevation: 2,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,
  },

  headerIconContainer: {
    width: 32,
    height: 32,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 8,
  },

  title: {
    fontSize: 18,
    lineHeight: 24,

    fontWeight: "700",

    color: "#111827",
  },

  rows: {
    width: "100%",
  },

  infoRow: {
    width: "100%",

    minHeight: 56,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  label: {
    flex: 1,

    fontSize: 15,
    lineHeight: 20,

    color: "#6B7280",
  },

  value: {
    flex: 1,

    marginLeft: 20,

    fontSize: 15,
    lineHeight: 20,

    fontWeight: "600",

    color: "#111827",

    textAlign: "right",
  },
});

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();

  const {
    data: property,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["properties", id],
    queryFn: () => GetPropertyById(id as string),
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return <PrincipalError error="error al obtener los datos..." />;
  }

  if (!property) {
    return null;
  }

  const navigate = () => router.navigate("/home/(tabs)/property-registration");

  return (
    <SafeAreaView style={detailsStyle.screen}>
      <View style={headerStyles.header}>
        <Text style={headerStyles.logo}>RENT</Text>
        <View style={headerStyles.headerLine} />
        <BackButton action={navigate} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={detailsStyle.content}
      >
        {/* galeria de imagenes */}
        <ImagesSlider resources={property.resources} />

        {/**descripcion de la propiedad */}
        <PropertyDescription
          propertyName={property.propertyName}
          description={property.propertyDescription}
        />

        {/* informacion de la propiedad */}
        <PropertyRegistrationInfo
          propertyId={property.id}
          fmi={property.fmi}
          createAt={property.createAt}
          numberPredial={property.predialNumber}
        />

        {/* Información económica */}
        {property.economicInfoResponse && (
          <EconomicPropertyInfo
            currency={property.economicInfoResponse.currency}
            depositAmount={property.economicInfoResponse.depositAmount}
            monthlyRent={property.economicInfoResponse.monthlyRent}
            utilitiesIncluded={property.economicInfoResponse.utilitiesIncluded}
          />
        )}

        {/* Información estructural */}
        {property.structureInfoResponse && (
          <PropertyStructureInfo
            structureInfo={property.structureInfoResponse}
          />
        )}

        {/* direccion de la propiedad */}
        {property.direction && (
          <PropertyLocationInfo direction={property.direction} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const detailsStyle = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    width: "100%",

    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,

    gap: 16,
  },
});

const headerStyles = StyleSheet.create({
  header: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,

    gap: 12,
  },

  logo: {
    fontSize: 20,
    lineHeight: 26,

    fontWeight: "800",

    letterSpacing: 1.2,

    color: "#111827",
  },

  headerLine: {
    flex: 1,

    height: 1,

    backgroundColor: "#E5E7EB",
  },
});
