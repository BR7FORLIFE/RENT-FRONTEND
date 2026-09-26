import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RentHeader } from "../../../../components/header";
import { SplashWaveBackground } from "../../../../components/splash-screen";
import { ContractDraftListSection } from "../../../contract/screens/contract-details";
import type { POLICY_STATEMENT } from "../../constants";
import DetailsScreen from "../../screens/details";

interface TEMPLATE_VIEWS {
  policy: POLICY_STATEMENT;
  render: (propertyId: string) => React.ReactNode;
  isPage: boolean; //esto nos permite saber si el elemento a renderizar es una pagina entera con <SafeAreaView/> o una section
}

const TEMPLATES: TEMPLATE_VIEWS[] = [
  {
    policy: "VER_INMUEBLE",
    render: (propertyId: string) => <DetailsScreen propertyId={propertyId} />,
    isPage: true,
  },
  {
    policy: "VER_CONTRATOS_PRELIMINARES",
    render: (propertyId: string) => (
      <ContractDraftListSection propertyId={propertyId} />
    ),
    isPage: false,
  },
];

export function PropertyAssociationTemplateScreen() {
  const { id: propertyId, policy } = useLocalSearchParams<{
    id: string;
    policy: POLICY_STATEMENT;
  }>();

  const template = TEMPLATES.find((template) => template.policy === policy);

  if (template?.isPage) {
    return template.render(propertyId);
  }

  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
    >
      <RentHeader sectionName={policy} />

      {template?.render(propertyId)}

      <SplashWaveBackground bottom={-90} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
