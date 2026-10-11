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
import { Palette } from "../../../themes/themes";
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
    <SafeAreaView style={contractDetailsDraftStyles.screen}>
      <RentHeader sectionName="Borrador de contrato" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contractDetailsDraftStyles.scroll}
      >
        <RentDescription
          title="Información del borrador"
          description="Revisa las partes, el contenido y las condiciones antes de aceptar."
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
            title="Aceptar borrador"
            variant="primary"
            isPending={mutation.isPending}
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
            title="Regresar"
            action={() =>
              router.push({
                pathname: "/home/(tabs)/property-registration",
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
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 48,
    gap: 16,
  },

  container: {
    width: "100%",
    gap: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Palette.textPrimary,
  },

  document: {
    minHeight: 360,
    width: "100%",

    backgroundColor: Palette.surface,

    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 16,

    overflow: "hidden",
  },

  editor: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export function ContractDetailsScreen() {}
