import { useEffect, useRef } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";
import EditIcon from "../assets/icons/edit.svg";
import HouseIcon from "../assets/icons/house.svg";
import { ButtonForm } from "./buttons/button";

interface Props {
  fmi: string;
  direction: string;
  city: string;
  occupationType: "OCCUPIED" | "VACANT" | "IN_PROCCESS";
  typeProperty:
    | "RESIDENTIAL"
    | "COMMERCIAL"
    | "INDUSTRIAL"
    | "LAND_OR_SOIL"
    | "URBAN"
    | "AGRARIAN"
    | "MIXED";
}

export default function PropertyCard({
  fmi,
  direction,
  typeProperty,
  city,
  occupationType,
}: Props) {
  const traslateOccupied =
    occupationType === "OCCUPIED"
      ? "ARRENDADO"
      : occupationType === "IN_PROCCESS"
        ? "En proceso"
        : "Disponible";

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View
      style={{
        width: "100%",
        height: 320,
        backgroundColor: "#ffffff",
        flexDirection: "column",
        borderRadius: 12,
        elevation: 4,
      }}
    >
      {/*Imagen del inmueble y estado actual de ocupacion del mismo */}
      <View style={{ position: "relative", height: "50%" }}>
        <Image
          resizeMode="cover"
          source={require("../assets/images/login-house-image.jpg")}
          style={{ width: "100%", height: "100%", borderRadius: 12 }}
        />
        <View
          style={{
            position: "absolute",
            right: 12,
            top: 12,
            backgroundColor: "white",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 12,
          }}
        >
          <Animated.Text
            style={{
              opacity,
              color:
                occupationType === "OCCUPIED"
                  ? "red"
                  : occupationType === "VACANT"
                    ? "green"
                    : "orange",
              fontWeight: "800",
              fontSize: 11,
            }}
          >
            • {traslateOccupied}
          </Animated.Text>
        </View>
      </View>

      {/*contenedor de la informacion de dicho inmueble */}
      <View
        style={{
          alignItems: "flex-start",
          flexDirection: "column",
          justifyContent: "space-around",
          paddingLeft: 12,
          paddingTop: 12,
          gap: 8,
        }}
      >
        {/*fmi de la propiedad */}
        <Text
          style={{ fontSize: 16, opacity: 0.4, fontWeight: "400" }}
        >{`FMI: ${fmi}`}</Text>
        {/*la direccion parcial del inmueble NO completa */}

        <Text style={{ fontSize: 20, fontWeight: "600" }}>{direction}</Text>
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            gap: 6,
            alignItems: "center",
          }}
        >
          <HouseIcon width={17} height={17} style={{ opacity: 0.6 }} />
          <Text style={{ fontSize: 12, fontWeight: "600", opacity: 0.6 }}>
            {typeProperty} ◆ {city}
          </Text>
        </View>
        {/*botones de ver detalles y editar */}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            gap: 6,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <View style={{ width: "75%" }}>
            <ButtonForm title="Ver detalles" />
          </View>

          <Pressable
            style={{
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
              borderRadius: 12,
            }}
          >
            <EditIcon width={24} height={24} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
