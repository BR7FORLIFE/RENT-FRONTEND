import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { MeCard } from "../features/auth/components/me";
import { logoutUser } from "../features/auth/services/auth.service";
import { useBehaviorAside } from "../stores/auth-store";
import { Colors } from "../themes/themes";
import { ButtonForm } from "./buttons/button";

export function ContentAside({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const { toggle } = useBehaviorAside();

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
          top: 0,
          left: 0,
          width: WIDTH,
          height: HEIGHT,
          backgroundColor: "white",
          zIndex: 100,
          borderRightWidth: 2,
          borderColor: Colors.PRIMARY,
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "auto",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <MeCard />
        </View>
        {/**boton de cerrar session */}
        <View style={{ width: "80%", height: "auto", alignSelf: "center" }}>
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
    zIndex: 99,
  },
});
