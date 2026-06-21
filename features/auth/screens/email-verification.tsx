import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import WaveBackground from "../../../assets/backgrounds/wave-background.svg";
import { ButtonForm } from "../../../components/buttons/button";
import { emailForward } from "../../../core/api/api-endpoints";
import { useAuth } from "../../../stores/auth-store";

export default function EmailVerificationScreen() {
  const { userId } = useAuth();
  const [startTime, setStartTime] = useState<number>(60);

  const mutation = useMutation({
    mutationFn: emailForward,
    mutationKey: ["forward"],
    onSuccess: () => {},
    onError: () => {},
  });

  const sendForwardEmail = async () => {
    console.log(userId);
    await mutation.mutateAsync(userId!);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        position: "relative",
        backgroundColor: "#fff",
      }}
    >
      <WaveBackground style={{ position: "absolute", bottom: 0 }} />
      <View
        style={{
          width: "100%",
          position: "absolute",
          zIndex: 1,
          marginTop: 100,
        }}
      >
        {/*seccion de logo */}
        <View
          style={{
            width: "100%",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../../assets/images/logo-recortado.png")}
            resizeMode="cover"
            style={{
              width: 80,
              height: "auto",
              aspectRatio: 1,
              borderRadius: 12,
            }}
          />
        </View>
        {/*Texto de informacion de verificacion de email */}
        <View style={{ width: "100%", alignItems: "center", marginTop: 15 }}>
          <Text style={{ fontSize: 24, fontWeight: 700 }}>
            Verifica tu email
          </Text>
          <Text
            style={{
              width: "80%",
              marginTop: 12,
              textAlign: "center",
              fontWeight: "300",
            }}
          >
            Hemos enviado un código de verificacion a tu correo. Por favor,
            presione el boton <Text>Verificar correo</Text> para continuar.
          </Text>
        </View>
        {/*boton de reenvio de correo + timer */}
        <View style={{ width: "100%", alignItems: "center", marginTop: 30 }}>
          <View style={{ width: "80%" }}>
            <ButtonForm title="Reenviar correo" action={sendForwardEmail} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
