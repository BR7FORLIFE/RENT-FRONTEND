import
  {
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
  } from "react-native";
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

export function RentHeader({ sectionName }: { sectionName: string }) {
  return (
    <View style={rentStyles.header}>
      <Text style={rentStyles.brand}>RENT</Text>
      <Text style={rentStyles.title}>{sectionName}</Text>
    </View>
  );
}

const rentStyles = StyleSheet.create({
  header: {
    width: "100%",
    height: 58,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9EEF5",
  },

  brand: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#111827",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },
});
