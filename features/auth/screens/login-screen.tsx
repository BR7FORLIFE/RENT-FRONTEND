import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../../../components/inputs/input";
import type { KeyInput } from "../../../constants/constants";

//images
import { Link } from "expo-router";
import EmailIcon from "../../../assets/icons/email-icon.svg";
import SeeIconPassword from "../../../assets/icons/eye-icon.svg";
import { ButtonForm } from "../../../components/buttons/button";
import { Colors } from "../../../themes/themes";
import { GoogleAuthButton } from "../components/auth-provider";

import WaveBackground from "../../../assets/backgrounds/wave-background.svg";

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
  return (
    <SafeAreaView
      style={{ flex: 1, position: "relative", backgroundColor: "#fff" }}
    >
      {/*contenedor de la imagen */}
      <View
        style={{
          position: "absolute",
          top: 0,
        }}
      >
        <View
          style={{
            position: "relative",
            zIndex: 1,
            height: 400,
            width: "100%",
          }}
        >
          <Image
            source={require("../../../assets/images/login-house-image.jpg")}
            resizeMode="cover"
            style={styles.image}
          />
          <LinearGradient
            colors={["white", "transparent"]}
            style={styles.gradientTop}
          />
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.01)", "rgb(255, 255, 255)"]}
            style={styles.gradientBottom}
          />
        </View>
      </View>

      {/*background view  */}
      <View style={{ position: "absolute", bottom: 0 }}>
        <WaveBackground />
      </View>

      {/*Contenedor principal de titulo, formulario, y links */}
      <View style={styles.containerInfo}>
        {/*titulo y descripcion del login */}
        <View
          style={{
            width: "100%",
            height: "auto",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 24,
          }}
        >
          <Image
            source={require("../../../assets/images/logo-recortado.png")}
            resizeMode="cover"
            style={{ width: 64, height: "auto", aspectRatio: 1 }}
          />

          <Text style={{ fontSize: 28, fontWeight: 800 }}>
            Bienvenido de nuevo
          </Text>

          <Text style={{ fontWeight: 400 }}>Inicia sesión para continuar</Text>
        </View>

        {/*seccion del formulario de login */}
        <View
          style={{
            width: "100%",
            height: "auto",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            borderRadius: 24,
            gap: 24,
            paddingHorizontal: 12,
            paddingVertical: 36,
            borderWidth: 1,
            borderColor: "#00000029",
            marginBottom: 50,
            marginTop: 24,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 6,
          }}
        >
          <View style={styles.loginFormSection}>
            {/*input de email */}
            <Input
              field={email.field}
              label={email.label}
              placeholder={email.placeholder}
              fn={() => null}
              value=""
              key={email.field}
              typeInput="default"
            />

            <EmailIcon
              width={24}
              height={24}
              style={styles.loginFormSectionImage}
            />
          </View>
          {/*input de password */}
          <View style={styles.loginFormSection}>
            <Input
              field={password.field}
              label={password.label}
              placeholder={password.placeholder}
              fn={() => null}
              value=""
              key={password.field}
              typeInput="default"
            />
            <SeeIconPassword
              width={24}
              height={24}
              style={styles.loginFormSectionImage}
            />
          </View>
          {/*boton de login */}
          <ButtonForm action={() => null} title="Iniciar sesión" />

          {/*estilos de la seccion de auth providers */}
          <View
            style={{
              width: "100%",
              height: "auto",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "100%",
                height: "auto",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <View style={styles.decorativeBarrer}></View>
              <Text style={{ marginHorizontal: 3, fontSize: 14 }}>
                o continúa con
              </Text>
              <View style={styles.decorativeBarrer}></View>
            </View>

            <GoogleAuthButton title="Continua con Google" />
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                marginTop: 12,
              }}
            >
              <Text>¿No tienes cuenta?</Text>
              <Link
                href={"/register"}
                style={{ color: Colors.TERTIARY, fontWeight: 600 }}
              >
                Registrate
              </Link>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    height: 400,
  },
  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 320,
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 500,
  },

  containerInfo: {
    position: "absolute",
    zIndex: 1,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignContent: "center",
    inset: 0,
    marginHorizontal: 24,
    marginBottom: 24,
    height: "auto",
  },

  loginFormSection: {
    position: "relative",
    width: "100%",
  },

  loginFormSectionImage: {
    position: "absolute",
    top: 12,
    bottom: 0,
    right: 12,
  },

  decorativeBarrer: {
    flex: 1,
    maxWidth: 80,
    height: 1,
    backgroundColor: "black",
  },
});

export default LoginScreen;
