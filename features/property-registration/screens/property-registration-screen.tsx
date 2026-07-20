import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WaveBackground from "../../../assets/backgrounds/wave-background.svg";
import UndoIcon from "../../../assets/icons/undo.svg";
import
  {
    DirectionStep,
    DrapAndDropStep,
    FmiAndPredialNumberStep,
    PropertyInfo,
    TypeAndOccupationStep,
  } from "../components/steps";
import type { CreatePropertyType } from "../schemas/property-registration.schema";
import { resourcesImageStorage } from "../services/property-registration.service";

export interface RegisterFormData {
  saveData: React.Dispatch<
    React.SetStateAction<CreatePropertyType | undefined>
  >;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function PropertyRegistrationScreen() {
  const [step, setStep] = useState<number>(5);
  //estado que nos permitira renderizar un splash screen cuando se este generando el proceso de registro
  const [isCreateProperty, setIsCreateProperty] = useState<boolean>(false);
  const [registerForm, setRegisterForm] = useState<CreatePropertyType>();

  const cleanSteps = async () => {
    await resourcesImageStorage().clean();
    router.navigate("/home/(tabs)/property-registration");
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

      {/*boton de regresar */}
      <Pressable
        style={{ position: "absolute", top: 24, left: 24 }}
        onPress={cleanSteps}
      >
        <UndoIcon width={24} height={24} />
        <Text>Regresar</Text>
      </Pressable>

      {/*STEPS indicador */}
      <View style={{ position: "absolute", right: 24, top: 24 }}>
        <Text>{`Step ${step}  / 5`}</Text>
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
          {/* 7 Steps para poder registrar un inmueble */}
          {step === 1 && (
            <DrapAndDropStep saveData={setRegisterForm} setStep={setStep} />
          )}
          {step === 2 && (
            <DirectionStep saveData={setRegisterForm} setStep={setStep} />
          )}
          {step === 3 && (
            <FmiAndPredialNumberStep
              saveData={setRegisterForm}
              setStep={setStep}
            />
          )}
          {step === 4 && (
            <PropertyInfo saveData={setRegisterForm} setStep={setStep} />
          )}
          {step === 5 && (
            <TypeAndOccupationStep
              setStep={setStep}
              saveData={setRegisterForm}
              setIsCreateProperty={setIsCreateProperty}
            />
          )}
          <View style={{ width: "80%", marginTop: 30 }}></View>
        </View>
      </View>
    </SafeAreaView>
  );
}
