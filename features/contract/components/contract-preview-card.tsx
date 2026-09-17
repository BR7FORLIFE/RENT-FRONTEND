import { Pressable, StyleSheet, Text, View } from "react-native";
import type { StatusContractType } from "../api.response";

//imagenes
import InfoIcon from "../../../assets/icons/info.svg";

interface ContractPreviewCardProps {
  startDate: Date;
  endDate: Date;
  status: StatusContractType;
  montlyRent: number;
  action: () => void;
}

export function ContractPreviewCard({
  startDate,
  endDate,
  status,
  montlyRent,
  action,
}: ContractPreviewCardProps) {
  return (
    <Pressable style={styles.container} onPress={action}>
      {/**contenedor de fecha y estados */}
      <View>
        {/**fechas */}
        <View>
          <Text>{startDate.toISOString()}</Text>
          <Text>{endDate.toISOString()}</Text>
        </View>

        {/**estado */}
        <Text>{status}</Text>
      </View>

      {/**contenedor de renta mensual y boton de informacion */}
      <View>
        {/**imagen de informacion */}
        <InfoIcon width={24} height={24} />

        {/**renta mensual */}
        <View>
          <Text>Renta Mensual</Text>
          <Text>{montlyRent}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
