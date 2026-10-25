import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrincipalError } from "../../../../components/error";
import { RentHeader } from "../../../../components/header";
import SplashScreen, {
  SplashWaveBackground,
} from "../../../../components/splash-screen";
import {
  ContractDraftListSection,
  ContractListSection,
} from "../../../contract/screens/contract-list-details";
import { PropertyFinanceScreen } from "../../../finance-reports/screens/property-finance-screen";
import { TransactionFormScreen } from "../../../finance-reports/screens/transaction-form-screen";
import {
  MarketplaceSection,
  MyOfferingsSection,
  RequestsSection,
} from "../../../properties-services/components/sections";
import { GetPropertyById, PropertyMemberMe } from "../../api";
import {
  hasPolicyScreen,
  type POLICY_STATEMENT,
  type PolicyWithScreen,
} from "../../constants";
import DetailsScreen from "../../screens/details";
import { EditProperty } from "../../screens/edit";
import { PropertyDocumentsSection } from "./property-documents-section";

interface TEMPLATE_VIEW_PROPS {
  propertyId: string;
  propertyName: string;
  propertyMemberId: string;
}

interface TEMPLATE_VIEWS {
  render: (props: TEMPLATE_VIEW_PROPS) => React.ReactNode;

  isPage: boolean; //esto nos permite saber si el elemento a renderizar es una pagina entera con <SafeAreaView/> o una section
}

//toda politica de POLICIES_WITH_SCREEN debe tener su template (lo exige el tipo Record)
const TEMPLATES: Record<PolicyWithScreen, TEMPLATE_VIEWS> = {
  VER_INMUEBLE: {
    render: ({ propertyId }) => <DetailsScreen propertyId={propertyId} />,
    isPage: true,
  },
  EDITAR_INMUEBLE: {
    render: ({ propertyId }) => <EditProperty propertyId={propertyId} />,
    isPage: true,
  },
  VER_DOCUMENTOS_INMUEBLE: {
    render: ({ propertyId }) => <PropertyDocumentsSection propertyId={propertyId} />,
    isPage: false,
  },
  VER_CONTRATOS: {
    render: ({ propertyId }) => <ContractListSection propertyId={propertyId} />,
    isPage: false,
  },
  VER_CONTRATOS_PRELIMINARES: {
    render: ({ propertyId, propertyMemberId, propertyName }) => (
      <ContractDraftListSection
        propertyId={propertyId}
        propertyName={propertyName}
        propertyMemberId={propertyMemberId}
      />
    ),
    isPage: false,
  },
  SOLICITAR_SERVICIOS: {
    render: () => <MarketplaceSection />,
    isPage: false,
  },
  VER_SOLICITUDES_SERVICIOS: {
    render: () => <RequestsSection role="requester" />,
    isPage: false,
  },
  PUBLICAR_OFERTAS_SERVICIOS: {
    render: () => <MyOfferingsSection />,
    isPage: false,
  },
  VER_FINANZAS: {
    render: ({ propertyId, propertyName }) => (
      <PropertyFinanceScreen propertyId={propertyId} propertyName={propertyName} />
    ),
    isPage: true,
  },
  REGISTRAR_MOVIMIENTOS_FINANCIEROS: {
    render: ({ propertyId }) => <TransactionFormScreen propertyId={propertyId} />,
    isPage: true,
  },
};

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

  const template = hasPolicyScreen(policy) ? TEMPLATES[policy] : undefined;

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
