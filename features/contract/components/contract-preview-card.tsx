import { Pressable, StyleSheet, Text, View } from "react-native";

import type { StatusContractType } from "../api.response";

//imagenes

import InfoIcon from "../../../assets/icons/info.svg";

interface ContractPreviewCardProps {
  startDate: Date;
  endDate: Date;
  status: StatusContractType;
  montlyRent: number;
  action: () => void;
}

export function ContractPreviewCard({
  startDate,
  endDate,
  status,
  montlyRent,
  action,
}: ContractPreviewCardProps) {
  return (
    <Pressable style={styles.container} onPress={action}>
      {/*contenedor de fecha y estados */}
      <View style={styles.dateAndStatusContainer}>
        {/*fechas */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Inicio</Text>
          <Text style={styles.date}>{startDate.toISOString()}</Text>

          <Text style={styles.dateLabel}>Finalización</Text>
          <Text style={styles.date}>{endDate.toISOString()}</Text>
        </View>

        {/*estado */}
        <View style={styles.statusContainer}>
          <Text style={styles.status}>{status}</Text>
        </View>
      </View>

      {/*contenedor de renta mensual y boton de informacion */}
      <View style={styles.rentContainer}>
        {/*imagen de informacion */}
        <Pressable style={styles.infoButton}>
          <InfoIcon width={20} height={20} />
        </Pressable>

        {/*renta mensual */}
        <View style={styles.rentContent}>
          <Text style={styles.rentLabel}>Renta Mensual</Text>
          <Text style={styles.rent}>{montlyRent}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    gap: 16,
  },

  dateAndStatusContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  dateContainer: {
    gap: 4,
  },

  dateLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
  },

  date: {
    fontSize: 13,
    fontWeight: "500",
    color: "#334155",
  },

  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
  },

  status: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2563EB",
  },

  rentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  rentContent: {
    gap: 2,
  },

  rentLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
  },

  rent: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  infoButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
  },
});

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
  return (
    <Pressable style={contractdraftcardstyles.container} onPress={action}>
      {/**version y estados */}
      <View style={contractdraftcardstyles.header}>
        <View style={contractdraftcardstyles.versionContainer}>
          <Text style={contractdraftcardstyles.versionLabel}>Borrador</Text>
          <Text style={contractdraftcardstyles.version}>
            Versión {version}
          </Text>
        </View>

        <View style={contractdraftcardstyles.statusContainer}>
          <View
            style={[
              contractdraftcardstyles.statusDot,
              landlordAgreed &&
                tenantAgreed &&
                contractdraftcardstyles.statusDotAgreed,
            ]}
          />
          <Text style={contractdraftcardstyles.status}>
            {landlordAgreed && tenantAgreed ? "Acordado" : "Pendiente"}
          </Text>
        </View>
      </View>

      {/*fechas del borrador */}
      <View style={contractdraftcardstyles.dateContainer}>
        <View>
          <Text style={contractdraftcardstyles.dateLabel}>Inicio</Text>
          <Text style={contractdraftcardstyles.date}>
            {startDate.toLocaleDateString()}
          </Text>
        </View>

        <View>
          <Text style={contractdraftcardstyles.dateLabel}>Finalización</Text>
          <Text style={contractdraftcardstyles.date}>
            {endDate.toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/*renta mensual */}
      <View style={contractdraftcardstyles.rentContainer}>
        {/*mas inforamcion */}
        <Pressable style={contractdraftcardstyles.infoButton}>
          <InfoIcon width={20} height={20} />
        </Pressable>

        {/*renta mensual (valor) */}
        <View style={contractdraftcardstyles.rentContent}>
          <Text style={contractdraftcardstyles.rentLabel}>
            Renta Mensual
          </Text>
          <Text style={contractdraftcardstyles.rent}>
            ${monthlyRent.toLocaleString()}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const contractdraftcardstyles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    gap: 16,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  versionContainer: {
    gap: 2,
  },

  versionLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
  },

  version: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#94A3B8",
  },

  statusDotAgreed: {
    backgroundColor: "#2563EB",
  },

  status: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },

  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dateLabel: {
    marginBottom: 4,
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
  },

  date: {
    fontSize: 13,
    fontWeight: "500",
    color: "#334155",
  },

  rentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  rentContent: {
    gap: 2,
  },

  rentLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
  },

  rent: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  infoButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
  },
});