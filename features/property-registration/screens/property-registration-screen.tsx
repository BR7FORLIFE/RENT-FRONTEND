import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import WaveBackground from "../../../assets/backgrounds/wave-background.svg";
import SplashScreen from "../../../components/splash-screen";
import { queryClient } from "../../../core/configs/tanstackconfig";
import type { ApiError } from "../../../types/global";
import { saveProperty } from "../api";
import { BackButton } from "../components/display";
import
    {
        DirectionStep,
        DrapAndDropStep,
        EconomicPropertyInfo,
        FmiAndPredialNumberStep,
        PropertyInfo,
        StructurePropertyInfo,
        TypeAndOccupationStep,
    } from "../components/property-registration/steps";
import type { CreatePropertyType } from "../schemas/property-registration.schema";
import { resourcesImageStorage } from "../services/property-registration.domain.service";
import { uploadImagesToCloudinary } from "../services/property-registration.service";

export interface RegisterFormData {
  saveData: React.Dispatch<
    React.SetStateAction<Partial<CreatePropertyType> | undefined>
  >;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}
export default function PropertyRegistrationScreen() {
  const [proccesing, setProccesing] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  //estado que nos permitira renderizar un splash screen cuando se este generando el proceso de registro
  const [isCreateProperty, setIsCreateProperty] = useState<boolean>(false);
  const [registerForm, setRegisterForm] =
    useState<Partial<CreatePropertyType>>();

  //mandar la informacion al servidor
  const mutation = useMutation({
    mutationFn: saveProperty,
    mutationKey: ["property", "create"],
    onError: (err: AxiosError<ApiError>) => {},
    onSuccess: () => {
      setProccesing(false);
      resourcesImageStorage().clean(); //limpiamos el storage de imagenes
      Toast.show({
        type: "success",
        text2: "Propiedad registrada exitosamente",
        visibilityTime: 1500,
      });

      //invalidamos la cache con su respectivo queryKey ya que con eso podemos
      // recopilar la nueva informacion del servidor
      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });

      router.navigate("/home/(tabs)/property-registration");
    },
  });

  const cleanSteps = async () => {
    await resourcesImageStorage().clean();
    router.navigate("/home/(tabs)/property-registration");
  };

  const registerProperty = async () => {
    setProccesing(true);
    // (IMPORTANTE EVALUAR SI NO HAY IMAGENES PUES CREARLO DE TODAS FORMAS)
    //logica para subir las imagenes a cloudinary
    const cloudImageInfo = await uploadImagesToCloudinary();

    const property = {
      ...registerForm,
      resourcesImages: cloudImageInfo,
    };
    setRegisterForm(property);

    //mandamos al servidor el objeto completo del inmueble a registrar
    await mutation.mutateAsync(property as Partial<CreatePropertyType>);
  };

  //efecto para saber si el usuario acepto crear el inmueble y asi ejecutar la funcion
  useEffect(() => {
    if (!isCreateProperty) return;
    registerProperty();
  }, [isCreateProperty]);

  if (proccesing) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <WaveBackground style={styles.wave} />
      <BackButton action={cleanSteps} />

      <View style={styles.stepIndicator}>
        <Text style={styles.stepText}>{`Step ${step} / 7`}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/logo-recortado.png")}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>

        <View style={styles.stepContainer}>
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
            <StructurePropertyInfo
              saveData={setRegisterForm}
              setStep={setStep}
            />
          )}

          {step === 6 && (
            <EconomicPropertyInfo
              saveData={setRegisterForm}
              setStep={setStep}
            />
          )}

          {step === 7 && (
            <TypeAndOccupationStep
              disabled={proccesing}
              saveData={setRegisterForm}
              setIsCreateProperty={setIsCreateProperty}
            />
          )}
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

    zIndex: 0,
  },

  backButton: {
    position: "absolute",

    top: 30,
    left: 20,

    zIndex: 10,

    flexDirection: "row",

    alignItems: "center",

    gap: 6,

    paddingVertical: 8,
    paddingHorizontal: 10,

    borderRadius: 10,

    backgroundColor: "#FFFFFF",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 3,
  },

  backButtonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.75,
  },

  backText: {
    fontSize: 13,

    fontWeight: "600",

    color: "#374151",
  },

  stepIndicator: {
    position: "absolute",

    top: 30,
    right: 20,

    zIndex: 10,

    paddingVertical: 8,
    paddingHorizontal: 12,

    borderRadius: 20,

    backgroundColor: "#F3F4F6",
  },

  stepText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
  },

  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",

    marginBottom: 14,
  },

  logo: {
    width: 64,
    height: 64,

    borderRadius: 12,
  },

  stepContainer: {
    width: "100%",
    maxWidth: 500,

    flex: 1,

    alignItems: "center",
    justifyContent: "flex-start",

    paddingHorizontal: 4,
  },
});
