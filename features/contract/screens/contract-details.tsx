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
import { GetAllContractDraft, GetAllContracts } from "../api";
import { ButtonContractAction } from "../components/UI/button-contract-action";
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

export function ContractDetailsScreen() {
  const { id: propertyId, propertyName } = useLocalSearchParams<{
    id: string;
    propertyName: string;
  }>();

  //estado para cambiar las vistas de los contratos para no crear un nuevo path
  const [section, setSection] = useState<Sections>("LIST-CONTRACTS");

  const [pagination, setPagination] = useState<PaginationParams>({
    limit: 10,
    page: 1,
  });

  const {
    isLoading: contractLoading,
    isError: contractError,
    data: contractData,
  } = useQuery({
    queryKey: ["contracts", propertyId],
    queryFn: () =>
      GetAllContracts(propertyId, pagination.page, pagination.limit),
  });

  const {
    isLoading: contractDraftLoading,
    isError: contractDraftError,
    data: contractDraftData,
  } = useQuery({
    queryKey: ["contracts", propertyId],
    queryFn: () =>
      GetAllContractDraft(propertyId, pagination.page, pagination.limit),
  });

  if (contractLoading && contractDraftLoading) {
    return <SplashScreen />;
  }

  if (contractError && contractDraftError) {
    return (
      <PrincipalError error="Error al obtener los contratos para esta propiedad!" />
    );
  }

  if (!contractData || !contractDraftData) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 12,
        backgroundColor: "white",
        position: "relative",
      }}
    >
      <SplashWaveBackground />
      <RentHeader sectionName="CONTRATOS" />

      <ButtonContractAction
        propertyName={propertyName}
        sectionName={section}
        setSection={setSection}
      />

      {section === "LIST-CONTRACTS" && (
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
      )}

      {section === "LIST-CONTRACT-DRAFT" && (
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contractListSection: {
    flex: 1,
    width: "100%",
  },

  contractListContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
});
