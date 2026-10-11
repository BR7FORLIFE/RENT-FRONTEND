import { StyleSheet, Text, View } from "react-native";

import { Avatar } from "../../../../components/ui/avatar";
import { InfoBlock } from "../../../../components/ui/info-row";
import { StatusBadge } from "../../../../components/ui/status-badge";
import { Palette } from "../../../../themes/themes";
import type { UserCompleteInfo } from "../../../../types/global";
import { formatDate, formatMoney } from "../../services/format";

function PartyRow({
  role,
  info,
  agreed,
}: {
  role: string;
  info: UserCompleteInfo;
  agreed: boolean;
}) {
  return (
    <View style={styles.party}>
      <Avatar name={info.userData.fullname} />

      <View style={styles.partyInfo}>
        <Text style={styles.role}>{role}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {info.userData.fullname}
        </Text>
        <Text style={styles.contact} numberOfLines={1}>
          {info.userData.email} · {info.userData.cellphone}
        </Text>
      </View>

      <StatusBadge
        label={agreed ? "De acuerdo" : "Pendiente"}
        tone={agreed ? "success" : "warning"}
      />
    </View>
  );
}

export function VersionContractDraft({
  version,
  landlordInfo,
  tenantInfo,
  landlordAgreed,
  tenantAgreed,
}: {
  version: number;
  landlordInfo: UserCompleteInfo;
  tenantInfo: UserCompleteInfo;
  landlordAgreed: boolean;
  tenantAgreed: boolean;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Partes del contrato</Text>
        <StatusBadge label={`Versión ${version}`} tone="accent" />
      </View>

      <PartyRow role="Arrendador" info={landlordInfo} agreed={landlordAgreed} />
      <View style={styles.divider} />
      <PartyRow role="Arrendatario" info={tenantInfo} agreed={tenantAgreed} />
    </View>
  );
}

export function FinancialAndDatesContractDraft({
  monthlyRent,
  depositAmount,
  startDate,
  endDate,
}: {
  monthlyRent: number;
  depositAmount: number;
  startDate: Date;
  endDate: Date;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Condiciones</Text>

      <View style={styles.row}>
        <InfoBlock label="Precio de arriendo" value={formatMoney(monthlyRent)} />
        <InfoBlock label="Depósito" value={formatMoney(depositAmount)} />
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <InfoBlock label="Fecha de inicio" value={formatDate(startDate)} />
        <InfoBlock label="Fecha de culminación" value={formatDate(endDate)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 16,
    gap: 14,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Palette.textPrimary,
  },

  party: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  partyInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  role: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: Palette.textFaint,
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.textPrimary,
  },

  contact: {
    fontSize: 12,
    color: Palette.textMuted,
  },

  divider: {
    height: 1,
    backgroundColor: Palette.borderSoft,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },
});
