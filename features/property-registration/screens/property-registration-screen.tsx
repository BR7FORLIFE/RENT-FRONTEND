import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WaveBackground from "../../../assets/backgrounds/wave-background.svg";
import UndoIcon from "../../../assets/icons/undo.svg";
import UploadIcon from "../../../assets/icons/upload.svg";
import { Colors } from "../../../themes/themes";

function DrapAndDropStep() {
  return (
    <Pressable
      style={{
        width: "100%",
        height: "auto",
        alignItems: "center",
        marginTop: 15,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 700 }}>
        Registra tu inmueble!
      </Text>
      <Text
        style={{
          width: "80%",
          marginTop: 12,
          textAlign: "center",
          fontWeight: "300",
        }}
      >
        Adjunta una o varias imagenes para la propiedad que deseas agregar!
      </Text>

      <View
        style={{
          width: "70%",
          height: "70%",
          borderRadius: 8,
          borderWidth: 2,
          borderColor: Colors.PRIMARY,
          marginTop: 12,
          justifyContent: "center",
          alignItems: "center",
          borderStyle: "dashed",
          gap: 4,
        }}
      >
        <UploadIcon width={70} height={70} />
        <Text
          style={{ fontSize: 14, color: Colors.NEUTRAL, fontWeight: "600" }}
        >
          Cargar Imagen
        </Text>
      </View>
    </Pressable>
  );
}

export default function PropertyRegistrationScreen() {
  const [step, setStep] = useState<number>(1);

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

      {/*boton de regresar */}
      <Pressable
        style={{ position: "absolute", top: 24, left: 24 }}
        onPress={() => router.navigate("/home/(tabs)/property-registration")}
      >
        <UndoIcon width={24} height={24} />
        <Text>Regresar</Text>
      </Pressable>

      {/*STEPS indicador */}
      <View style={{ position: "absolute", right: 24, top: 24 }}>
        <Text>{`Step ${step}  / 7`}</Text>
      </View>

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
          {step === 1 && <DrapAndDropStep />}
          <View style={{ width: "80%", marginTop: 30 }}></View>
        </View>
      </View>
    </SafeAreaView>
  );
}
