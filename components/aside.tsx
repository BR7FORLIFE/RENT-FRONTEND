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

//assets
import InvitePersonIcon from "../assets/icons/invite-person.svg";

interface AsideItems {
  Icon: React.FC<SvgProps>;
  name: string;
  action: () => void;
}

const ASIDE_ITEMS: AsideItems[] = [
  {
    Icon: InvitePersonIcon,
    name: "Invitar Miembros",
    action: () => {
      router.navigate("/home/property-member");
    },
  },
];

export function ContentAside() {
  const { toggle } = useBehaviorAside();
  const { width, height } = useWindowDimensions();

  const HEIGHT = height * 0.8;
  const WIDTH = width * 0.75;

  const handleLogout = () => {
    logoutUser();
    router.navigate("/login");
  };

  return (
    <>
      <Pressable style={styles.overlay} onPress={toggle} />
      <View
        style={{
          position: "absolute",
          top: HEIGHT * 0.1,
          left: WIDTH * 0.05,
          width: WIDTH,
          height: HEIGHT,
          backgroundColor: "white",
          zIndex: 30,
          borderRightWidth: 2,
          borderRadius: 12,
          borderColor: "white",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: "100%",
            flex: 1,
            flexDirection: "column",
          }}
        >
          <MeCard />

          {/**seccion de items y botonos */}
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              paddingHorizontal: 20,
              paddingTop: 24,
            }}
          >
            {/** grupo de propiedades */}
            <View style={{ width: "100%" }}>
              {/** titulo del grupo */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: "#6B7280",
                    letterSpacing: 0.6,
                  }}
                >
                  PROPIEDADES
                </Text>

                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#E5E7EB",
                  }}
                />
              </View>

              {/** distintos botones del aside */}
              <View
                style={{
                  width: "100%",
                  gap: 6,
                  marginTop: 4,
                }}
              >
                {ASIDE_ITEMS.map(({ name, action, Icon }) => (
                  <AsideButton
                    key={name}
                    title={name}
                    action={action}
                    icon={<Icon width={21} height={21} />}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/**boton de cerrar session */}
        <View
          style={{
            width: "80%",
            height: "auto",
            alignSelf: "center",
            marginBottom: HEIGHT * 0.05,
          }}
        >
          <ButtonForm title="Cerrar Sessión" action={handleLogout} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 20,
  },
});
