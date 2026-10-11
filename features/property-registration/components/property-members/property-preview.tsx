import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import ImagePreview from "../../../../assets/icons/image-preview.svg";
import QrCode from "../../../../assets/icons/qr.svg";
import { IconButton } from "../../../../components/ui/icon-button";
import { Palette } from "../../../../themes/themes";
import type { PropertyResponseApi } from "../../api.response";
import { useBehaviorQr, useProperty } from "../../stores/property.store";

export function PropertyPreview({
  property,
}: {
  property: PropertyResponseApi;
}) {
  const { setOpen } = useBehaviorQr();
  const { set } = useProperty();
  const imageUrl = property.resources[0]?.secureUrl;

  const showQrInfo = () => {
    set(property);
    setOpen(true); // abrimos el panel para mostrar el qr
  };

  const propertyMemberDetails = () => {
    router.push({
      pathname: "/property-member/[id]",
      params: { id: property.id as string },
    });
  };

  return (
    <Pressable
      onPress={propertyMemberDetails}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.image}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.photo} />
        ) : (
          <ImagePreview width={24} height={24} />
        )}
      </View>

      <View style={styles.information}>
        <Text style={styles.name} numberOfLines={1}>
          {property.propertyName}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {property.typeProperty}
        </Text>
        <Text style={styles.fmi} numberOfLines={1}>
          FMI {property.fmi}
        </Text>
      </View>

      <IconButton onPress={showQrInfo} accessibilityLabel="Mostrar código QR">
        <QrCode width={22} height={22} />
      </IconButton>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 16,
  },

  pressed: {
    backgroundColor: Palette.surfaceMuted,
    transform: [{ scale: 0.99 }],
  },

  image: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: Palette.surfaceMuted,
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  information: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: Palette.textPrimary,
  },

  meta: {
    fontSize: 12,
    color: Palette.textSecondary,
  },

  fmi: {
    fontSize: 11,
    color: Palette.textFaint,
  },
});
