import { useMutation } from "@tanstack/react-query";
import
  {
    CameraView,
    useCameraPermissions,
    type BarcodeScanningResult,
  } from "expo-camera";
import { useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import QrCode from "react-native-qrcode-svg";
import Toast from "react-native-toast-message";
import { ButtonForm } from "../../../../components/buttons/button";
import { SearchInput } from "../../../../components/inputs/input";
import { useMe } from "../../../../stores/auth-store";
import { InvitePropertyMember } from "../../api";
import { QrPayloadSchema } from "../../schemas/help-schemas";
import { useBehaviorQr, useProperty } from "../../stores/property.store";
/**
 * Como es el flujo de la invitacion de qr
 *
 * se puede invitar de dos formas:
 *
 * 1. via medio correo electronico donde tienes el correo de la persona que se quiere agregar y la propiedad (propertyId)
 * 2. Yo como dueño genero el QR de mi propertyId, y por parte de la otra persona tengo el email, donde ahi podre aceptar
 */

export function Qr({
  propertyId,
  userId,
}: {
  propertyId: string;
  userId: string;
}) {
  const data = JSON.stringify({ propertyId, userId });

  return (
    <QrCode value={data} logoSize={30} logoBackgroundColor="transparent" />
  );
}

//componente cuando se escanea el componente
export function QrScan() {
  const { user } = useMe();
  const [permission, setPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);

  //este mutation nos permitira invitar a un miembro si este
  //decide scanear el qr generado por la otra persona
  const mutation = useMutation({
    mutationFn: ({
      propertyId,
      userId,
    }: {
      propertyId: string;
      userId: string;
    }) => InvitePropertyMember(user!.email, propertyId, userId),
  });

  const handleQrResult = (result: BarcodeScanningResult) => {
    try {
      if (scanned) return;

      const parsed = JSON.parse(result.data);
      const { propertyId, userId } = QrPayloadSchema.parse(parsed);

      setScanned(true);

      mutation.mutate({ propertyId, userId });
    } catch (error) {
      //ignoramos hasta que encontremos un codigo valido XD
    }
  };

  if (!permission) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      />
    );
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 32,
          gap: 16,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          Permiso de cámara
        </Text>

        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            textAlign: "center",
            color: "#666",
            marginBottom: 8,
          }}
        >
          Necesitamos acceso a tu camara para poder escanear el codigo QR de la
          invitación.
        </Text>

        <Button onPress={setPermission} title="Dar permiso a la cámara" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
      }}
    >
      <CameraView
        style={{
          flex: 1,
        }}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleQrResult}
      />
    </View>
  );
}

export function InvitePropertyMemberCard() {
  const { setOpen } = useBehaviorQr();
  const { data } = useProperty();
  const { user } = useMe();
  const [email, setEmail] = useState<string>("");

  //enviamos la invitacion a la propiedad si la persona se encuentra lejos
  // ya que la estrategia es que si esta cerca y escanea el qr la otra persona
  // se llevara el property Id pero gracias  a su /me podemos completar
  // la peticion para que se invite a su propio correo

  const mutation = useMutation({
    mutationFn: () => InvitePropertyMember(email, data!.id, user!.userId),
    mutationKey: ["invitePropertyMember", data!.id],
    onSuccess: () => {
      setOpen(false); // cerramos el apartado
      Toast.show({
        type: "success",
        text2: "Invitacion enviada exitosamente!",
      });
    },
  });

  const sendInvitation = () => {
    mutation.mutate();
  };

  if (!data) {
    return null;
  }

  return (
    <View style={invitePropertyMemberStyles.overlay}>
      <Pressable
        style={invitePropertyMemberStyles.backdrop}
        onPress={() => setOpen(false)}
      />

      <View style={invitePropertyMemberStyles.card}>
        <View style={invitePropertyMemberStyles.header}>
          <Text style={invitePropertyMemberStyles.title}>Agregar miembro</Text>

          <Text style={invitePropertyMemberStyles.propertyName}>
            {data.propertyName}
          </Text>

          <Text style={invitePropertyMemberStyles.description}>
            Genera un código QR para vincular un miembro a esta propiedad.
            También puedes enviarle una invitación directamente a su correo.
          </Text>
        </View>

        <View style={invitePropertyMemberStyles.qrSection}>
          <View style={invitePropertyMemberStyles.qrContainer}>
            <Qr propertyId={data.id} userId={user!.userId} />
          </View>

          <Text style={invitePropertyMemberStyles.qrDescription}>
            Escanea este código para vincularte a la propiedad
          </Text>
        </View>

        <View style={invitePropertyMemberStyles.dividerContainer}>
          <View style={invitePropertyMemberStyles.divider} />

          <Text style={invitePropertyMemberStyles.dividerText}>
            O INVITA POR CORREO
          </Text>

          <View style={invitePropertyMemberStyles.divider} />
        </View>

        <View style={invitePropertyMemberStyles.emailSection}>
          <Text style={invitePropertyMemberStyles.emailLabel}>
            Correo electrónico
          </Text>

          <SearchInput value={email} onChangeText={setEmail} />

          <ButtonForm
            title="Enviar invitación"
            action={sendInvitation}
            disabled={mutation.isPending}
          />
        </View>
      </View>
    </View>
  );
}

const invitePropertyMemberStyles = StyleSheet.create({
  overlay: {
    position: "absolute",

    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    zIndex: 100,

    justifyContent: "center",
    alignItems: "center",
  },

  backdrop: {
    position: "absolute",

    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  card: {
    width: "90%",
    maxWidth: 500,

    maxHeight: "90%",

    paddingHorizontal: 20,
    paddingVertical: 24,

    borderRadius: 20,

    backgroundColor: "#FFFFFF",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,

    elevation: 10,

    gap: 18,
  },

  header: {
    width: "100%",
    alignItems: "center",
    gap: 5,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  propertyName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B81FF",
    textAlign: "center",
  },

  description: {
    width: "95%",

    marginTop: 4,

    fontSize: 11,
    lineHeight: 18,

    color: "#6B7280",
    textAlign: "center",
  },

  qrSection: {
    width: "100%",

    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 16,

    borderRadius: 16,

    backgroundColor: "#F8FAFC",

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  qrContainer: {
    padding: 12,

    borderRadius: 14,

    backgroundColor: "#FFFFFF",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    elevation: 4,
  },

  qrDescription: {
    marginTop: 10,

    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
  },

  dividerContainer: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",

    gap: 8,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  dividerText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#9CA3AF",
  },

  emailSection: {
    width: "100%",
    gap: 10,
  },

  emailLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },
});
