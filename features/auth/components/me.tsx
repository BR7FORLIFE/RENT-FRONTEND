import { StyleSheet, Text, View } from "react-native";
import SplashScreen from "../../../components/splash-screen";
import { useMe } from "../../../hooks/hooks";

import UserIcon from "../../../assets/icons/user.svg";

export function MeCard() {
  const { user, isLoading } = useMe();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <View style={{ marginTop: 20 }}>
      {/**informacion de usuario y perfil */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <View
          style={{
            borderWidth: 2,
            borderColor: "black",
            borderRadius: 100,
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <UserIcon width={24} height={24} />
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text style={[meStyles.meInfo, { fontWeight: 300 }]}>
            {user?.email}
          </Text>
          <Text style={[{ fontSize: 10, marginBottom: 7 }, meStyles.meInfo]}>
            {user?.fullname}
          </Text>
          <Text style={[{ fontWeight: 300 }, meStyles.meInfo]}>RENT USER</Text>
        </View>
      </View>
    </View>
  );
}

const meStyles = StyleSheet.create({
  meInfo: {
    fontSize: 10,
  },
});
