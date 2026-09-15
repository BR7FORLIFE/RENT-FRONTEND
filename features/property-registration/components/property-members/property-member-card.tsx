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
    <Pressable style={styles.container} onPress={action}>
      <View style={styles.profile}>
        <View style={styles.avatar} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>

        <View style={styles.row}>
          {policies.slice(0, 3).map((policy) => (
            <Text key={policy} style={styles.policy}>
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
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 80,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "4%",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
  },

  profile: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#e5e7eb",
  },

  info: {
    flex: 1,
    justifyContent: "center",
    gap: 3,
  },

  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 5,
  },

  policy: {
    fontSize: 8,
    color: "#6b7280",
  },

  role: {
    fontSize: 8,
    color: "#4b5563",
    fontWeight: "600",
  },

  statusContainer: {
    marginLeft: 12,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  status: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16a34a",
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
    minHeight: 120,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#2563EB",
    borderRadius: 22,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F1F5F9",
    borderWidth: 1.5,
    borderColor: "#2563EB",
    marginRight: 14,
  },

  infoContainer: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },

  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 7,
  },

  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 4,
    rowGap: 2,
  },

  role: {
    fontSize: 8,
    fontWeight: "400",
    color: "#64748B",
    maxWidth: "100%",
  },

  moreRoles: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },

  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  infoButtonPressed: {
    backgroundColor: "#DBEAFE",
  },
});
