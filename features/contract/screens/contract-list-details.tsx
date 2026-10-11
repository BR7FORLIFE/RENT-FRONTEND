import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrincipalError } from "../../../components/error";
import { RentHeader } from "../../../components/header";
import { EmptyList } from "../../../components/info";
import SplashScreen, {
  SplashWaveBackground,
} from "../../../components/splash-screen";
import { Palette } from "../../../themes/themes";
import type { PaginationParams } from "../../../types/global";
import {
  SegmentedTabs,
  type SegmentedTab,
} from "../../../components/ui/segmented-tabs";
import { PropertyMemberMe } from "../../property-registration/api";
import { GetAllContractDraft, GetAllContracts } from "../api";
import { GenerateContractDraft } from "../components/contract-draft/contract-draft-generation";
import { SeeContractAccepted } from "../components/contract-draft/see-contract-draft-accepted";
import
  {
    ContractDraftCard,
    ContractPreviewCard,
  } from "../components/contract-preview-card";

//diferentes secciones dentro del mismo screen
export type Sections =
  | "LIST-CONTRACTS"
  | "LIST-CONTRACT-DRAFT"
  | "GENERATE-CONTRACT-DRAFT"
  | "VER-ACEPTACIONES-BORRADORES";

const SECTION_TABS: SegmentedTab<Sections>[] = [
  { label: "Contratos", value: "LIST-CONTRACTS" },
  { label: "Borradores", value: "LIST-CONTRACT-DRAFT" },
  { label: "Nuevo borrador", value: "GENERATE-CONTRACT-DRAFT" },
  { label: "Aceptados", value: "VER-ACEPTACIONES-BORRADORES" },
];

interface ContractListProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactElement;
  emptyTitle: string;
  emptyDescription: string;
  rentTitle: string;
  rentDescription: string;
}

export function ContractList<T>({
  data,
  renderItem,
  emptyTitle,
  emptyDescription,
  rentTitle,
  rentDescription,
}: ContractListProps<T>) {
  return (
    <>
      <View style={styles.contractListSection}>
        <FlatList
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>{rentTitle}</Text>
              <Text style={styles.listDescription}>{rentDescription}</Text>
            </View>
          }
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => renderItem(item)}
          ListEmptyComponent={
            <EmptyList title={emptyTitle} description={emptyDescription} />
          }
          contentContainerStyle={styles.contractListContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

export function ContractListSection({ propertyId }: { propertyId: string }) {
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: 10,
    page: 1,
  });

  //lista de contratos
  const {
    isLoading: contractLoading,
    isError: contractError,
    data: contractData,
  } = useQuery({
    queryKey: ["GetAllContract", propertyId],
    queryFn: () =>
      GetAllContracts(propertyId, pagination.page, pagination.limit),
  });

  if (contractLoading) {
    return <SplashScreen />;
  }

  if (contractError) {
    return (
      <PrincipalError error="Error al obtener la lista de contratos para la propiedad actual!" />
    );
  }

  if (!contractData) {
    return null;
  }

  return (
    <ContractList
      data={contractData.data}
      renderItem={(item) => (
        <ContractPreviewCard
          endDate={item.endDate}
          montlyRent={item.monthlyRent}
          startDate={item.startDate}
          status={item.status}
          action={() => {}}
        />
      )}
      emptyTitle="No hay contratos generados"
      emptyDescription="Genera tu primer contrato para visualizarlo!"
      rentTitle="Lista de contratos"
      rentDescription="Visualiza los distintos contratos para esta propiedad!"
    />
  );
}

export function ContractDraftListSection({
  propertyId,
  propertyMemberId,
  propertyName,
}: {
  propertyId: string;
  propertyMemberId: string;
  propertyName: string;
}) {
  const [pagination, setPagination] = useState<PaginationParams>({
    limit: 10,
    page: 1,
  });

  //lista de borradores de contrato
  const {
    isLoading: contractDraftLoading,
    isError: contractDraftError,
    data: contractDraftData,
  } = useQuery({
    queryKey: ["GetAllContractDraft", propertyId],
    queryFn: () =>
      GetAllContractDraft(propertyId, pagination.page, pagination.limit),
  });

  if (contractDraftLoading) {
    return <SplashScreen />;
  }

  if (contractDraftError) {
    return (
      <PrincipalError error="Error al recuperar la lista de borradores de contratos para esta propiedad!" />
    );
  }

  if (!contractDraftData) {
    return null;
  }

  return (
    <ContractList
      data={contractDraftData.data}
      renderItem={(item) => (
        <ContractDraftCard
          startDate={item.startDate}
          endDate={item.endDate}
          landlordAgreed={item.landlordAgreed}
          tenantAgreed={item.tenantAgreed}
          action={() =>
            router.push({
              pathname: "/contracts/details/draft",
              params: {
                id: item.id,
                propertyId,
                propertyMemberId,
                propertyName,
              },
            })
          }
          monthlyRent={item.monthlyRent}
          version={item.version}
        />
      )}
      emptyTitle="No hay borradores creados"
      emptyDescription="Crea tu primer borrador de contrato!"
      rentTitle="Lista de borradores de contratos"
      rentDescription="Visualiza tus borradores generados para esta propiedad!"
    />
  );
}

export function ContractDetailsScreen() {
  const { id: propertyId, propertyName } = useLocalSearchParams<{
    id: string;
    propertyName: string;
  }>();

  //estado para cambiar las vistas de los contratos para no crear un nuevo path
  const [section, setSection] = useState<Sections>("LIST-CONTRACTS");

  //property Member Me para la propiedad actual
  const {
    isLoading: propertyMemberMeLoading,
    isError: propertyMemberMeError,
    data: propertyMemberMe,
  } = useQuery({
    queryKey: ["propertyMemberMe", propertyId],
    queryFn: () => PropertyMemberMe(propertyId),
  });

  if (propertyMemberMeLoading) {
    return <SplashScreen />;
  }

  if (propertyMemberMeError) {
    return (
      <PrincipalError error="Error al obtener la información de esta propiedad!" />
    );
  }

  if (!propertyMemberMe) {
    return null;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <SplashWaveBackground />
      <RentHeader sectionName="CONTRATOS" />

      <View style={styles.propertyTitle}>
        <Text style={styles.propertyLabel}>Propiedad</Text>
        <Text style={styles.propertyName} numberOfLines={1}>
          {propertyName}
        </Text>
      </View>

      <SegmentedTabs tabs={SECTION_TABS} value={section} onChange={setSection} />

      <View style={styles.content}>
        {section === "LIST-CONTRACTS" && (
          <ContractListSection propertyId={propertyId} />
        )}

        {section === "LIST-CONTRACT-DRAFT" && (
          <ContractDraftListSection
            propertyId={propertyId}
            propertyMemberId={propertyMemberMe.info.id}
            propertyName={propertyName}
          />
        )}

        {section === "GENERATE-CONTRACT-DRAFT" && (
          <GenerateContractDraft
            propertyId={propertyId}
            propertyName={propertyName}
            propertyMemberId={propertyMemberMe.info.id}
          />
        )}

        {section === "VER-ACEPTACIONES-BORRADORES" && (
          <SeeContractAccepted propertyId={propertyId} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  propertyTitle: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 2,
  },

  propertyLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Palette.textMuted,
  },

  propertyName: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: Palette.textPrimary,
  },

  content: {
    flex: 1,
  },

  contractListSection: {
    flex: 1,
    width: "100%",
  },

  listHeader: {
    marginBottom: 4,
    gap: 3,
  },

  listTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Palette.textPrimary,
  },

  listDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textMuted,
  },

  contractListContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
});
