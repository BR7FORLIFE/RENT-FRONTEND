import { StyleSheet, View } from "react-native";
import QrCode from "react-native-qrcode-svg";
import { useBehaviorQr, useProperty } from "../../stores/property.store";

/**
 * Como es el flujo de la invitacion de qr
 *
 * se puede invitar de dos formas:
 *
 * 1. via medio correo electronico donde tienes el correo de la persona que se quiere agregar y la propiedad (propertyId)
 * 2. Yo como dueño genero el QR de mi propertyId, y por parte de la otra persona tengo el email, donde ahi podre aceptar
 */

export function Qr({ propertyId }: { propertyId: string }) {
  return (
    <QrCode
      value={propertyId}
      logoSize={30}
      logoBackgroundColor="transparent"
    />
  );
}

export function InvitePropertyMemberCard() {
  const { data, set } = useProperty();
  const { setOpen } = useBehaviorQr();

  return (
    <View style={invitePropertyMemberStyles.container}>
      {/**titulo / nombre de la propiedad y una pequeña descripcion explicando lo que el dueño pretende hacer */}
      <View></View>

      {/**seccion de QR con estilos y profundidad que sea la seccion que mas resalte */}

      {/**en caso tal la otra persona no este cerca puede haber un input para escribir el correo */}
      {/**de la otra persona que se pretende invitar a la app */}
    </View>
  );
}

const invitePropertyMemberStyles = StyleSheet.create({
  container: {
    position: "absolute",
    inset: 0,
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 30,
    flexDirection: "column",
    gap: 12,
  },
});
