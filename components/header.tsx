import { Pressable, Text, useWindowDimensions, View } from "react-native";
import BarIcon from "../assets/icons/bar-right.svg";
import { useBehaviorAside } from "../stores/global-store";
import { ContentAside } from "./aside";

export default function Header() {
  const { isOpen, toggle } = useBehaviorAside(); //usamos el store para controlar el comportamiento en toda la aplicacion
  const { width, height } = useWindowDimensions(); //dimensiones de la pantalla

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
      <Pressable style={{ marginLeft: 12 }} onPress={() => toggle()}>
        <BarIcon width={32} height={32} />
      </Pressable>

      {/*titulo*/}
      <Text style={{ fontSize: 20, fontWeight: 700 }}>RENT</Text>

      {/** aside  */}
      {isOpen && <ContentAside />}
    </View>
  );
}
