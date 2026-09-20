import { router } from "expo-router";

import
  {
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
  } from "react-native";

import type { SvgProps } from "react-native-svg";

import { MeCard } from "../features/auth/components/me";
import { logoutUser } from "../features/auth/services/auth.service";
import { useBehaviorAside } from "../stores/global-store";
import { AsideButton, ButtonForm } from "./buttons/button";

import InvitePersonIcon from "../assets/icons/invite-person.svg";
import JoinIcon from "../assets/icons/join.svg";

import { useEffect } from "react";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface AsideItems {
  Icon: React.FC<SvgProps>;
  name: string;
  action: () => void;
}

const ASIDE_ITEMS: AsideItems[] = [
  {
    Icon: InvitePersonIcon,
    name: "Miembros",
    action: () => {
      router.navigate("/property-member");
    },
  },
  {
    Icon: JoinIcon,
    name: "Asociaciones a propiedades",
    action: () => {
      router.navigate("/property/property-associations");
    },
  },
];

export function ContentAside() {
  const { isOpen, toggle } = useBehaviorAside();

  const { width, height } = useWindowDimensions();

  const HEIGHT = height * 0.82;
  const WIDTH = width * 0.78;

  const handleLogout = () => {
    logoutUser();
    router.navigate("/auth/login");
  };

  const translateX = useSharedValue(-WIDTH);

  useEffect(() => {
    translateX.value = withTiming(isOpen ? 0 : -WIDTH, {
      duration: 300,
    });
  }, [isOpen, WIDTH, translateX]);

  const asideAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Pressable style={styles.overlay} onPress={toggle} />

      <Animated.View
        style={[
          styles.aside,
          asideAnimatedStyle,
          {
            top: HEIGHT * 0.08,
            left: WIDTH * 0.04,
            width: WIDTH,
            height: HEIGHT,
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.profileSection}>
            <MeCard />
          </View>

          <View style={styles.menuSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>PROPIEDADES</Text>

              <View style={styles.sectionLine} />
            </View>

            <View style={styles.itemsContainer}>
              {ASIDE_ITEMS.map(({ name, action, Icon }) => (
                <View key={name} style={styles.itemWrapper}>
                  <AsideButton
                    title={name}
                    action={action}
                    icon={<Icon width={17} height={17} />}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLine} />

          <ButtonForm title="Cerrar sesión" action={handleLogout} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15, 23, 42, 0.32)",
  },

  aside: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    zIndex: 1,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 12,
  },

  content: {
    flex: 1,
    width: "100%",
  },

  profileSection: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  menuSection: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 22,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
    gap: 10,
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1.2,
  },

  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  itemsContainer: {
    width: "100%",
    gap: 8,
  },

  itemWrapper: {
    width: "100%",
    borderRadius: 13,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },

  footer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 10,
    backgroundColor: "#FFFFFF",
  },

  footerLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 14,
  },
});
