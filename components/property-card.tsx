import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import EditIcon from "../assets/icons/edit.svg";
import HouseIcon from "../assets/icons/house.svg";
import { AnimatedOccupationTypeInfo } from "../features/property-registration/components/display";
import type { PropertyInfoCard as Props } from "../features/property-registration/types";
import { Palette } from "../themes/themes";
import { ButtonForm } from "./buttons/button";

export default function PropertyCard({
  id,
  propertyName,
  fmi,
  direction,
  typeProperty,
  occupationType,
  action,
  resources,
}: Props) {
  const imageUrl = resources?.[0]?.secureUrl;

  return (
    <View style={styles.card}>
      {/*imagen del inmueble y estado actual de ocupacion */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            resizeMode="cover"
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        ) : (
          <View style={styles.placeholder}>
            <HouseIcon width={40} height={40} />
          </View>
        )}

        <View style={styles.occupation}>
          <AnimatedOccupationTypeInfo occupationType={occupationType} />
        </View>
      </View>

      {/*informacion del inmueble */}
      <View style={styles.content}>
        <Text style={styles.fmi}>{`FMI: ${fmi}`}</Text>

        <Text style={styles.name} numberOfLines={1}>
          {propertyName}
        </Text>

        <View style={styles.metaRow}>
          <HouseIcon width={14} height={14} />
          <Text style={styles.meta} numberOfLines={1}>
            {typeProperty} · {direction}
          </Text>
        </View>

        {/*acciones: ver detalles y editar */}
        <View style={styles.actions}>
          <View style={styles.detailsButton}>
            <ButtonForm
              title="Ver detalles"
              style={{ height: 42, fontSize: 13 }}
              action={action}
            />
          </View>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/property/property-registration/edit",
                params: { id: id as string },
              })
            }
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.editButtonPressed,
            ]}
          >
            <EditIcon width={18} height={18} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 16,
    overflow: "hidden",
  },

  imageContainer: {
    height: 140,
    backgroundColor: Palette.surfaceMuted,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  occupation: {
    position: "absolute",
    right: 12,
    top: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: Palette.surface,
    borderRadius: 12,
  },

  content: {
    padding: 14,
    gap: 6,
  },

  fmi: {
    fontSize: 11,
    color: Palette.textFaint,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Palette.textPrimary,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  meta: {
    flex: 1,
    fontSize: 12,
    color: Palette.textMuted,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },

  detailsButton: {
    flex: 1,
  },

  editButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 12,
    backgroundColor: Palette.surface,
  },

  editButtonPressed: {
    backgroundColor: Palette.surfaceMuted,
  },
});
