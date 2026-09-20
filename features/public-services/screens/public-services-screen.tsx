import { SafeAreaView } from "react-native-safe-area-context";
import { RentHeader } from "../../../components/header";

export function PublicServicesScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", flexDirection: "column" }}
    >
      <RentHeader sectionName="Servicios Publicos" />
    </SafeAreaView>
  );
}
