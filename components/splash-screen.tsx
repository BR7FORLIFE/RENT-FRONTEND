import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WaveBackground from "../assets/backgrounds/wave-background.svg";

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View pointerEvents="none" style={styles.background}>
        <View style={styles.waveContainer}>
          <WaveBackground width="100%" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("../assets/images/logo-recortado.png")}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.appName}>Rent</Text>

          <Text style={styles.loadingText}>Cargando...</Text>

          <View style={styles.loaderContainer}>
            <View style={styles.loader} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  background: {
    ...StyleSheet.absoluteFillObject,
  },

  waveContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    opacity: 0.9,
  },

  content: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 24,
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",

    marginBottom: 20,
  },

  logoWrapper: {
    width: 120,
    height: 120,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 32,

    backgroundColor: "#FFFFFF",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 18,

    elevation: 8,
  },

  logo: {
    width: 88,
    height: 88,
  },

  infoContainer: {
    width: "100%",

    alignItems: "center",
  },

  appName: {
    fontSize: 30,
    lineHeight: 36,

    fontWeight: "800",

    letterSpacing: -0.5,

    color: "#111827",

    marginBottom: 8,
  },

  loadingText: {
    fontSize: 14,
    lineHeight: 20,

    fontWeight: "500",

    color: "#6B7280",

    marginBottom: 16,
  },

  loaderContainer: {
    width: 120,
    height: 4,

    overflow: "hidden",

    borderRadius: 4,

    backgroundColor: "#E5E7EB",
  },

  loader: {
    width: "45%",
    height: "100%",

    borderRadius: 4,

    backgroundColor: "#111827",
  },
});
