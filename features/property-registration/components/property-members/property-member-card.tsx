import { Pressable, StyleSheet, Text, View } from "react-native";
import InfoIcon from "../../../../assets/icons/info.svg";
import { Avatar } from "../../../../components/ui/avatar";
import { StatusBadge } from "../../../../components/ui/status-badge";
import { Palette } from "../../../../themes/themes";
import { formatEnumLabel, memberStatusInfo } from "../../services/format";

interface Props {
  name: string;
  policies?: string[];
  roles: string[];
  status: string;
  action: () => void;
}

function RoleChips({ roles, max = 3 }: { roles: string[]; max?: number }) {
  const visible = roles.slice(0, max);
  const hidden = roles.length - visible.length;

  if (roles.length === 0) {
    return <Text style={styles.noRoles}>Sin roles asignados</Text>;
  }

  return (
    <View style={styles.chips}>
      {visible.map((role) => (
        <Text key={role} style={styles.chip} numberOfLines={1}>
          {formatEnumLabel(role)}
        </Text>
      ))}
      {hidden > 0 && <Text style={styles.more}>+{hidden}</Text>}
    </View>
  );
}

export function PropertyMemberCard({ name, roles, status, action }: Props) {
  const statusInfo = memberStatusInfo(status);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={action}
    >
      <Avatar name={name} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <RoleChips roles={roles} />
      </View>

      <View style={styles.trailing}>
        <StatusBadge label={statusInfo.label} tone={statusInfo.tone} />
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
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },

  containerPressed: {
    backgroundColor: Palette.surfaceMuted,
    borderColor: Palette.borderStrong,
    transform: [{ scale: 0.99 }],
  },

  info: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.textPrimary,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 5,
    rowGap: 4,
  },

  chip: {
    maxWidth: "100%",
    paddingHorizontal: 7,
    paddingVertical: 3,
    fontSize: 10,
    fontWeight: "500",
    color: Palette.textSecondary,
    backgroundColor: Palette.surfaceMuted,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 7,
    overflow: "hidden",
  },

  more: {
    fontSize: 11,
    fontWeight: "600",
    color: Palette.textMuted,
  },

  noRoles: {
    fontSize: 11,
    color: Palette.textFaint,
  },

  trailing: {
    alignItems: "flex-end",
    gap: 6,
  },

  actionIndicator: {
    fontSize: 20,
    lineHeight: 20,
    color: Palette.textFaint,
  },
});

interface MemberCardProps {
  name: string;
  roles: string[];
  onInfoPress?: () => void;
}

export function MemberCard({ name, roles, onInfoPress }: MemberCardProps) {
  return (
    <View style={memberCardStyles.container}>
      <Avatar name={name} size={46} />

      <View style={memberCardStyles.infoContainer}>
        <Text style={memberCardStyles.name} numberOfLines={1}>
          {name}
        </Text>
        <RoleChips roles={roles} max={5} />
      </View>

      <Pressable
        style={({ pressed }) => [
          memberCardStyles.infoButton,
          pressed && memberCardStyles.infoButtonPressed,
        ]}
        onPress={onInfoPress}
      >
        <InfoIcon width={18} height={18} color={Palette.accent} strokeWidth={2} />
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
    gap: 12,
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
