import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import WaveBackground from "../../../assets/backgrounds/wave-background.svg";
import UndoIcon from "../../../assets/icons/undo.svg";
import SplashScreen from "../../../components/splash-screen";
import { queryClient } from "../../../core/configs/tanstackconfig";
import type { ApiError } from "../../../types/global";
import { saveProperty } from "../api";
import
  {
    DirectionStep,
    DrapAndDropStep,
    EconomicPropertyInfo,
    FmiAndPredialNumberStep,
    PropertyInfo,
    StructurePropertyInfo,
    TypeAndOccupationStep,
  } from "../components/steps";
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
        <Text>{`Step ${step}  / 6`}</Text>
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
          <View style={{ width: "80%", marginTop: 30 }}></View>
        </View>
      </View>
    </SafeAreaView>
  );
}
