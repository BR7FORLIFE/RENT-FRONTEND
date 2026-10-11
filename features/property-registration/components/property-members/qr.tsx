import { useMutation } from "@tanstack/react-query";
import
  {
    CameraView,
    useCameraPermissions,
    type BarcodeScanningResult,
  } from "expo-camera";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import QrCode from "react-native-qrcode-svg";
import Toast from "react-native-toast-message";
import { ButtonForm } from "../../../../components/buttons/button";
import { Input } from "../../../../components/inputs/input";
import { useMe } from "../../../../stores/auth-store";
import { Palette } from "../../../../themes/themes";
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
export function QrScan({
  setOpenQrScan,
}: {
  setOpenQrScan: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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

      //notificamos al usuario que se ha invitado correctamente
      Toast.show({
        type: "success",
        text2: "Has sido invitado exitosamente!",
      });

      setOpenQrScan(false); //cerramos el scanner de qr
    } catch (error) {
      //ignoramos hasta que encontremos un codigo valido XD
    }
  };

  if (!permission) {
    return <View style={scanStyles.center} />;
  }

  if (!permission.granted) {
    return (
      <View style={scanStyles.center}>
        <Text style={scanStyles.title}>Permiso de cámara</Text>

        <Text style={scanStyles.description}>
          Necesitamos acceso a tu cámara para escanear el código QR de la
          invitación.
        </Text>

        <View style={scanStyles.actions}>
          <ButtonForm
            title="Dar permiso a la cámara"
            variant="primary"
            action={setPermission}
          />
          <ButtonForm title="Cancelar" action={() => setOpenQrScan(false)} />
        </View>
      </View>
    );
  }

  return (
    <View style={scanStyles.camera}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleQrResult}
      />

      <View pointerEvents="none" style={scanStyles.frameWrapper}>
        <View style={scanStyles.frame} />
        <Text style={scanStyles.hint}>
          Apunta al código QR de la propiedad
        </Text>
      </View>

      <View style={scanStyles.cancel}>
        <ButtonForm title="Cancelar" action={() => setOpenQrScan(false)} />
      </View>
    </View>
  );
}

const scanStyles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
    backgroundColor: Palette.background,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Palette.textPrimary,
    textAlign: "center",
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: Palette.textMuted,
  },

  actions: {
    width: "100%",
    gap: 8,
    marginTop: 8,
  },

  camera: {
    flex: 1,
    backgroundColor: "#000",
  },

  frameWrapper: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  frame: {
    width: 240,
    height: 240,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  hint: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  cancel: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 32,
  },
});

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
    onError: () => {
      Toast.show({
        type: "error",
        text2: "No se pudo enviar la invitación. Inténtalo de nuevo.",
      });
    },
  });

  const sendInvitation = () => {
    mutation.mutate();
  };

  if (!data) {
    return null;
  }

  const emailIsValid = /^\S+@\S+\.\S+$/.test(email.trim());

  return (
    <View style={invitePropertyMemberStyles.overlay}>
      <Pressable
        style={invitePropertyMemberStyles.backdrop}
        onPress={() => setOpen(false)}
      />

      <View style={invitePropertyMemberStyles.card}>
        <View style={invitePropertyMemberStyles.header}>
          <View style={invitePropertyMemberStyles.headerText}>
            <Text style={invitePropertyMemberStyles.title}>
              Agregar miembro
            </Text>
            <Text
              style={invitePropertyMemberStyles.propertyName}
              numberOfLines={1}
            >
              {data.propertyName}
            </Text>
          </View>

          <Pressable
            onPress={() => setOpen(false)}
            hitSlop={10}
            accessibilityLabel="Cerrar"
          >
            <Text style={invitePropertyMemberStyles.close}>✕</Text>
          </Pressable>
        </View>

        <Text style={invitePropertyMemberStyles.description}>
          Comparte el código QR para vincular a alguien a esta propiedad o
          envíale una invitación a su correo.
        </Text>

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
            o invita por correo
          </Text>
          <View style={invitePropertyMemberStyles.divider} />
        </View>

        <View style={invitePropertyMemberStyles.emailSection}>
          <Input
            field="email"
            label="Correo electrónico"
            placeholder="persona@correo.com"
            value={email}
            fn={(_, value) => setEmail(value)}
            typeInput="email-address"
          />

          <ButtonForm
            title="Enviar invitación"
            variant="primary"
            action={sendInvitation}
            disabled={!emailIsValid}
            isPending={mutation.isPending}
          />
        </View>
      </View>
    </View>
  );
}

const invitePropertyMemberStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },

  card: {
    width: "90%",
    maxWidth: 500,
    maxHeight: "92%",
    padding: 20,
    gap: 16,
    borderRadius: 20,
    backgroundColor: Palette.surface,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  headerText: {
    flex: 1,
    gap: 2,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: Palette.textPrimary,
  },

  propertyName: {
    fontSize: 14,
    fontWeight: "600",
    color: Palette.accent,
  },

  close: {
    fontSize: 18,
    color: Palette.textMuted,
  },

  description: {
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textMuted,
  },

  qrSection: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
    borderRadius: 16,
    backgroundColor: Palette.surfaceMuted,
    borderWidth: 1,
    borderColor: Palette.border,
  },

  qrContainer: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },

  qrDescription: {
    fontSize: 12,
    color: Palette.textMuted,
    textAlign: "center",
  },

  dividerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.border,
  },

  dividerText: {
    fontSize: 12,
    color: Palette.textFaint,
  },

  emailSection: {
    width: "100%",
    gap: 14,
  },
});
