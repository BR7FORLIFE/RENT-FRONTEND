import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "../../../components/inputs/input";
import type { KeyInput } from "../../../constants/constants";

//images
import { Link, router } from "expo-router";
import EmailIcon from "../../../assets/icons/email-icon.svg";
import SeeIconPassword from "../../../assets/icons/eye-icon.svg";
import { ButtonForm } from "../../../components/buttons/button";
import { Colors } from "../../../themes/themes";
import { GoogleAuthButton } from "../components/auth-provider";

import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import WaveBackground from "../../../assets/backgrounds/wave-background.svg";
import { login } from "../../../core/api/api-endpoints";
import { AUTHPATHS } from "../../../core/api/paths";
import type { LoginType } from "../../../core/schemas/auth-schema";
import { useAuth } from "../../../stores/auth-store";
import type { ApiError } from "../../../types/global";
import { FormInfoStorage, InfoStorage } from "../services/auth.service";

const email: KeyInput = {
  field: "email",
  label: "email",
  placeholder: "digita tu correo",
};

const password: KeyInput = {
  field: "password",
  label: "password",
  placeholder: "digite su contraseña",
};

function LoginScreen() {
  const { setAccessToken } = useAuth();

  const [info, setInfo] = useState<LoginType>({
    email: "",
    password: "",
  });

  //Montamos el correo el electronico para mejor UX
  useEffect(() => {
    const setEmailInput = async () => {
      const form = await FormInfoStorage().get();
      if (form) {
        const { email } = form;
        setInfo((prev) => ({ ...prev, email }));
      }
    };
    setEmailInput();
  }, []);

  const mutation = useMutation({
    mutationFn: login,
    mutationKey: ["login"],
    onError: (err: AxiosError<ApiError>) => {
      const data = err.response?.data;
      if (data) {
        Toast.show({
          type: "error",
          text2: data.message,
        });
      }
    },
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data;
      setAccessToken(accessToken);

      //persistimos la informacion en el Async Storage
      InfoStorage().set({ userId: null, refreshToken });

      router.navigate("/home/(tabs)/property-registration");
    },
  });

  const handleInfoLogin = (id: string, value: string) => {
    const nextInfo = { ...info, [id]: value };
    setInfo(nextInfo);
  };

  const submitLogin = async () => {
    await mutation.mutateAsync(info);
  };

  const oauth2Login = async () => {
    await WebBrowser.openAuthSessionAsync(
      AUTHPATHS.oauth2.authorization,
      "rentfrontend://login/oauth2/callback",
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.backgroundImageContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={require("../../../assets/images/login-house-image.jpg")}
            resizeMode="cover"
            style={styles.image}
          />

          <LinearGradient
            colors={["#FFFFFF", "transparent"]}
            style={styles.gradientTop}
          />

          <LinearGradient
            colors={["rgba(255,255,255,0.01)", "#FFFFFF"]}
            style={styles.gradientBottom}
          />
        </View>

        <View style={styles.waveContainer}>
          <WaveBackground />
        </View>
      </View>

      <View style={styles.containerInfo}>
        <View style={styles.headerInfo}>
          <Image
            source={require("../../../assets/images/logo-recortado.png")}
            resizeMode="contain"
            style={styles.logo}
          />

          <Text style={styles.title}>Bienvenido de nuevo</Text>

          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        <View style={styles.loginCard}>
          <View style={styles.loginFormSection}>
            <Input
              field={email.field}
              label={email.label}
              placeholder={email.placeholder}
              fn={handleInfoLogin}
              value={info.email}
              key={email.field}
              typeInput="email-address"
            />

            <EmailIcon
              width={22}
              height={22}
              style={styles.loginFormSectionImage}
            />
          </View>

          <View style={styles.loginFormSection}>
            <Input
              field={password.field}
              label={password.label}
              placeholder={password.placeholder}
              fn={handleInfoLogin}
              value={info.password}
              key={password.field}
              typeInput="default"
            />

            <SeeIconPassword
              width={22}
              height={22}
              style={styles.loginFormSectionImage}
            />
          </View>

          <ButtonForm
            action={submitLogin}
            title={
              mutation.isPending ? "Iniciando sesión..." : "Iniciar sesión"
            }
          />

          <View style={styles.providersSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.decorativeBarrer} />

              <Text style={styles.dividerText}>o continúa con</Text>

              <View style={styles.decorativeBarrer} />
            </View>

            <GoogleAuthButton action={oauth2Login} />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes cuenta?</Text>

              <Link href={"/register"} style={styles.registerLink}>
                Regístrate
              </Link>
            </View>
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

  backgroundImageContainer: {
    ...StyleSheet.absoluteFillObject,
  },

  imageWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 360,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },

  gradientBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 220,
  },

  waveContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  containerInfo: {
    flex: 1,
    justifyContent: "flex-end",

    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  headerInfo: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",

    marginBottom: 20,
  },

  logo: {
    width: 60,
    height: 60,

    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",

    textAlign: "center",
    color: "#111827",

    marginBottom: 4,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "400",

    textAlign: "center",
    color: "#6B7280",
  },

  loginCard: {
    width: "100%",

    paddingHorizontal: 16,
    paddingVertical: 28,

    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#0000001A",

    backgroundColor: "#FFFFFF",

    gap: 20,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,

    elevation: 6,
  },

  loginFormSection: {
    position: "relative",
    width: "100%",
  },

  loginFormSectionImage: {
    position: "absolute",

    right: 12,
    top: 14,
  },

  providersSection: {
    width: "100%",

    alignItems: "center",
    justifyContent: "center",
  },

  dividerContainer: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 16,
  },

  decorativeBarrer: {
    flex: 1,

    height: 1,

    backgroundColor: "#D1D5DB",
  },

  dividerText: {
    marginHorizontal: 10,

    fontSize: 14,
    color: "#6B7280",
  },

  registerContainer: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 6,

    marginTop: 12,
  },

  registerText: {
    fontSize: 14,
    color: "#6B7280",
  },

  registerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.TERTIARY,
  },
});

export default LoginScreen;
