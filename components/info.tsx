import { Image, StyleSheet, Text, View } from "react-native";
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

export function RentDescription({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={descriptionStyles.titleSection}>
      <Text style={descriptionStyles.title}>{title}</Text>
      <Text style={descriptionStyles.subtitle}>{description}</Text>
    </View>
  );
}

const descriptionStyles = StyleSheet.create({
  titleSection: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 18,
    color: "#6B7280",
    maxWidth: "90%",
  },
});

export function RentPropertyCard({
  propertyName,
  propertyDescription,
}: {
  propertyName: string;
  propertyDescription: string;
}) {
  return (
    <View style={rentPropertyCardStyles.container}>
      {/* imagen de rent */}
      <View style={rentPropertyCardStyles.imageContainer}>
        <Image
          source={require("../assets/images/logo-recortado.png")}
          resizeMode="contain"
          style={rentPropertyCardStyles.logo}
        />
      </View>

      {/* informacion de la propiedad */}
      <View style={rentPropertyCardStyles.content}>
        <Text style={rentPropertyCardStyles.title} numberOfLines={1}>
          {propertyName}
        </Text>

        <Text style={rentPropertyCardStyles.description} numberOfLines={2}>
          {propertyDescription}
        </Text>
      </View>
    </View>
  );
}

const rentPropertyCardStyles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",

    padding: 14,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
  },

  imageContainer: {
    width: 64,
    height: 64,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 14,

    backgroundColor: "#EFF6FF",
    borderRadius: 12,
  },

  logo: {
    width: 48,
    height: 48,
  },

  content: {
    flex: 1,
    gap: 5,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },

  description: {
    fontSize: 11,
    lineHeight: 19,
    color: "#64748B",
  },
});
