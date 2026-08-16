import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import ImagePreview from "../../../../assets/icons/image-preview.svg";
import QrCode from "../../../../assets/icons/qr.svg";
import type { PropertyResponseApi } from "../../api.response";
import { useBehaviorQr, useProperty } from "../../stores/property.store";

export function PropertyPreview({
  property,
}: {
  property: PropertyResponseApi;
}) {
  const { setOpen } = useBehaviorQr();
  const { set } = useProperty();

  const showQrInfo = () => {
    set(property); // establecemos la propiedad al store
    setOpen(true); // abrimos el panel para mostrar el qr
  };

  return (
    <View style={propertyPreview.container}>
      {/**imagen de previsualizacion de la propiedad */}
      <View style={propertyPreview.image}>
        {property.resourcesImages[0].secureUrl ? (
          <Image
            source={{ uri: property.resourcesImages[0].secureUrl! }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <ImagePreview width={24} height={24} />
        )}
      </View>

      {/**seccion de FMI, nombre, y tipo de propiedad  */}
      <View style={propertyPreview.information}>
        <View>
          <Text style={{ fontSize: 10, color: "#000000d3" }}>
            FMI {property.fmi}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "600",
              letterSpacing: 1.2,
              lineHeight: 25,
            }}
          >
            {property.propertyName}
          </Text>
        </View>

        <View>
          <Text style={{ fontSize: 10, color: "#000000d3" }}>
            {property.typeProperty}
          </Text>
        </View>
      </View>

      {/**seccion de imagen de qr */}
      <View style={propertyPreview.qr}>
        <Pressable
          onPress={showQrInfo}
          style={({ pressed }) => [
            propertyPreview.button,

            pressed && propertyPreview.buttonPressed,
          ]}
        >
          <QrCode width={24} height={24} />
        </Pressable>
      </View>
    </View>
  );
}

const propertyPreview = StyleSheet.create({
  container: {
    width: "100%",
    height: 40,
    minHeight: 60,
    flexDirection: "row",
    borderLeftWidth: 1,
    borderLeftColor: "#00000047",
  },

  image: {
    minWidth: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  information: {
    flex: 1,
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingLeft: 6,
  },

  qr: {
    minWidth: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    minHeight: "100%",
    paddingHorizontal: 18,

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#ffffff",
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
