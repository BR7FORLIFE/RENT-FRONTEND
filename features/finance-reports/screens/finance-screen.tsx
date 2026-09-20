import { SafeAreaView } from "react-native-safe-area-context";
import { RentHeader } from "../../../components/header";

export function FinancialScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
    >
      <RentHeader sectionName="Finanzas" />
    </SafeAreaView>
  );
}
