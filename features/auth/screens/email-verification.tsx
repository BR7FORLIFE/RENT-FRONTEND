import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import WaveBackground from "../../../assets/backgrounds/wave-background.svg";
import { ButtonForm } from "../../../components/buttons/button";
import { emailForward } from "../../../core/api/api-endpoints";
import { useAuth } from "../../../stores/auth-store";

export default function EmailVerificationScreen() {
  const { userId } = useAuth();

  const [startTime, setStartTime] = useState(600);

  const mutation = useMutation({
    mutationFn: emailForward,
    mutationKey: ["forward"],
    onSuccess: () => {
      setStartTime(600);
    },
    onError: () => {},
  });

  useEffect(() => {
    if (startTime <= 0) return;

    const interval = setInterval(() => {
      setStartTime((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const sendForwardEmail = async () => {
    if (startTime > 0 || mutation.isPending) return;

    await mutation.mutateAsync(userId!);
  };

  const minutes = Math.floor(startTime / 60);
  const seconds = startTime % 60;

  const formattedTime = `${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;

  const canResend = startTime === 0 && !mutation.isPending;

  return (
    <SafeAreaView style={styles.screen}>
      
      <WaveBackground style={styles.wave} />
      
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/logo-recortado.png")}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>Verifica tu email</Text>

          <Text style={styles.description}>
            Hemos enviado un código de verificación a tu correo. Por favor,
            presiona el botón
            <Text style={styles.highlight}> Verificar correo</Text> para
            continuar.
          </Text>
        </View>

        <View style={styles.resendSection}>
          <View style={styles.timerContainer}>
            {startTime > 0 ? (
              <>
                <Text style={styles.timerLabel}>
                  Podrás solicitar un nuevo correo en
                </Text>

                <Text style={styles.timer}>{formattedTime}</Text>
              </>
            ) : (
              <Text style={styles.readyText}>
                Ya puedes solicitar un nuevo correo
              </Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <ButtonForm
              title={
                mutation.isPending
                  ? "Enviando..."
                  : startTime > 0
                    ? "Reenviar correo"
                    : "Reenviar correo"
              }
              action={sendForwardEmail}
              disabled={!canResend}
              isPending={mutation.isPending}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,

    position: "relative",

    backgroundColor: "#FFFFFF",
  },

  wave: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,
  },

  container: {
    flex: 1,

    width: "100%",

    alignItems: "center",

    paddingHorizontal: 24,
    paddingTop: 80,
  },

  logoContainer: {
    width: "100%",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 24,
  },

  logo: {
    width: 80,
    height: 80,

    borderRadius: 12,
  },

  infoContainer: {
    width: "100%",

    alignItems: "center",

    marginTop: 8,
  },

  title: {
    fontSize: 26,
    lineHeight: 32,

    fontWeight: "700",

    textAlign: "center",

    color: "#111827",
  },

  description: {
    width: "90%",

    marginTop: 14,

    fontSize: 15,
    lineHeight: 23,

    fontWeight: "400",

    textAlign: "center",

    color: "#6B7280",
  },

  highlight: {
    fontWeight: "700",

    color: "#111827",
  },

  resendSection: {
    width: "100%",

    alignItems: "center",

    marginTop: 36,
  },

  timerContainer: {
    minHeight: 64,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 16,
  },

  timerLabel: {
    fontSize: 13,

    textAlign: "center",

    color: "#6B7280",

    marginBottom: 4,
  },

  timer: {
    fontSize: 24,

    fontWeight: "700",

    letterSpacing: 1,

    color: "#111827",
  },

  readyText: {
    fontSize: 14,

    fontWeight: "600",

    textAlign: "center",

    color: "#374151",
  },

  buttonContainer: {
    width: "85%",
    maxWidth: 420,
  },
});
