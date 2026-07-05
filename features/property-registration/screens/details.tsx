import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../../components/header";
import { GetPropertyById } from "../api";
import type { PropertyType } from "../schemas/property-registration.schema";

import BathroomIcon from "../../../assets/icons/bathroom.svg";
import BedIcon from "../../../assets/icons/bed.svg";
import FavoriteIcon from "../../../assets/icons/favorite.svg";
import LocalIcon from "../../../assets/icons/local.svg";
import RuleIcon from "../../../assets/icons/rule.svg";
import ShareIcon from "../../../assets/icons/share.svg";
import UserIcon from "../../../assets/icons/user.svg";

import type { SvgProps } from "react-native-svg";
import { PrincipalError } from "../../../components/error";
import SplashScreen from "../../../components/splash-screen";
import { AnimatedOccupationTypeInfo } from "../components/display";

const PropertyDescription = ({
  Image,
  text,
}: {
  Image: React.FC<SvgProps>;
  text: string;
}) => {
  return (
    <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
      <Image width={25} height={25} />
      <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "500" }}>
        {text}
      </Text>
    </View>
  );
};

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState<PropertyType>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["properties", id],
    queryFn: () => GetPropertyById(id as string),
  });

  useEffect(() => {
    setProperty(data?.property);
  }, [data]);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return <PrincipalError error="error al obtener los datos..." />;
  }

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "column" }}>
      {/*Area del header de la seccion de detalles */}
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 8,
          marginBottom: 20,
        }}
      >
        <Header />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable>
            <ShareIcon width={24} height={24} />
          </Pressable>

          <Pressable>
            <FavoriteIcon width={24} height={24} />
          </Pressable>
        </View>
      </View>

      {/*seccion de imagen e informacion relevante */}
      <View
        style={{
          width: "100%",
          height: "30%",
          position: "relative",
          marginBottom: 20,
        }}
      >
        <Image
          resizeMode="cover"
          source={require("../../../assets/images/login-house-image.jpg")}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 12,
            opacity: 0.7,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: "black",
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "white", fontSize: 14, fontWeight: "700" }}>
            $ 700.000 /Mo
          </Text>
        </View>

        <View
          style={{
            position: "absolute",
            left: 140,
            bottom: 8,
            backgroundColor: "white",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 10,
          }}
        >
          <AnimatedOccupationTypeInfo
            occupationType={property?.propertyOccupationType.name}
          />
        </View>
      </View>

      {/* seccion de titulo direccion e ID */}
      <View
        style={{
          width: "100%",
          paddingLeft: 12,
          flexDirection: "row",
          marginBottom: 6,
        }}
      >
        <View style={{ width: "50%", flexDirection: "column", gap: 12 }}>
          <Text
            style={{
              fontSize: 18,
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {property?.propertyName}
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <LocalIcon width={24} height={24} />
            <Text
              style={{ fontWeight: "300" }}
            >{`${property?.direction.city} - ${property?.direction.department}`}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-end",
            width: "50%",
            paddingEnd: 12,
          }}
        >
          <UserIcon width={32} height={32} />

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.5,
            }}
          >
            <Text>Propiedad ID</Text>
            <Text style={{ textAlign: "center" }}>{property?.id}</Text>
          </View>
        </View>
      </View>

      {/*seccion de informacion como habitaciones, baños, dimensiones, etc */}
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          paddingVertical: 12,
          paddingHorizontal: 20,
          justifyContent: "center",
          gap: 8,
        }}
      >
        <PropertyDescription Image={BedIcon} text="3 Cuartos" />
        <PropertyDescription Image={BathroomIcon} text="2 Baños" />
        <PropertyDescription Image={RuleIcon} text="240 Metros" />
      </View>
    </SafeAreaView>
  );
}
