import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonForm } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import { RentHeader } from "../../../components/header";
import { RentDescription } from "../../../components/info";
import SplashScreen from "../../../components/splash-screen";
import { AgreeContractDraft, GetContractDraftById } from "../api";
import
    {
        FinancialAndDatesContractDraft,
        VersionContractDraft,
    } from "../components/contract-draft/contract-draft-sections";

export function ContractDetailsDraftScreen() {
  const ref = useRef<RichEditor>(null);

  const {
    id: contractDraftId,
    propertyId,
    propertyMemberId,
    propertyName,
  } = useLocalSearchParams<{
    id: string;
    propertyId: string;
    propertyMemberId: string;
    propertyName: string;
  }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["contractDraft", contractDraftId],
    queryFn: () => GetContractDraftById(contractDraftId, propertyId),
  });

  const mutation = useMutation({
    mutationKey: ["agreeContractDraft", contractDraftId],
    mutationFn: () => AgreeContractDraft(contractDraftId, propertyId),
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return (
      <PrincipalError error="Error al obtener la informacion del borrador de contrato" />
    );
  }

  if (!data) {
    return null;
  }

  const isLandlord = propertyMemberId === data.landlordMember.propertyMemberId;

  const isTenant = propertyMemberId === data.tenantMember.propertyMemberId;

  const isMemberOfContract = isLandlord || isTenant;

  const hasAgreed =
    (isLandlord && data.landlordAgreed) || (isTenant && data.tenantAgreed);

  const canAgree = isMemberOfContract && !hasAgreed;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <RentHeader sectionName="Borrador de contrato" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          gap: 6,
          paddingBottom: 64,
        }}
      >
        <RentDescription
          title="Informacion de borrador"
          description="En este apartado abarcaras toda la informacion correspondiente a este borrador!"
        />

        {/**informacion de aceptacion y version de contrato */}

        <VersionContractDraft
          landlordAgreed={data.landlordAgreed}
          landlordInfo={data.landlordMember}
          tenantAgreed={data.tenantAgreed}
          tenantInfo={data.tenantMember}
          version={data.version}
        />

        {/**informacion del contrato */}
        <View style={contractDetailsDraftStyles.container}>
          <Text style={contractDetailsDraftStyles.title}>
            Contenido del contrato
          </Text>

          <View style={contractDetailsDraftStyles.document}>
            <RichEditor
              ref={ref}
              initialContentHTML={data.content}
              disabled
              style={contractDetailsDraftStyles.editor}
            />
          </View>
        </View>

        <FinancialAndDatesContractDraft
          monthlyRent={data.monthlyRent}
          depositAmount={data.depositAmount}
          startDate={data.startDate}
          endDate={data.endDate}
        />

        {canAgree ? (
          <ButtonForm
            title="ACEPTAR BORRADOR"
            action={() => {
              mutation.mutate(undefined, {
                onSuccess: () => {
                  router.push({
                    pathname: "/contracts/[id]",
                    params: {
                      id: propertyId,
                      propertyName,
                    },
                  });
                },
              });
            }}
          />
        ) : (
          <ButtonForm
            title="REGRESAR"
            action={() =>   
              router.push({
                pathname: "/contracts/[id]",
                params: { id: propertyId, propertyName },
              })
            }
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const contractDetailsDraftStyles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    gap: 12,
    marginTop: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },

  document: {
    flex: 1,
    width: "100%",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,

    overflow: "hidden",
  },

  editor: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export function ContractDetailsScreen() {}
