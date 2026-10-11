import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBadge } from "../../../../components/ui/status-badge";
import { Palette } from "../../../../themes/themes";
import type {
  PublishedPropertyResponseApi,
  PublishedStructureResponseApi,
} from "../../api.response";
import { formatEnumLabel } from "../../services/format";

import BathroomIcon from "../../../../assets/icons/bathroom.svg";
import BedIcon from "../../../../assets/icons/bed.svg";
import HomeIcon from "../../../../assets/icons/home.svg";

export function FeedStats({
  structure,
}: {
  structure: PublishedStructureResponseApi | null;
}) {
  if (!structure) {
    return null;
  }

  return (
    <View style={styles.stats}>
      <View style={styles.stat}>
        <BedIcon width={16} height={16} />
        <Text style={styles.statText}>{structure.bedrooms} hab.</Text>
      </View>
      <View style={styles.stat}>
        <BathroomIcon width={16} height={16} />
        <Text style={styles.statText}>{structure.bathrooms} baños</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.statText}>{structure.area} m²</Text>
      </View>
    </View>
  );
}

export function FeedCard({
  property,
  onPress,
}: {
  property: PublishedPropertyResponseApi;
  onPress: () => void;
}) {
  const image = property.resourceImages?.[0];
  const cover = image ? (image.secureUrl ?? image.url) : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {cover ? (
        <Image
          source={{ uri: cover }}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <HomeIcon width={22} height={22} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>
            {property.propertyName}
          </Text>
          <StatusBadge
            label={formatEnumLabel(property.typeProperty)}
            tone="accent"
          />
        </View>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {property.propertyDescription}
      </Text>

      <View style={styles.footer}>
        <FeedStats structure={property.propertyStructureDescription} />
        <Text style={styles.link}>Ver detalle ›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 12,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 16,
  },

  cover: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    backgroundColor: Palette.surfaceMuted,
  },

  cardPressed: {
    backgroundColor: Palette.surfaceMuted,
    transform: [{ scale: 0.99 }],
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: Palette.accentSoft,
  },

  headerText: {
    flex: 1,
    gap: 6,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Palette.textPrimary,
  },

  description: {
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textMuted,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSoft,
  },

  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexShrink: 1,
  },

  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  statText: {
    fontSize: 12,
    fontWeight: "600",
    color: Palette.textSecondary,
  },

  link: {
    fontSize: 12,
    fontWeight: "700",
    color: Palette.accent,
  },
});
