import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

import { ButtonForm } from "../../../../components/buttons/button";
import { PrincipalError } from "../../../../components/error";
import { EmptyList } from "../../../../components/info";
import SplashScreen from "../../../../components/splash-screen";
import { CreateContract, getAllContractDraftAccepted } from "../../api";
import { InfoBlock } from "../../../../components/ui/info-row";
import { StatusBadge } from "../../../../components/ui/status-badge";
import { Palette } from "../../../../themes/themes";
import type { ContractDraftInfoResponse } from "../../api.response";
import { formatDate, formatMoney } from "../../services/format";

interface SeeContractAcceptedProps {
  propertyId: string;
}

export function SeeContractAccepted({ propertyId }: SeeContractAcceptedProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["GetAllContractDraftAccepted", propertyId],
    queryFn: () => getAllContractDraftAccepted(propertyId),
  });

  const createContractMutation = useMutation({
    mutationFn: (draft: ContractDraftInfoResponse) =>
      CreateContract({
        propertyId: draft.propertyId,
        landlordMemberId: draft.landlordMemberId,
        tenantMemberId: draft.tenantMemberId,
      }),

    onSuccess: () => {
      Alert.alert(
        "Contrato creado",
        "El contrato fue creado exitosamente a partir del borrador aceptado.",
      );

      queryClient.invalidateQueries({
        queryKey: ["GetAllContractDraftAccepted", propertyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["GetAllContract", propertyId],
      });
    },

    onError: () => {
      Alert.alert(
        "Error",
        "No fue posible crear el contrato a partir del borrador.",
      );
    },
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return (
      <PrincipalError error="Error al obtener los borradores de contratos aceptados." />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <FlatList
      data={data.data}
      keyExtractor={(draft) => draft.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Borradores aceptados</Text>
          <Text style={styles.description}>
            Estos borradores han sido aceptados por las partes y pueden
            convertirse en contratos.
          </Text>
        </View>
      }
      ListEmptyComponent={
        <EmptyList
          title="No hay borradores aceptados"
          description="Cuando ambas partes acepten un borrador aparecerá aquí."
        />
      }
      renderItem={({ item }) => (
        <AcceptedContractDraftCard
          draft={item}
          isCreating={createContractMutation.isPending}
          onCreateContract={() => createContractMutation.mutate(item)}
        />
      )}
    />
  );
}

interface AcceptedContractDraftCardProps {
  draft: ContractDraftInfoResponse;
  isCreating: boolean;
  onCreateContract: () => void;
}

function AcceptedContractDraftCard({
  draft,
  isCreating,
  onCreateContract,
}: AcceptedContractDraftCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.cardTitle}>Borrador v{draft.version}</Text>
          <Text style={styles.cardSubtitle}>
            Ambas partes han aceptado el borrador
          </Text>
        </View>

        <StatusBadge label="Aceptado" tone="success" />
      </View>

      <View style={styles.infoGrid}>
        <InfoBlock label="Arriendo mensual" value={formatMoney(draft.monthlyRent)} />
        <InfoBlock label="Depósito" value={formatMoney(draft.depositAmount)} />
      </View>

      <View style={styles.infoGrid}>
        <InfoBlock label="Inicio" value={formatDate(draft.startDate)} />
        <InfoBlock label="Finalización" value={formatDate(draft.endDate)} />
      </View>

      <ButtonForm
        title="Crear contrato"
        variant="primary"
        action={onCreateContract}
        isPending={isCreating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },

  header: {
    gap: 3,
    marginBottom: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Palette.textPrimary,
  },

  description: {
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textMuted,
  },

  card: {
    padding: 16,
    gap: 16,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  cardTitleBlock: {
    flex: 1,
    gap: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Palette.textPrimary,
  },

  cardSubtitle: {
    fontSize: 12,
    color: Palette.textMuted,
  },

  infoGrid: {
    flexDirection: "row",
    gap: 12,
  },
});
