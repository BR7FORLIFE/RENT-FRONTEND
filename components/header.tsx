import { Pressable, Text, View } from "react-native";
import BarIcon from "../assets/icons/bar-right.svg";

export default function Header() {
  return (
    <View
      style={{
        width: "50%",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
      }}
    >
      {/*componente de la barra lateral "los 3 puntos" */}
      <Pressable style={{ marginLeft: 12 }}>
        <BarIcon width={32} height={32} />
      </Pressable>

      {/*titulo*/}
      <Text style={{ fontSize: 20, fontWeight: 700 }}>RENT</Text>
    </View>
  );
}
