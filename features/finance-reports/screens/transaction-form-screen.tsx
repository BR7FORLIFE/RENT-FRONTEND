import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ButtonForm, FilterButton } from "../../../components/buttons/button";
import { PrincipalError } from "../../../components/error";
import { RentHeader } from "../../../components/header";
import { Input } from "../../../components/inputs/input";
import SplashScreen from "../../../components/splash-screen";
import { Palette } from "../../../themes/themes";
import { CreateTransaction, EditTransaction, GetTransactionById } from "../api";
import type { FinancialTransaction } from "../types";
import {
  CreateTransactionSchema,
  EditTransactionSchema,
  type Category,
  type Currency,
  type TransactionType,
} from "../schemas/transaction.schema";
import {
  CATEGORY_LABEL,
  errorMessage,
  isImmutable,
  STATUS_INFO,
  TYPE_LABEL,
} from "../services/format";

type InitialStatus = "PLANNED" | "PENDING" | "PAID";
const INITIAL_STATUSES: InitialStatus[] = ["PLANNED", "PENDING", "PAID"];
const CURRENCIES: Currency[] = ["COP", "USD"];

const toDay = (iso: string | null) => (iso ? iso.slice(0, 10) : "");
const toIso = (day: string) => `${day}T00:00:00.000Z`;

function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.chips}>
        {options.map((o) => (
          <FilterButton
            key={o.value}
            title={o.label}
            active={o.value === value}
            onPress={() => !disabled && onChange(o.value)}
          />
        ))}
      </View>
    </View>
  );
}

// Carga el movimiento (si se edita) y monta el formulario con sus valores iniciales.
export function TransactionFormScreen() {
  const { propertyId, transactionId } = useLocalSearchParams<{
    propertyId: string;
    transactionId?: string;
  }>();

  const existing = useQuery({
    queryKey: ["financeTransaction", propertyId, transactionId],
    queryFn: () => GetTransactionById(propertyId, transactionId as string),
    enabled: !!transactionId,
  });

  if (transactionId && existing.isLoading) {
    return <SplashScreen />;
  }

  if (transactionId && (existing.isError || !existing.data)) {
    return <PrincipalError error="No se pudo obtener el movimiento!" />;
  }

  return (
    <TransactionForm
      propertyId={propertyId}
      transactionId={transactionId}
      existing={existing.data}
    />
  );
}

// Crear (sin transactionId) y editar (con transactionId) comparten formulario.
function TransactionForm({
  propertyId,
  transactionId,
  existing,
}: {
  propertyId: string;
  transactionId?: string;
  existing?: FinancialTransaction;
}) {
  const isEdit = !!transactionId;
  const queryClient = useQueryClient();

  const [type, setType] = useState<TransactionType>(existing?.type ?? "INCOME");
  const [category, setCategory] = useState<Category>(existing?.category ?? "RENT");
  const [status, setStatus] = useState<InitialStatus>("PENDING");
  const [currency, setCurrency] = useState<Currency>(existing?.currency ?? "COP");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [amount, setAmount] = useState(existing?.amount ?? "");
  const [occurredAt, setOccurredAt] = useState(toDay(existing?.occurredAt ?? null));
  const [dueDate, setDueDate] = useState(toDay(existing?.dueDate ?? null));

  const mutation = useMutation({
    mutationFn: async () => {
      if (!isEdit) {
        const body = CreateTransactionSchema.parse({
          type,
          category,
          status,
          description,
          amount,
          currency,
          occurredAt: occurredAt.trim() ? occurredAt : undefined,
          dueDate: dueDate.trim() ? dueDate : undefined,
        });
        return CreateTransaction(propertyId, {
          ...body,
          occurredAt: body.occurredAt && toIso(body.occurredAt),
          dueDate: body.dueDate && toIso(body.dueDate),
        });
      }

      // Solo se envían los campos que cambiaron (al menos uno).
      const t = existing;
      if (!t) throw new Error("Movimiento no cargado");
      const changes: Record<string, unknown> = {};
      if (category !== t.category) changes.category = category;
      if (description !== t.description) changes.description = description;
      if (amount !== t.amount) changes.amount = amount;
      if (currency !== t.currency) changes.currency = currency;
      if (occurredAt && occurredAt !== toDay(t.occurredAt)) changes.occurredAt = occurredAt;
      if (dueDate !== toDay(t.dueDate)) changes.dueDate = dueDate || null;
      if (Object.keys(changes).length === 0) {
        throw new Error("No hay cambios para guardar");
      }
      const body = EditTransactionSchema.parse(changes);
      return EditTransaction(propertyId, transactionId, {
        ...body,
        occurredAt: body.occurredAt ? toIso(body.occurredAt) : undefined,
        dueDate: body.dueDate ? toIso(body.dueDate) : body.dueDate,
      });
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(
        ["financeTransaction", propertyId, saved.id],
        saved,
      );
      queryClient.invalidateQueries({ queryKey: ["financeTransactions", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["financeSummary", propertyId] });
      Toast.show({
        type: "success",
        text1: isEdit ? "Movimiento actualizado" : "Movimiento registrado",
      });
      router.back();
    },
    onError: (error) => {
      const zodMessage = (error as { issues?: { message: string }[] }).issues?.[0]
        ?.message;
      Toast.show({
        type: "error",
        text1: zodMessage ?? errorMessage(error, (error as Error).message),
      });
    },
  });

  const locked = existing ? isImmutable(existing.status) : false;

  return (
    <SafeAreaView style={styles.screen}>
      <RentHeader sectionName="Finanzas" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>
          {isEdit ? "Editar movimiento" : "Registrar movimiento"}
        </Text>

        {locked && (
          <Text style={styles.notice}>Este movimiento no puede modificarse.</Text>
        )}

        {!isEdit && (
          <Choice
            label="Tipo"
            value={type}
            onChange={setType}
            options={(Object.keys(TYPE_LABEL) as TransactionType[]).map((v) => ({
              value: v,
              label: TYPE_LABEL[v],
            }))}
          />
        )}

        <Choice
          label="Categoría"
          value={category}
          onChange={setCategory}
          disabled={locked}
          options={(Object.keys(CATEGORY_LABEL) as Category[]).map((v) => ({
            value: v,
            label: CATEGORY_LABEL[v],
          }))}
        />

        <Input
          field="description"
          label="Descripción"
          placeholder="Canon de octubre"
          value={description}
          maxLength={500}
          fn={(_, v) => !locked && setDescription(v)}
        />

        <Input
          field="amount"
          label="Importe"
          placeholder="1500000.00"
          value={amount}
          typeInput="numeric"
          maxLength={13}
          fn={(_, v) => !locked && setAmount(v.replace(",", "."))}
        />

        <Choice
          label="Moneda"
          value={currency}
          onChange={setCurrency}
          disabled={locked}
          options={CURRENCIES.map((v) => ({ value: v, label: v }))}
        />

        <Input
          field="occurredAt"
          label="Fecha del movimiento (AAAA-MM-DD)"
          placeholder="2026-10-01"
          value={occurredAt}
          maxLength={10}
          fn={(_, v) => !locked && setOccurredAt(v)}
        />

        <Input
          field="dueDate"
          label="Vencimiento (AAAA-MM-DD)"
          placeholder="2026-10-05"
          value={dueDate}
          maxLength={10}
          fn={(_, v) => !locked && setDueDate(v)}
        />

        {!isEdit && (
          <Choice
            label="Estado inicial"
            value={status}
            onChange={setStatus}
            options={INITIAL_STATUSES.map((v) => ({
              value: v,
              label: STATUS_INFO[v].label,
            }))}
          />
        )}

        <ButtonForm
          variant="primary"
          title={isEdit ? "Guardar cambios" : "Registrar"}
          isPending={mutation.isPending}
          disabled={locked}
          action={() => mutation.mutate()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Palette.background },
  content: { padding: 20, paddingBottom: 32, gap: 20 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: Palette.textPrimary,
  },
  notice: { fontSize: 12, color: Palette.textMuted },
  group: { gap: 8 },
  groupLabel: { fontSize: 12, fontWeight: "500", color: Palette.textMuted },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
