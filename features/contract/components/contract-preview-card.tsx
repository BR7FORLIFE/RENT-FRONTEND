import { Pressable, StyleSheet, Text, View } from "react-native";

import { StatusBadge } from "../../../components/ui/status-badge";
import { Palette } from "../../../themes/themes";
import type { StatusContractType } from "../api.response";
import {
  CONTRACT_STATUS,
  formatDate,
  formatMoney,
} from "../services/format";

interface ContractPreviewCardProps {
  startDate: string;
  endDate: string;
  status: StatusContractType;
  montlyRent: string;
  action: () => void;
}

function DateColumn({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.dateColumn}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.date}>{value}</Text>
    </View>
  );
}

export function ContractPreviewCard({
  startDate,
  endDate,
  status,
  montlyRent,
  action,
}: ContractPreviewCardProps) {
  const statusInfo = CONTRACT_STATUS[status] ?? {
    label: String(status ?? "Sin estado"),
    tone: "neutral" as const,
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={action}
    >
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.label}>Contrato</Text>
          <Text style={styles.rent}>{formatMoney(montlyRent)}</Text>
          <Text style={styles.rentCaption}>Renta mensual</Text>
        </View>

        <StatusBadge label={statusInfo.label} tone={statusInfo.tone} />
      </View>

      <View style={styles.dates}>
        <DateColumn label="Inicio" value={formatDate(startDate)} />
        <DateColumn label="Finalización" value={formatDate(endDate)} />
      </View>
    </Pressable>
  );
}

interface ContractDraftCardProps {
  version: number;
  landlordAgreed: boolean;
  tenantAgreed: boolean;
  monthlyRent: number;
  startDate: Date;
  endDate: Date;
  action: () => void;
}

export function ContractDraftCard({
  version,
  landlordAgreed,
  tenantAgreed,
  monthlyRent,
  startDate,
  endDate,
  action,
}: ContractDraftCardProps) {
  const agreed = landlordAgreed && tenantAgreed;
  const partial = landlordAgreed || tenantAgreed;

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={action}
    >
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.label}>Borrador · Versión {version}</Text>
          <Text style={styles.rent}>{formatMoney(monthlyRent)}</Text>
          <Text style={styles.rentCaption}>Renta mensual</Text>
        </View>

        <StatusBadge
          label={agreed ? "Acordado" : partial ? "Aceptación parcial" : "Pendiente"}
          tone={agreed ? "success" : partial ? "accent" : "warning"}
        />
      </View>

      <View style={styles.dates}>
        <DateColumn label="Inicio" value={formatDate(startDate)} />
        <DateColumn label="Finalización" value={formatDate(endDate)} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    gap: 16,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 16,
  },

  pressed: {
    backgroundColor: Palette.surfaceMuted,
    transform: [{ scale: 0.99 }],
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  titleBlock: {
    flex: 1,
    gap: 2,
  },

  label: {
    fontSize: 11,
    fontWeight: "500",
    color: Palette.textFaint,
  },

  rent: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: Palette.textPrimary,
  },

  rentCaption: {
    fontSize: 12,
    color: Palette.textMuted,
  },

  dates: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSoft,
  },

  dateColumn: {
    flex: 1,
    gap: 3,
  },

  date: {
    fontSize: 13,
    fontWeight: "600",
    color: Palette.textSecondary,
  },
});
