import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import WaveBackground from "../../../assets/backgrounds/wave-background.svg";
import SplashScreen from "../../../components/splash-screen";
import { queryClient } from "../../../core/configs/tanstackconfig";
import type { ApiError } from "../../../types/global";
import { SaveProperty } from "../api";
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
import { resourcesStorage } from "../services/property-registration.domain.service";
import { uploadImagesToCloudinary } from "../services/property-registration.service";

export interface RegisterFormData {
  saveData: React.Dispatch<
    React.SetStateAction<Partial<CreatePropertyType> | undefined>
  >;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  //lo ya capturado, para precargar un paso cuando el usuario regresa
  data?: Partial<CreatePropertyType>;
}

const TOTAL_STEPS = 7;
export default function PropertyRegistrationScreen() {
  const [proccesing, setProccesing] = useState<boolean>(false);
  const [isCreateProperty, setIsCreateProperty] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [registerForm, setRegisterForm] =
    useState<Partial<CreatePropertyType>>();

  //mandar la informacion al servidor
  const mutation = useMutation({
    mutationFn: SaveProperty,
    mutationKey: ["property", "create"],
    onError: (err: AxiosError<ApiError>) => {
      Toast.show({
        type: "error",
        text2:
          err.response?.data?.message ??
          "No se pudo registrar la propiedad. Inténtalo de nuevo.",
      });
    },
    onSuccess: () => {
      resourcesStorage().clean(); //limpiamos el storage de imagenes
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
    await resourcesStorage().clean();
    router.navigate("/home/(tabs)/property-registration");
  };

  //regresa al paso anterior; en el primer paso sale del registro
  const goBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
      return;
    }
    cleanSteps();
  };

  useEffect(() => {
    if (!isCreateProperty) return;

    const registerProperty = async () => {
      setProccesing(true);

      try {
        let cloudImageInfo;

        try {
          //subimos las imagenes a cloudinary (puede no haber ninguna)
          cloudImageInfo = await uploadImagesToCloudinary();
        } catch {
          Toast.show({
            type: "error",
            text2: "No se pudieron subir las imágenes. Inténtalo de nuevo.",
          });
          return;
        }

        const property = {
          ...registerForm,
          resources: cloudImageInfo,
        };

        //mandamos al servidor el objeto completo del inmueble a registrar
        await mutation.mutateAsync(property as Partial<CreatePropertyType>);
      } catch {
        //el error del servidor ya lo notifica el onError de la mutation
      } finally {
        //siempre salimos del splash, incluso si algo falla
        setProccesing(false);
        setIsCreateProperty(false);
      }
    };

    registerProperty();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateProperty]);

  if (proccesing) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <WaveBackground style={styles.wave} />

      <View style={styles.topBar}>
        <BackButton action={goBack} />

        <Text style={styles.stepText}>{`Paso ${step} de ${TOTAL_STEPS}`}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${(step / TOTAL_STEPS) * 100}%` },
          ]}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.stepContainer}>
          {step === 1 && (
            <DrapAndDropStep
              saveData={setRegisterForm}
              setStep={setStep}
              data={registerForm}
            />
          )}

          {step === 2 && (
            <DirectionStep
              saveData={setRegisterForm}
              setStep={setStep}
              data={registerForm}
            />
          )}

          {step === 3 && (
            <FmiAndPredialNumberStep
              saveData={setRegisterForm}
              setStep={setStep}
              data={registerForm}
            />
          )}

          {step === 4 && (
            <PropertyInfo
              saveData={setRegisterForm}
              setStep={setStep}
              data={registerForm}
            />
          )}

          {step === 5 && (
            <StructurePropertyInfo
              saveData={setRegisterForm}
              setStep={setStep}
              data={registerForm}
            />
          )}

          {step === 6 && (
            <EconomicPropertyInfo
              saveData={setRegisterForm}
              setStep={setStep}
              data={registerForm}
            />
          )}

          {step === 7 && (
            <TypeAndOccupationStep
              disabled={proccesing}
              saveData={setRegisterForm}
              setIsCreateProperty={setIsCreateProperty}
              data={registerForm}
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
    backgroundColor: "#FFFFFF",
  },

  wave: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },

  stepText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },

  progressTrack: {
    height: 4,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
  },

  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#2563EB",
  },

  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  stepContainer: {
    width: "100%",
    maxWidth: 500,
    flex: 1,
  },
});
