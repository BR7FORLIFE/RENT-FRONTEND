import { StyleSheet, Text, View } from "react-native";

import type { UserCompleteInfo } from "../../../../types/global";

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
  const renderPerson = (
    role: string,
    info: UserCompleteInfo,
    agreed: boolean,
  ) => (
    <View style={versionContractStyles.personSection}>
      {/* header */}
      <View style={versionContractStyles.personHeader}>
        <Text style={versionContractStyles.role}>{role}</Text>

        <View
          style={[
            versionContractStyles.statusBadge,
            agreed
              ? versionContractStyles.statusAgreed
              : versionContractStyles.statusPending,
          ]}
        >
          <View
            style={[
              versionContractStyles.statusDot,
              agreed
                ? versionContractStyles.statusDotAgreed
                : versionContractStyles.statusDotPending,
            ]}
          />

          <Text
            style={[
              versionContractStyles.statusText,
              agreed
                ? versionContractStyles.statusTextAgreed
                : versionContractStyles.statusTextPending,
            ]}
          >
            {agreed ? "De acuerdo" : "Pendiente"}
          </Text>
        </View>
      </View>

      {/* informacion */}
      <View style={versionContractStyles.infoContainer}>
        <View style={versionContractStyles.infoItem}>
          <Text style={versionContractStyles.label}>Nombre</Text>
          <Text style={versionContractStyles.value} numberOfLines={1}>
            {info.userData.fullname}
          </Text>
        </View>

        <View style={versionContractStyles.infoItem}>
          <Text style={versionContractStyles.label}>Correo</Text>
          <Text style={versionContractStyles.value} numberOfLines={1}>
            {info.userData.email}
          </Text>
        </View>

        <View style={versionContractStyles.infoItem}>
          <Text style={versionContractStyles.label}>Teléfono</Text>
          <Text style={versionContractStyles.value}>
            {info.userData.cellphone}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={versionContractStyles.container}>
      {/* header del contrato */}
      <View style={versionContractStyles.header}>
        <View>
          <Text style={versionContractStyles.title}>Versión del contrato</Text>

          <Text style={versionContractStyles.version}>Versión {version}</Text>
        </View>
      </View>

      {/* Participantes */}
      <View style={versionContractStyles.peopleContainer}>
        {renderPerson("Arrendador", landlordInfo, landlordAgreed)}

        <View style={versionContractStyles.divider} />

        {renderPerson("Arrendatario", tenantInfo, tenantAgreed)}
      </View>
    </View>
  );
}

const versionContractStyles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },

  version: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },

  peopleContainer: {
    width: "100%",
  },

  personSection: {
    width: "100%",
  },

  personHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  role: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    textTransform: "uppercase",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },

  statusAgreed: {
    backgroundColor: "#EFF6FF",
  },

  statusPending: {
    backgroundColor: "#F8FAFC",
  },

  statusDot: {
    width: 6,
    height: 6,
    marginRight: 6,
    borderRadius: 3,
  },

  statusDotAgreed: {
    backgroundColor: "#2563EB",
  },

  statusDotPending: {
    backgroundColor: "#94A3B8",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  statusTextAgreed: {
    color: "#1D4ED8",
  },

  statusTextPending: {
    color: "#64748B",
  },

  infoContainer: {
    width: "100%",
    gap: 10,
  },

  infoItem: {
    width: "100%",
  },

  label: {
    marginBottom: 3,
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
  },

  value: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1E293B",
  },

  divider: {
    height: 1,
    marginVertical: 16,
    backgroundColor: "#E2E8F0",
  },
});

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
    <View style={financialAndDatesContractDraftStyles.container}>
      <View style={financialAndDatesContractDraftStyles.row}>
        <View style={financialAndDatesContractDraftStyles.item}>
          <Text style={financialAndDatesContractDraftStyles.label}>
            PRECIO DE ARRIENDO
          </Text>

          <Text style={financialAndDatesContractDraftStyles.value}>
            ${monthlyRent.toLocaleString("es-CO")}
          </Text>
        </View>

        <View style={financialAndDatesContractDraftStyles.item}>
          <Text style={financialAndDatesContractDraftStyles.label}>
            DEPÓSITO
          </Text>

          <Text style={financialAndDatesContractDraftStyles.value}>
            ${depositAmount.toLocaleString("es-CO")}
          </Text>
        </View>
      </View>

      <View style={financialAndDatesContractDraftStyles.row}>
        <View style={financialAndDatesContractDraftStyles.item}>
          <Text style={financialAndDatesContractDraftStyles.label}>
            FECHA DE INICIACIÓN
          </Text>

          <Text style={financialAndDatesContractDraftStyles.value}>
            {new Date(startDate).toLocaleDateString("es-CO")}
          </Text>
        </View>

        <View style={financialAndDatesContractDraftStyles.item}>
          <Text style={financialAndDatesContractDraftStyles.label}>
            FECHA DE CULMINACIÓN
          </Text>

          <Text style={financialAndDatesContractDraftStyles.value}>
            {new Date(endDate).toLocaleDateString("es-CO")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const financialAndDatesContractDraftStyles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 12,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  item: {
    flex: 1,

    padding: 14,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
  },

  label: {
    marginBottom: 8,

    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
    letterSpacing: 0.3,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
});
