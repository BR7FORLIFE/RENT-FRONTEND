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
    <SafeAreaView style={{ flex: 1, position: "relative" }}>
      {/*contenedor de la imagen */}
      <View style={{ position: "relative" }}>
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
          colors={["transparent", "rgb(216, 216, 216)"]}
          style={styles.gradientBottom}
        />
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
          }}
        >
          <Image
            source={require("../../../assets/images/logo-recortado.png")}
            resizeMode="cover"
            style={{ width: 64, height: "auto", aspectRatio: 1 }}
          />

          <Text style={{ fontSize: 28, fontWeight: 600 }}>
            Bienvenido de nuevo
          </Text>

          <Text>Inicia sesión para continuar</Text>
        </View>

        {/*seccion del formulario de login */}
        <View
          style={{
            width: "100%",
            height: "auto",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffffcd",
            borderRadius: 24,
            gap: 24,
            paddingHorizontal: 12,
            paddingVertical: 36,
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
    aspectRatio: 1,
    width: "100%",
    height: "auto",
    borderRadius: 12,
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
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
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
