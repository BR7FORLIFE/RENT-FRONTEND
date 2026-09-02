import { Image, Pressable, Text, View } from "react-native";
import EditIcon from "../assets/icons/edit.svg";
import HouseIcon from "../assets/icons/house.svg";
import { AnimatedOccupationTypeInfo } from "../features/property-registration/components/display";
import type { PropertyInfoCard as Props } from "../features/property-registration/types";
import { ButtonForm } from "./buttons/button";

export default function PropertyCard({
  propertyName,
  fmi,
  direction,
  typeProperty,
  occupationType,
  action,
  resources,
}: Props) {
  return (
    <View
      style={{
        width: "100%",
        height: 280,
        backgroundColor: "#ffffff",
        flexDirection: "column",
        borderRadius: 12,
        elevation: 4,
      }}
    >
      {/*Imagen del inmueble y estado actual de ocupacion del mismo */}
      <View style={{ position: "relative", height: "50%" }}>
        {resources?.[0]?.secureUrl ? (
          <Image
            resizeMode="cover"
            source={{ uri: resources[0].secureUrl }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 12,
            }}
          />
        ) : (
          <Image
            resizeMode="cover"
            source={require("../assets/icons/house.svg")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 12,
            }}
          />
        )}
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
          <AnimatedOccupationTypeInfo occupationType={occupationType} />
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
          style={{ fontSize: 12, opacity: 0.4, fontWeight: "400" }}
        >{`FMI: ${fmi}`}</Text>
        {/*la direccion parcial del inmueble NO completa */}

        <Text style={{ fontSize: 14, fontWeight: "600" }}>{propertyName}</Text>
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            gap: 6,
            alignItems: "center",
          }}
        >
          <HouseIcon width={14} height={14} style={{ opacity: 0.6 }} />
          <Text style={{ fontSize: 10, fontWeight: "600", opacity: 0.6 }}>
            {typeProperty} ◆ {direction}
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
            <ButtonForm
              title="Ver detalles"
              style={{ height: 42, fontSize: 9 }}
              action={action}
            />
          </View>

          <Pressable
            style={{
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
              borderRadius: 12,
              marginEnd: 14,
            }}
          >
            <EditIcon width={18} height={18} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
