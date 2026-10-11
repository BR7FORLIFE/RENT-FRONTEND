import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ButtonForm } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import { RentHeader } from "../../../components/header";
import SplashScreen from "../../../components/splash-screen";
import { InfoRow } from "../../../components/ui/info-row";
import { StatusBadge } from "../../../components/ui/status-badge";
import { Palette } from "../../../themes/themes";
import { PropertyMemberMe } from "../../property-registration/api";
import {
  ChangeTransactionStatus,
  GetTransactionById,
  PayTransaction,
} from "../api";
import {
  CATEGORY_LABEL,
  errorMessage,
  FINANCE_POLICY,
  formatCurrency,
  formatDateTime,
  formatDay,
  isImmutable,
  STATUS_ACTIONS,
  STATUS_INFO,
  TYPE_LABEL,
  type StatusAction,
} from "../services/format";

export function TransactionDetailScreen() {
  const { id, propertyId } = useLocalSearchParams<{
    id: string;
    propertyId: string;
  }>();
  const queryClient = useQueryClient();
  const key = ["financeTransaction", propertyId, id];

  const { isLoading, isError, data } = useQuery({
    queryKey: key,
    queryFn: () => GetTransactionById(propertyId, id),
  });

  const { data: member } = useQuery({
    queryKey: ["propertyMemberMe", propertyId],
    queryFn: () => PropertyMemberMe(propertyId),
  });

  const mutation = useMutation({
    mutationFn: (action: StatusAction) =>
      action.kind === "pay"
        ? PayTransaction(propertyId, id)
        : ChangeTransactionStatus(propertyId, id, action.kind),
    onSuccess: (updated) => {
      queryClient.setQueryData(key, updated);
      queryClient.invalidateQueries({ queryKey: ["financeTransactions", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["financeSummary", propertyId] });
      Toast.show({ type: "success", text1: "Movimiento actualizado" });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: errorMessage(error, "No se pudo actualizar el movimiento"),
      });
      // 409: otro usuario pudo modificarlo; recargamos para ajustar acciones.
      queryClient.invalidateQueries({ queryKey: key });
    },
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError || !data) {
    return <PrincipalError error="No se pudo obtener el movimiento!" />;
  }

  const status = STATUS_INFO[data.status];
  const locked = isImmutable(data.status);
  const canEdit = !!member?.policies.includes(FINANCE_POLICY.edit) && !locked;
  const actions = canEdit ? STATUS_ACTIONS[data.status] : [];
  const isIncome = data.type === "INCOME";

  return (
    <SafeAreaView style={styles.screen}>
      <RentHeader sectionName="Finanzas" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <StatusBadge label={status.label} tone={status.tone} />
          <Text
            style={[
              styles.amount,
              { color: isIncome ? Palette.success : Palette.danger },
            ]}
            numberOfLines={1}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(data.amount, data.currency)}
          </Text>
          <Text style={styles.description}>{data.description}</Text>
        </View>

        <View style={styles.card}>
          <InfoRow label="Tipo" value={TYPE_LABEL[data.type]} />
          <InfoRow label="Categoría" value={CATEGORY_LABEL[data.category]} />
          <InfoRow label="Fecha del movimiento" value={formatDay(data.occurredAt)} />
          <InfoRow label="Vencimiento" value={formatDay(data.dueDate)} />
          <InfoRow label="Pagado" value={formatDateTime(data.paidAt)} />
          <InfoRow label="Contrato" value={data.contractId ? "Asociado" : "Sin contrato"} />
          <InfoRow label="Origen" value={data.isSimulated ? "Simulado" : "Real"} />
          <InfoRow label="Creado" value={formatDateTime(data.createdAt)} />
          <InfoRow label="Actualizado" value={formatDateTime(data.updatedAt)} />
        </View>

        {locked && (
          <Text style={styles.notice}>Este movimiento no puede modificarse.</Text>
        )}

        {canEdit && (
          <ButtonForm
            title="Editar"
            action={() =>
              router.push({
                pathname: "/finance/form",
                params: { propertyId, transactionId: id },
              })
            }
          />
        )}

        {actions.map((action) => (
          <ButtonForm
            key={action.label}
            title={action.label}
            variant={action.kind === "pay" ? "primary" : "secondary"}
            isPending={mutation.isPending && mutation.variables?.label === action.label}
            disabled={mutation.isPending}
            action={() => mutation.mutate(action)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.background },
  content: { padding: 20, paddingBottom: 32, gap: 12 },
  hero: { gap: 8, paddingBottom: 4 },
  amount: { fontSize: 28, fontWeight: "800", letterSpacing: -0.3 },
  description: { fontSize: 14, lineHeight: 20, color: Palette.textSecondary },
  card: {
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  notice: { fontSize: 12, color: Palette.textMuted, textAlign: "center" },
});
