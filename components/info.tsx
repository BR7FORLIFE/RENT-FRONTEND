import { StyleSheet, Text, View } from "react-native";
import HomeIcon from "../assets/icons/home.svg";

export function EmptyList({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={emptyliststyle.container}>
      <View style={emptyliststyle.iconContainer}>
        <HomeIcon width={32} height={32} />
      </View>

      <Text style={emptyliststyle.title}>{title}</Text>

      <Text style={emptyliststyle.description}>{description}</Text>
    </View>
  );
}

const emptyliststyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 50,
  },

  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    marginBottom: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
    textAlign: "center",
    maxWidth: 300,
  },
});
