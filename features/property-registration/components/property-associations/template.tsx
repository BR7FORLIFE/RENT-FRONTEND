import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrincipalError } from "../../../../components/error";
import { RentHeader } from "../../../../components/header";
import SplashScreen, {
  SplashWaveBackground,
} from "../../../../components/splash-screen";
import { ContractDraftListSection } from "../../../contract/screens/contract-list-details";
import { GetPropertyById, PropertyMemberMe } from "../../api";
import type { POLICY_STATEMENT } from "../../constants";
import DetailsScreen from "../../screens/details";

interface TEMPLATE_VIEW_PROPS {
  propertyId: string;
  propertyName: string;
  propertyMemberId: string;
}

interface TEMPLATE_VIEWS {
  policy: POLICY_STATEMENT;

  render: (props: TEMPLATE_VIEW_PROPS) => React.ReactNode;

  isPage: boolean; //esto nos permite saber si el elemento a renderizar es una pagina entera con <SafeAreaView/> o una section
}

const TEMPLATES: TEMPLATE_VIEWS[] = [
  {
    policy: "VER_INMUEBLE",
    render: ({ propertyId }) => <DetailsScreen propertyId={propertyId} />,
    isPage: true,
  },
  {
    policy: "VER_CONTRATOS_PRELIMINARES",
    render: ({ propertyId, propertyMemberId, propertyName }) => (
      <ContractDraftListSection
        propertyId={propertyId}
        propertyName={propertyName}
        propertyMemberId={propertyMemberId}
      />
    ),
    isPage: false,
  },
];

export function PropertyAssociationTemplateScreen() {
  const { id: propertyId, policy } = useLocalSearchParams<{
    id: string;
    policy: POLICY_STATEMENT;
  }>();

  const {
    data: propertyMemberData,
    isLoading: propertyMemberLoading,
    isError: propertyMemberError,
  } = useQuery({
    queryKey: ["propertyMember", propertyId],
    queryFn: () => PropertyMemberMe(propertyId),
  });

  const {
    data: propertyData,
    isLoading: propertyLoading,
    isError: propertyError,
  } = useQuery({
    queryKey: ["properties", propertyId],
    queryFn: () => GetPropertyById(propertyId),
  });

  const template = TEMPLATES.find((template) => template.policy === policy);

  if (propertyMemberLoading && propertyLoading) {
    return <SplashScreen />;
  }

  if (propertyMemberError && propertyError) {
    return (
      <PrincipalError error="Error al obtener la informacion de miembro para esta propiedad!" />
    );
  }

  if (!propertyMemberData || !propertyData) {
    return null;
  }

  if (template?.isPage) {
    return template.render({
      propertyId,
      propertyMemberId: propertyMemberData.info.id,
      propertyName: propertyData.propertyName,
    });
  }

  return (
    <SafeAreaView
      style={{ flex: 1, flexDirection: "column", backgroundColor: "white" }}
    >
      <RentHeader sectionName={policy} />

      {template?.render({
        propertyId,
        propertyMemberId: propertyMemberData.info.id,
        propertyName: propertyData.propertyName,
      })}

      <SplashWaveBackground bottom={-90} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
