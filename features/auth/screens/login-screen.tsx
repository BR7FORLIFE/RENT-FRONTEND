import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "../../../components/inputs/input";
import type { KeyInput } from "../../../constants/constants";

//images
import { Link, router } from "expo-router";
import EmailIcon from "../../../assets/icons/email-icon.svg";
import SeeIconPasswordHide from "../../../assets/icons/eye-icon-hide.svg";
import SeeIconPassword from "../../../assets/icons/eye-icon.svg";
import { ButtonForm } from "../../../components/buttons/button";
import { Palette } from "../../../themes/themes";
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
  label: "Correo electrónico",
  placeholder: "tu@correo.com",
};

const password: KeyInput = {
  field: "password",
  label: "Contraseña",
  placeholder: "Tu contraseña",
};

function LoginScreen() {
  const { setAccessToken } = useAuth();
  const [info, setInfo] = useState<LoginType>({
    email: "",
    password: "",
  });
  const [isHidePassword, setIsHidePassword] = useState(true);
  const disabledButton = info.email.length === 0 || info.password.length === 0;

  const hidePasswordHandle = () => {
    setIsHidePassword((prev) => !prev);
  };

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
        </View>

        <View style={styles.loginCard}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Inicia sesión</Text>
            <Text style={styles.subtitle}>
              Bienvenido de nuevo. Gestiona tus propiedades y contratos.
            </Text>
          </View>

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
              secureTextEntry={isHidePassword}
            />

            <Pressable
              style={styles.loginFormSectionImage}
              onPress={hidePasswordHandle}
            >
              {isHidePassword ? (
                <SeeIconPasswordHide width={22} height={22} />
              ) : (
                <SeeIconPassword width={22} height={22} />
              )}
            </Pressable>
          </View>

          <ButtonForm
            variant="primary"
            isPending={mutation.isPending}
            action={submitLogin}
            title="Iniciar sesión"
            disabled={disabledButton}
          />

          <View style={styles.providersSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.decorativeBarrer} />

              <Text style={styles.dividerText}>o</Text>

              <View style={styles.decorativeBarrer} />
            </View>

            <GoogleAuthButton action={oauth2Login} />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes cuenta?</Text>

              <Link href={"/auth/register"} style={styles.registerLink}>
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
    position: "relative",
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

  titleBlock: {
    gap: 4,
  },

  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: Palette.textPrimary,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textMuted,
  },

  loginCard: {
    width: "100%",

    paddingHorizontal: 20,
    paddingVertical: 24,

    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.border,

    backgroundColor: "#FFFFFF",

    gap: 18,

    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,

    elevation: 3,
  },

  loginFormSection: {
    position: "relative",
    width: "100%",
  },

  loginFormSectionImage: {
    position: "absolute",

    right: 14,
    top: 15,
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

    backgroundColor: Palette.border,
  },

  dividerText: {
    marginHorizontal: 10,

    fontSize: 13,
    color: Palette.textMuted,
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
    color: Palette.textMuted,
  },

  registerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.accent,
  },
});

export default LoginScreen;
