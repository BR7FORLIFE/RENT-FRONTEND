import { Picker } from "@react-native-picker/picker";
import { useMutation } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ButtonForm } from "../../../components/buttons/button";
import Input from "../../../components/inputs/input";
import type { KeyInput } from "../../../constants/constants";
import { register } from "../../../core/api/api-endpoints";
import type { RegisterType } from "../../../core/schemas/auth-schema";
import { useAuth } from "../../../stores/auth-store";
import { Colors } from "../../../themes/themes";

import type { AxiosError } from "axios";
import type { ApiError } from "../../../types/global";
import
  {
    fieldsNotValid,
    FormInfoStorage,
    InfoStorage,
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
  // desactivar el boton cuando se haga una peticion http
  const [isPending, setIsPending] = useState<boolean>(false);

  //mutation para cambiar la informacion en el servidor
  const mutation = useMutation({
    mutationFn: register,
    mutationKey: ["register"],
    onSuccess: (data) => {
      setId(data.userId);
      //establecemos la informacion en el storage
      InfoStorage().set({ userId: data.userId, refreshToken: null });
      router.navigate("/email");
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
    const fieldsListNotValid = fieldsNotValid(nextInfo);

    if (fieldsListNotValid.length === 0) {
      setCompleteFields(true);
      return;
    }

    setCompleteFields(false);

    FormInfoStorage().set(nextInfo);
  };

  //funcion de envio de datos al servidor
  const handleSubmit = async () => {
    setIsPending(true);
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
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        gap: 12,
        backgroundColor: "#fff",
      }}
    >
      <ScrollView>
        {/*contenedor de imagen */}
        <View style={styles.logoContainer}>
          <View style={styles.shadowContainer}>
            <Image
              source={require("../../../assets/images/logo-recortado.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
        {/*contenedor de formulario */}
        <View style={styles.containerForm}>
          {/*zona de textos y titulos */}
          <View style={styles.containerText}>
            <Text style={styles.containerFormTitle}>Registrate</Text>
            <Text style={{ width: "95%" }}>
              Unete a la mejor plataforma de admistracion de arriendos y
              disfruta de sus beneficios
            </Text>
          </View>

          {/*contenedor de inputs */}
          <View style={styles.containerInput}>
            {keyInputs.map(({ field, label, placeholder }) => {
              if (field === "cellphone" || field === "identificationNumber") {
                return (
                  <Input
                    key={field}
                    field={field}
                    label={label}
                    placeholder={placeholder}
                    fn={handleSetInfo}
                    value={info[field]}
                    typeInput="numeric"
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
          {/*seccion de selecccion de identificacion */}
          <Picker
            selectedValue={info.identificationType}
            onValueChange={(itemValue, _) =>
              handleSetInfo("identificationType", itemValue)
            }
          >
            <Picker.Item label="CC" value="CC" />
            <Picker.Item label="CE" value="CE" />
            <Picker.Item label="TI" value="TI" />
            <Picker.Item label="Permiso especial de permanencia" value="PPT" />
            <Picker.Item label="Pasaporte" value="PASSPORT" />
          </Picker>

          <View style={styles.buttonSection}>
            <ButtonForm
              title="Registrarse"
              action={handleSubmit}
              disabled={!isCompleteFields || isPending}
              isPending={mutation.isPending}
            />
            <Text style={{ fontSize: 12 }}>Or</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 4,
              }}
            >
              <Text>Tienes una cuenta?</Text>
              <Link
                href="/login"
                style={{ color: Colors.TERTIARY, fontWeight: 600 }}
              >
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
  //contenedor de imagen
  logoContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 64,
    height: "auto",
    aspectRatio: 1,
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

  //contenedor de formulario global
  containerForm: {
    marginHorizontal: 10,
    flex: 1,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderRadius: 12,
    borderColor: Colors.NEUTRAL,
  },

  //contendor donde dentro tiene titulos y parrafos
  containerText: {
    flexDirection: "column",
    gap: 5,
  },

  //titulo de la seccion de formulatio
  containerFormTitle: {
    fontFamily: "arimo",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: 800,
    marginTop: 12,
  },

  //contenedor de inputs
  containerInput: {
    marginTop: 32,
    flexDirection: "column",
    gap: 28,
  },

  buttonSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
