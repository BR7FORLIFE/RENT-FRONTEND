import { router } from "expo-router";
import { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import type { SvgProps } from "react-native-svg";

import { MeCard } from "../features/auth/components/me";
import { logoutUser } from "../features/auth/services/auth.service";
import { useBehaviorAside } from "../stores/global-store";
import { Palette } from "../themes/themes";

import HomeIcon from "../assets/icons/home.svg";
import InvitePersonIcon from "../assets/icons/invite-person.svg";
import JoinIcon from "../assets/icons/join.svg";
import NotificationIcon from "../assets/icons/notification.svg";

interface AsideItem {
  Icon: React.FC<SvgProps>;
  name: string;
  description: string;
  action: () => void;
}

const PROPERTY_ITEMS: AsideItem[] = [
  {
    Icon: HomeIcon,
    name: "Feed",
    description: "Inmuebles publicados",
    action: () => router.navigate("/property/feed"),
  },
  {
    Icon: InvitePersonIcon,
    name: "Miembros",
    description: "Invita y gestiona personas",
    action: () => router.navigate("/property-member"),
  },
  {
    Icon: JoinIcon,
    name: "Asociaciones",
    description: "Propiedades a las que perteneces",
    action: () => router.navigate("/property/property-associations"),
  },
];

const ACTIVITY_ITEMS: AsideItem[] = [
  {
    Icon: NotificationIcon,
    name: "Notificaciones",
    description: "Avisos y novedades",
    action: () => null,
  },
];

function AsideSection({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: AsideItem[];
  onSelect: (action: () => void) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {items.map(({ Icon, name, description, action }) => (
        <Pressable
          key={name}
          onPress={() => onSelect(action)}
          style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
        >
          <View style={styles.itemIcon}>
            <Icon width={20} height={20} />
          </View>

          <View style={styles.itemText}>
            <Text style={styles.itemName}>{name}</Text>
            <Text style={styles.itemDescription} numberOfLines={1}>
              {description}
            </Text>
          </View>

          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function ContentAside() {
  const { isOpen, toggle } = useBehaviorAside();
  const { width } = useWindowDimensions();

  const WIDTH = Math.min(width * 0.82, 340);

  const translateX = useSharedValue(-WIDTH);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : -WIDTH, { duration: 250 });
    backdropOpacity.value = withTiming(isOpen ? 1 : 0, { duration: 250 });
  }, [isOpen, WIDTH, translateX, backdropOpacity]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  // cierra el panel y luego ejecuta la acción elegida
  const handleSelect = (action: () => void) => {
    toggle();
    action();
  };

  const handleLogout = () => {
    toggle();
    logoutUser();
    router.navigate("/auth/login");
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={toggle} />
      </Animated.View>

      <Animated.View style={[styles.drawer, { width: WIDTH }, drawerStyle]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>RENT</Text>
            <Pressable
              onPress={toggle}
              hitSlop={10}
              accessibilityLabel="Cerrar menú"
            >
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.profile}>
            <MeCard />
          </View>

          <View style={styles.menu}>
            <AsideSection
              title="Propiedades"
              items={PROPERTY_ITEMS}
              onSelect={handleSelect}
            />
            <AsideSection
              title="Actividad"
              items={ACTIVITY_ITEMS}
              onSelect={handleSelect}
            />
          </View>

          <View style={styles.footer}>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logout,
                pressed && styles.logoutPressed,
              ]}
            >
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },

  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Palette.surface,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },

  safeArea: {
    flex: 1,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },

  brand: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: Palette.textPrimary,
  },

  close: {
    fontSize: 18,
    color: Palette.textMuted,
  },

  profile: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: Palette.surfaceMuted,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 16,
  },

  menu: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },

  section: {
    gap: 4,
    marginTop: 16,
  },

  sectionTitle: {
    paddingHorizontal: 8,
    marginBottom: 4,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: Palette.textFaint,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },

  itemPressed: {
    backgroundColor: Palette.surfaceMuted,
  },

  itemIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: Palette.accentSoft,
  },

  itemText: {
    flex: 1,
    gap: 1,
  },

  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.textPrimary,
  },

  itemDescription: {
    fontSize: 12,
    color: Palette.textMuted,
  },

  chevron: {
    fontSize: 20,
    lineHeight: 20,
    color: Palette.textFaint,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSoft,
  },

  logout: {
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: Palette.dangerSoft,
  },

  logoutPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "700",
    color: Palette.danger,
  },
});
