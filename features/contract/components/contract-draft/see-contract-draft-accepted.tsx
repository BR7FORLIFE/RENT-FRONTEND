import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import
    {
        ActivityIndicator,
        Alert,
        Pressable,
        StyleSheet,
        Text,
        View,
    } from "react-native";

import { PrincipalError } from "../../../../components/error";
import SplashScreen from "../../../../components/splash-screen";
import { CreateContract, getAllContractDraftAccepted } from "../../api";
import type { ContractDraftInfoResponse } from "../../api.response";

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Borradores aceptados</Text>

        <Text style={styles.description}>
          Estos borradores han sido aceptados por las partes y pueden
          convertirse en contratos.
        </Text>
      </View>

      <View style={styles.list}>
        {data.data.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No hay borradores aceptados</Text>

            <Text style={styles.emptyDescription}>
              Cuando ambas partes acepten un borrador aparecerá aquí.
            </Text>
          </View>
        ) : (
          data.data.map((draft) => (
            <AcceptedContractDraftCard
              key={draft.id}
              draft={draft}
              isCreating={createContractMutation.isPending}
              onCreateContract={() => createContractMutation.mutate(draft)}
            />
          ))
        )}
      </View>
    </View>
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
  const startDate = new Date(draft.startDate).toLocaleDateString();
  const endDate = new Date(draft.endDate).toLocaleDateString();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Borrador v{draft.version}</Text>

          <Text style={styles.cardSubtitle}>
            Ambas partes han aceptado el borrador
          </Text>
        </View>

        <View style={styles.acceptedBadge}>
          <Text style={styles.acceptedBadgeText}>ACEPTADO</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoContainer}>
        <InfoItem
          label="Arriendo mensual"
          value={`$${draft.monthlyRent.toLocaleString()}`}
        />

        <InfoItem
          label="Depósito"
          value={`$${draft.depositAmount.toLocaleString()}`}
        />

        <InfoItem label="Inicio" value={startDate} />

        <InfoItem label="Finalización" value={endDate} />
      </View>

      <View style={styles.agreementContainer}>
        <AgreementItem label="Arrendador" agreed={draft.landlordAgreed} />

        <AgreementItem label="Arrendatario" agreed={draft.tenantAgreed} />
      </View>

      <Pressable
        style={[styles.createButton, isCreating && styles.createButtonDisabled]}
        onPress={onCreateContract}
        disabled={isCreating}
      >
        {isCreating ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.createButtonText}>CREAR CONTRATO</Text>
        )}
      </Pressable>
    </View>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function AgreementItem({ label, agreed }: { label: string; agreed: boolean }) {
  return (
    <View style={styles.agreementItem}>
      <View
        style={[
          styles.agreementIndicator,
          agreed
            ? styles.agreementIndicatorAccepted
            : styles.agreementIndicatorPending,
        ]}
      />

      <Text style={styles.agreementText}>
        {label}: {agreed ? "Aceptado" : "Pendiente"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#202124",
  },

  description: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
    color: "#70757A",
  },

  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#202124",
  },

  cardSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },

  acceptedBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#EEF6FF",
  },

  acceptedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2563EB",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
  },

  infoContainer: {
    gap: 10,
  },

  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#202124",
  },

  agreementContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 8,
  },

  agreementItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  agreementIndicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },

  agreementIndicatorAccepted: {
    backgroundColor: "#2563EB",
  },

  agreementIndicatorPending: {
    backgroundColor: "#9CA3AF",
  },

  agreementText: {
    fontSize: 13,
    color: "#4B5563",
  },

  createButton: {
    marginTop: 16,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563EB",
  },

  createButtonDisabled: {
    opacity: 0.6,
  },

  createButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#202124",
  },

  emptyDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: "#6B7280",
  },
});
