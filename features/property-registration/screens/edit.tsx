import { Picker } from "@react-native-picker/picker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ButtonForm } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import { Input } from "../../../components/inputs/input";
import SplashScreen from "../../../components/splash-screen";
import { uploadImage } from "../../../core/configs/cloudinaryconfig";
import { Palette, Radius, Spacing } from "../../../themes/themes";
import { EditingProperty, GetPropertyById } from "../api";
import type {
  createResourceImageType,
  PropertyOccupationType,
  TypePropertyType,
} from "../schemas/property-registration.schema";

const MAX_IMAGES = 6;

interface PropertyEditable {
  propertyName: string;
  propertyType: TypePropertyType;
  propertyOccupationType: PropertyOccupationType;
}

// Imagen ya guardada (con info de Cloudinary) o recién elegida (solo uri local).
type EditableImage =
  | { kind: "remote"; key: string; uri: string; resource: createResourceImageType }
  | { kind: "local"; key: string; uri: string };

function ImageTile({
  uri,
  isNew,
  onRemove,
}: {
  uri: string;
  isNew: boolean;
  onRemove: () => void;
}) {
  return (
    <View style={styles.tile}>
      <Image source={{ uri }} style={styles.tileImage} resizeMode="cover" />
      {isNew ? (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>Nueva</Text>
        </View>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Quitar imagen"
        onPress={onRemove}
        style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
      >
        <Text style={styles.removeText}>×</Text>
      </Pressable>
    </View>
  );
}

export function EditProperty() {
  const [editable, setEditable] = useState<PropertyEditable>();
  const [images, setImages] = useState<EditableImage[]>([]);
  const [pickingImage, setPickingImage] = useState(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    data: property,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["properties", id],
    queryFn: () => GetPropertyById(id),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      // las nuevas se suben a Cloudinary; las existentes se conservan tal cual
      const resources = await Promise.all(
        images.map(async (image): Promise<createResourceImageType> => {
          if (image.kind === "remote") return image.resource;

          const res = await uploadImage(image.uri);
          return {
            url: res.url,
            assetId: res.asset_id,
            format: res.format,
            height: res.height,
            secureUrl: res.secure_url,
            width: res.width,
          };
        }),
      );

      return EditingProperty(id, {
        propertyName: editable?.propertyName,
        propertyOccupationType: editable?.propertyOccupationType,
        propertyType: editable?.propertyType,
        resources,
      });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text2: "No se pudo actualizar la propiedad. Inténtalo de nuevo.",
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      Toast.show({ type: "success", text2: res.message });
      router.navigate("/home/(tabs)/property-registration");
    },
  });

  useEffect(() => {
    if (!property) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditable({
      propertyName: property.propertyName,
      propertyOccupationType:
        property.propertyOccupationType as PropertyOccupationType,
      propertyType: property.typeProperty as TypePropertyType,
    });

    setImages(
      property.resources.map((resource, index) => ({
        kind: "remote",
        key: resource.id ?? `${resource.url}-${index}`,
        uri: resource.secureUrl ?? resource.url,
        resource: {
          url: resource.url,
          assetId: resource.assetId ?? undefined,
          format: resource.format ?? undefined,
          height: resource.height ?? undefined,
          secureUrl: resource.secureUrl ?? undefined,
          width: resource.width ?? undefined,
        },
      })),
    );
  }, [property]);

  const handleEditPropertyInfo = (field: string, value: string) => {
    setEditable((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const addImage = async () => {
    setPickingImage(true);

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Toast.show({
          type: "error",
          text2: "Necesitamos permisos para adjuntar la imagen!",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      setImages((prev) =>
        prev.some((image) => image.uri === uri)
          ? prev
          : [...prev, { kind: "local", key: uri, uri }],
      );
    } finally {
      setPickingImage(false);
    }
  };

  const removeImage = (key: string) =>
    setImages((prev) => prev.filter((image) => image.key !== key));

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return (
      <PrincipalError error="No se ha podido obtener la informacion de la propiedad" />
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.brand}>RENT</Text>
        <Text style={styles.title}>Editar propiedad</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* imágenes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Imágenes</Text>
            <Text style={styles.counter}>
              {images.length}/{MAX_IMAGES}
            </Text>
          </View>

          <View style={styles.grid}>
            {images.map((image) => (
              <ImageTile
                key={image.key}
                uri={image.uri}
                isNew={image.kind === "local"}
                onRemove={() => removeImage(image.key)}
              />
            ))}

            {images.length < MAX_IMAGES ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Añadir imagen"
                disabled={pickingImage}
                onPress={addImage}
                style={({ pressed }) => [
                  styles.tile,
                  styles.addTile,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.addPlus}>+</Text>
                <Text style={styles.addText}>
                  {pickingImage ? "Abriendo..." : "Añadir"}
                </Text>
              </Pressable>
            ) : null}
          </View>

          {images.length === 0 ? (
            <Text style={styles.hint}>
              Esta propiedad aún no tiene imágenes.
            </Text>
          ) : null}
        </View>

        {/* datos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nombre de propiedad</Text>
            <Input
              field="propertyName"
              fn={handleEditPropertyInfo}
              label="Nombre"
              placeholder="Nuevo nombre de propiedad"
              value={editable ? editable.propertyName : ""}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Tipo de propiedad</Text>
            <View style={styles.pickerBox}>
              <Picker
                style={styles.picker}
                selectedValue={editable ? editable.propertyType : "RESIDENCIAL"}
                onValueChange={(itemValue) =>
                  handleEditPropertyInfo("propertyType", itemValue)
                }
              >
                <Picker.Item label="Residencial" value="RESIDENCIAL" />
                <Picker.Item label="Comercial" value="COMERCIAL" />
                <Picker.Item label="Industrial" value="INDUSTRIAL" />
                <Picker.Item label="Terreno" value="TERRENO" />
                <Picker.Item label="Urbano" value="URBANO" />
                <Picker.Item label="Agrario" value="AGRARIO" />
                <Picker.Item label="Mixto" value="MIXTO" />
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Tipo de ocupación</Text>
            <View style={styles.pickerBox}>
              <Picker
                style={styles.picker}
                selectedValue={
                  editable ? editable.propertyOccupationType : "OCUPADO"
                }
                onValueChange={(itemValue) =>
                  handleEditPropertyInfo("propertyOccupationType", itemValue)
                }
              >
                <Picker.Item label="Arrendado" value="OCUPADO" />
                <Picker.Item label="En proceso" value="EN_PROCESO" />
                <Picker.Item label="Disponible" value="DESOCUPADO" />
              </Picker>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ButtonForm
          title="Guardar cambios"
          variant="primary"
          action={() => mutation.mutate()}
          isPending={mutation.isPending}
          disabled={!editable || editable.propertyName.trim().length === 0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSoft,
  },

  brand: {
    fontSize: 20,
    fontWeight: "700",
    color: Palette.textPrimary,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.textSecondary,
  },

  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xl,
  },

  section: {
    gap: Spacing.md,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Palette.textPrimary,
  },

  counter: {
    fontSize: 12,
    color: Palette.textMuted,
  },

  hint: {
    fontSize: 13,
    color: Palette.textMuted,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  tile: {
    width: "31%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: Radius.md,
    backgroundColor: Palette.surfaceMuted,
    borderWidth: 1,
    borderColor: Palette.border,
  },

  tileImage: {
    width: "100%",
    height: "100%",
  },

  newBadge: {
    position: "absolute",
    left: 6,
    bottom: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    backgroundColor: Palette.accent,
  },

  newBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  remove: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.7)",
  },

  removeText: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  addTile: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderStyle: "dashed",
    borderColor: Palette.accent,
    backgroundColor: Palette.accentSoft,
  },

  addPlus: {
    fontSize: 22,
    lineHeight: 24,
    color: Palette.accentStrong,
  },

  addText: {
    fontSize: 12,
    fontWeight: "600",
    color: Palette.accentStrong,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },

  field: {
    gap: Spacing.sm,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Palette.textSecondary,
  },

  pickerBox: {
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: Radius.md,
    backgroundColor: Palette.surface,
    overflow: "hidden",
  },

  picker: {
    width: "100%",
    height: 54,
    color: Palette.textPrimary,
  },

  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSoft,
    backgroundColor: Palette.background,
  },
});
