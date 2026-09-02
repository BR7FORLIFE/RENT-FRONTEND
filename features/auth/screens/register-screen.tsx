import { Picker } from "@react-native-picker/picker";
import { useMutation } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ButtonForm } from "../../../components/buttons/button";
import { Input } from "../../../components/inputs/input";
import type { KeyInput } from "../../../constants/constants";
import { register } from "../../../core/api/api-endpoints";
import type { RegisterType } from "../../../core/schemas/auth-schema";
import { useAuth } from "../../../stores/auth-store";
import { Colors } from "../../../themes/themes";

import type { AxiosError } from "axios";
import type { ApiError } from "../../../types/global";
import
  {
    FormInfoStorage,
    InfoStorage,
    validateContentData,
    validateRegisterFields,
  } from "../services/auth.service";

const keyInputs: KeyInput[] = [
  {
    field: "fullname",
    label: "Nombre Completo",
    placeholder: "ej: Bryan Diaz",
  },
  {
    field: "username",
    label: "Usuario",
    placeholder: "ej: br7forlife",
  },
  {
    field: "cellphone",
    label: "Celular",
    placeholder: "ej: +57 311999888",
  },
  {
    field: "email",
    label: "Direccion de correo",
    placeholder: "test@gmail.com",
  },
  {
    field: "identificationNumber",
    label: "Numero de identificacion",
    placeholder: "digita tu numero de identificacion",
  },
  {
    field: "password",
    label: "Constraseña",
    placeholder: "tu contraseña",
  },
];

export default function RegisterScreen() {
  const { setId } = useAuth();
  const [info, setInfo] = useState<RegisterType>({
    cellphone: "",
    email: "",
    fullname: "",
    identificationNumber: "",
    identificationType: "CC",
    password: "",
    username: "",
  });
  //activar o desctivar el boton de register si la informacion es correcta
  const [isCompleteFields, setCompleteFields] = useState<boolean>(false);

  //mutation para cambiar la informacion en el servidor
  const mutation = useMutation({
    mutationFn: register,
    mutationKey: ["register"],
    onSuccess: (data) => {
      setId(data.userId);
      //establecemos la informacion en el storage
      InfoStorage().set({ userId: data.userId, refreshToken: null });
      router.navigate("/auth/email");
    },
    onError: (err: AxiosError<ApiError>) => {
      const data = err.response?.data;

      if (data) {
        Toast.show({
          text1: data.message,
          type: "error",
        });
      }
    },
  });

  //la primera vez que se monta el componente necesitamos recuperar la informacion del storage (si aplica)
  useEffect(() => {
    const getData = async () => {
      const data = await FormInfoStorage().get();

      if (data) {
        setInfo(data);
      }
    };
    getData();
  }, []);

  //tratamiento de la informacion y normalizacion
  const handleSetInfo = async (id: string, value: string) => {
    const nextInfo = {
      ...info,
      [id]: value,
    };

    setInfo(nextInfo);

    //activar el boton de registrarse si todos los campos estan rellenados
    const { contentResult, emptyFields } = validateContentData(nextInfo);

    if (contentResult) {
      FormInfoStorage().set(contentResult);
      setCompleteFields(true); // campos rellanaods
      return;
    }

    if (emptyFields) {
      setCompleteFields(false); // desactivamos el boton ya que los campos no estan rellenados

      //notificamos al usuario sobre los campos que necesitan ser rellenados

      return;
    }
  };

  //funcion de envio de datos al servidor
  const handleSubmit = async () => {
    //validamos la estrasync uctura de la informacion
    const result = validateRegisterFields(info);

    if (!result.success) {
      Toast.show({
        text2: "Digite un correo electronico valido!",
        type: "info",
      });
    }

    //enviamos la peticion al servidor
    await mutation.mutateAsync(info);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        {/* contenedor de imagen */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/logo-recortado.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* contenedor de formulario */}
        <View style={styles.containerForm}>
          {/* zona de textos y titulos */}
          <View style={styles.containerText}>
            <Text style={styles.containerFormTitle}>Regístrate</Text>

            <Text style={styles.description}>
              Únete a la mejor plataforma de administración de arriendos y
              disfruta de sus beneficios
            </Text>
          </View>

          {/* contenedor de inputs */}
          <View style={styles.containerInput}>
            {keyInputs.map(({ field, label, placeholder }) => {
              if (field === "cellphone") {
                return (
                  <Input
                    key={field}
                    field={field}
                    label={label}
                    placeholder={placeholder}
                    fn={handleSetInfo}
                    value={info[field]}
                    typeInput="number-pad"
                    maxLength={10}
                  />
                );
              }

              if (field === "identificationNumber") {
                return (
                  <Input
                    key={field}
                    field={field}
                    label={label}
                    placeholder={placeholder}
                    fn={handleSetInfo}
                    value={info[field]}
                    typeInput="number-pad"
                    maxLength={12}
                  />
                );
              }

              if (field === "email") {
                return (
                  <Input
                    key={field}
                    field={field}
                    label={label}
                    placeholder={placeholder}
                    fn={handleSetInfo}
                    value={info[field]}
                    typeInput="email-address"
                  />
                );
              }

              return (
                <Input
                  key={field}
                  field={field}
                  label={label}
                  placeholder={placeholder}
                  fn={handleSetInfo}
                  value={info[field]}
                />
              );
            })}
          </View>

          {/* selección de identificación */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Tipo de identificación</Text>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={info.identificationType}
                onValueChange={(itemValue, _) =>
                  handleSetInfo("identificationType", itemValue)
                }
                style={styles.picker}
              >
                <Picker.Item label="CC" value="CC" />
                <Picker.Item label="CE" value="CE" />
                <Picker.Item label="TI" value="TI" />
                <Picker.Item
                  label="Permiso especial de permanencia"
                  value="PPT"
                />
                <Picker.Item label="Pasaporte" value="PASSPORT" />
              </Picker>
            </View>
          </View>

          <View style={styles.buttonSection}>
            <ButtonForm
              title="Registrarse"
              action={handleSubmit}
              disabled={!isCompleteFields || mutation.isPending}
              isPending={mutation.isPending}
            />

            <Text style={styles.orText}>Or</Text>

            <View style={styles.loginRedirect}>
              <Text style={styles.loginText}>¿Tienes una cuenta?</Text>

              <Link href="/auth/login" style={styles.loginLink}>
                Iniciar sesión
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    flexGrow: 1,

    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },

  // Logo
  logoContainer: {
    width: "100%",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  logo: {
    width: 64,
    height: 64,
  },

  shadowContainer: {
    width: 64,
    height: 16,

    shadowColor: Colors.SECONDARY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 5,
  },

  // Formulario global
  containerForm: {
    width: "100%",

    paddingHorizontal: 16,
    paddingVertical: 20,

    borderWidth: 1,
    borderColor: "#0000001A",
    borderRadius: 20,

    backgroundColor: "#FFFFFF",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  // Textos
  containerText: {
    width: "100%",

    gap: 6,

    marginBottom: 28,
  },

  containerFormTitle: {
    fontFamily: "arimo",

    fontSize: 24,
    lineHeight: 30,

    fontStyle: "normal",
    fontWeight: "800",

    color: "#111827",
  },

  description: {
    width: "100%",

    fontSize: 14,
    lineHeight: 21,

    fontWeight: "400",

    color: "#6B7280",
  },

  // Inputs
  containerInput: {
    width: "100%",

    flexDirection: "column",

    gap: 22,

    marginBottom: 24,
  },

  // Picker
  pickerContainer: {
    width: "100%",

    marginBottom: 28,
  },

  pickerLabel: {
    marginBottom: 8,

    fontSize: 14,
    fontWeight: "600",

    color: "#374151",
  },

  pickerWrapper: {
    width: "100%",
    height: 52,

    overflow: "hidden",

    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.NEUTRAL,
    borderRadius: 8,

    backgroundColor: "#FFFFFF",
  },

  picker: {
    width: "100%",
    height: 52,

    color: "#111827",
  },

  // Botón
  buttonSection: {
    width: "100%",

    alignItems: "center",
    justifyContent: "center",

    gap: 10,
  },

  orText: {
    fontSize: 13,

    color: "#9CA3AF",

    marginVertical: 2,
  },

  loginRedirect: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 5,

    marginTop: 2,
  },

  loginText: {
    fontSize: 14,

    color: "#6B7280",
  },

  loginLink: {
    fontSize: 14,

    fontWeight: "600",

    color: Colors.TERTIARY,
  },
});
