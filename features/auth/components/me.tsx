import { StyleSheet, Text, View } from "react-native";

import UserIcon from "../../../assets/icons/user.svg";
import { useMe } from "../../../stores/auth-store";

export function MeCard() {
  const { user } = useMe();

  //creamos un componente sino existe dicho Me
  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileRow}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <UserIcon width={26} height={26} />
        </View>

        {/* Información */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {user.fullname}
          </Text>

          <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
            {user.email}
          </Text>

          <View style={styles.roleContainer}>
            <Text style={styles.role}>RENT USER</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 16,
  },

  profileRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,

    padding: 14,

    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,

    backgroundColor: "#FFFFFF",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,

    elevation: 2,
  },

  avatar: {
    width: 48,
    height: 48,

    borderRadius: 24,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#F1F5F9",

    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  info: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  email: {
    fontSize: 11,
    color: "#64748B",
  },

  roleContainer: {
    alignSelf: "flex-start",

    marginTop: 4,

    paddingHorizontal: 7,
    paddingVertical: 3,

    borderRadius: 6,

    backgroundColor: "#F1F5F9",
  },

  role: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#64748B",
  },
});
