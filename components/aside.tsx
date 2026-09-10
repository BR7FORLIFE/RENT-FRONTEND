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
    backgroundColor: "rgba(15, 23, 42, 0.28)",
  },

  aside: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    zIndex: 1,
    borderRadius: 20,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.16,
    shadowRadius: 18,

    elevation: 12,
  },

  content: {
    flex: 1,
    width: "100%",
  },

  profileSection: {
    width: "100%",
    paddingTop: 8,
    paddingBottom: 18,
    paddingHorizontal: 14,

    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  menuSection: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 18,
    paddingTop: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 14,
    gap: 10,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 1,
  },

  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  itemsContainer: {
    width: "100%",
    gap: 6,
  },

  itemWrapper: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },

  footer: {
    width: "100%",
    paddingHorizontal: 22,
    paddingBottom: 22,
    paddingTop: 8,
  },

  footerLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#E2E8F0",
    marginBottom: 18,
  },
});
