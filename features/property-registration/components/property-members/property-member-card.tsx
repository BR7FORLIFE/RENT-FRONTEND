import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  name: string;
  policies: string[];
  roles: string[];
  status: string;
  action: () => void;
}

export function PropertyMemberCard({ name, policies, roles, status, action }: Props) {
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
