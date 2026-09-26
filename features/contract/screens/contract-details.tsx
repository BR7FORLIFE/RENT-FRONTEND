import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrincipalError } from "../../../components/error";
import { RentHeader } from "../../../components/header";
import { EmptyList, RentDescription } from "../../../components/info";
import SplashScreen, {
  SplashWaveBackground,
} from "../../../components/splash-screen";
import type { PaginationParams } from "../../../types/global";
import { PropertyMemberMe } from "../../property-registration/api";
import { GetAllContractDraft, GetAllContracts } from "../api";
import { ButtonContractAction } from "../components/UI/button-contract-action";
import { GenerateContractDraft } from "../components/contract-draft-generation";
import
  {
    ContractDraftCard,
    ContractPreviewCard,
  } from "../components/contract-preview-card";

//diferentes secciones dentro del mismo screen
export type Sections =
  | "LIST-CONTRACTS"
  | "LIST-CONTRACT-DRAFT"
  | "GENERATE-CONTRACT-DRAFT";

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
      <RentDescription title={rentTitle} description={rentDescription} />

      <View style={styles.contractListSection}>
        <FlatList
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
    queryKey: ["contracts", propertyId],
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
}: {
  propertyId: string;
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
          action={() => {}}
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
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 4,
        backgroundColor: "white",
        position: "relative",
      }}
    >
      <SplashWaveBackground />
      <RentHeader sectionName="CONTRATOS" />

      {section === "LIST-CONTRACTS" && (
        <ContractListSection propertyId={propertyId} />
      )}

      {section === "LIST-CONTRACT-DRAFT" && (
        <ContractDraftListSection propertyId={propertyId} />
      )}

      {section === "GENERATE-CONTRACT-DRAFT" ? (
        <ButtonContractAction
          propertyName={propertyName}
          sectionName={section}
          setSection={setSection}
          hidden
        />
      ) : (
        <ButtonContractAction
          propertyName={propertyName}
          sectionName={section}
          setSection={setSection}
        />
      )}

      {section === "GENERATE-CONTRACT-DRAFT" && (
        <GenerateContractDraft
          propertyId={propertyId}
          propertyName={propertyName}
          propertyMemberId={propertyMemberMe.info.id}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contractListSection: {
    height: "60%",
    width: "100%",
  },

  contractListContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
});
