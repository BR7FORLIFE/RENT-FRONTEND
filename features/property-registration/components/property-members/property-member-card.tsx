import { Pressable, StyleSheet, Text, View } from "react-native";
import InfoIcon from "../../../../assets/icons/info.svg";

interface Props {
  name: string;
  policies: string[];
  roles: string[];
  status: string;
  action: () => void;
}

export function PropertyMemberCard({
  name,
  policies,
  roles,
  status,
  action,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={action}
    >
      <View style={styles.profile}>
        <View style={styles.avatar} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>

        <View style={styles.row}>
          {policies.slice(0, 3).map((policy) => (
            <Text key={policy} style={styles.policy} numberOfLines={1}>
              {policy}
            </Text>
          ))}
        </View>

        <View style={styles.row}>
          {roles.map((role) => (
            <Text key={role} style={styles.role}>
              {role}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.status}>{status}</Text>
        <Text style={styles.actionIndicator}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  containerPressed: {
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    transform: [{ scale: 0.99 }],
  },

  profile: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  info: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    gap: 4,
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 5,
  },

  policy: {
    fontSize: 10,
    fontWeight: "400",
    color: "#64748B",
  },

  role: {
    fontSize: 10,
    fontWeight: "500",
    color: "#334155",
  },

  statusContainer: {
    flexDirection: "row",
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  status: {
    fontSize: 10,
    fontWeight: "600",
    color: "#2563EB",
  },

  actionIndicator: {
    fontSize: 20,
    lineHeight: 20,
    fontWeight: "400",
    color: "#94A3B8",
  },
});

interface MemberCardProps {
  name: string;
  roles: string[];
  onInfoPress?: () => void;
}

export function MemberCard({ name, roles, onInfoPress }: MemberCardProps) {
  const visibleRoles = roles.slice(0, 5);
  const hasMoreRoles = roles.length > 5;

  return (
    <View style={memberCardStyles.container}>
      <View style={memberCardStyles.avatar} />
      <View style={memberCardStyles.infoContainer}>
        <Text style={memberCardStyles.name} numberOfLines={1}>
          {name}
        </Text>

        <View style={memberCardStyles.rolesContainer}>
          {visibleRoles.map((role, index) => (
            <Text
              key={`${role}-${index}`}
              style={memberCardStyles.role}
              numberOfLines={1}
            >
              {role}
              {index < visibleRoles.length - 1 || hasMoreRoles ? "," : ""}
            </Text>
          ))}

          {hasMoreRoles && <Text style={memberCardStyles.moreRoles}>...</Text>}
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          memberCardStyles.infoButton,
          pressed && memberCardStyles.infoButtonPressed,
        ]}
        onPress={onInfoPress}
      >
        <InfoIcon width={18} height={18} color="#2563EB" strokeWidth={2} />
      </Pressable>
    </View>
  );
}
const memberCardStyles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 86,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginRight: 12,
  },

  infoContainer: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 5,
    rowGap: 4,
  },

  role: {
    fontSize: 10,
    fontWeight: "500",
    color: "#475569",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
    maxWidth: "100%",
  },

  moreRoles: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginLeft: 1,
  },

  infoButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  infoButtonPressed: {
    backgroundColor: "#DBEAFE",
    transform: [{ scale: 0.96 }],
  },
});
