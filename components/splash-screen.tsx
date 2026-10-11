import { useEffect, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WaveBackground from "../assets/backgrounds/wave-background.svg";
import { Palette, Radius } from "../themes/themes";

const TRACK_WIDTH = 120;
const BAR_WIDTH = 48;

export default function SplashScreen() {
  // barra indeterminada: la barra recorre la pista de izquierda a derecha
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-BAR_WIDTH, TRACK_WIDTH],
  });

  return (
    <SafeAreaView style={styles.screen}>
      <View pointerEvents="none" style={styles.background}>
        <View style={styles.waveContainer}>
          <WaveBackground width="100%" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/images/logo-recortado.png")}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>

        <Text style={styles.appName}>Rent</Text>
        <Text style={styles.loadingText}>Cargando...</Text>

        <View style={styles.loaderContainer}>
          <Animated.View
            style={[styles.loader, { transform: [{ translateX }] }]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  background: {
    ...StyleSheet.absoluteFill,
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

  logoWrapper: {
    width: 104,
    height: 104,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.lg + 8,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  logo: {
    width: 76,
    height: 76,
  },

  appName: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: Palette.textPrimary,
    marginBottom: 4,
  },

  loadingText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: Palette.textMuted,
    marginBottom: 20,
  },

  loaderContainer: {
    width: TRACK_WIDTH,
    height: 4,
    overflow: "hidden",
    borderRadius: Radius.pill,
    backgroundColor: Palette.border,
  },

  loader: {
    width: BAR_WIDTH,
    height: "100%",
    borderRadius: Radius.pill,
    backgroundColor: Palette.accent,
  },
});

export function SplashWaveBackground({ bottom = -40 }: { bottom?: number }) {
  return (
    <View
      style={{ position: "absolute", bottom, right: 0, left: 0, zIndex: -1 }}
    >
      <WaveBackground />
    </View>
  );
}
