import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Sections } from "../../screens/contract-details";

//icons
import ActionIcon from "../../../../assets/icons/action.svg";
import CheckIcon from "../../../../assets/icons/check.svg";

//estados y estructura del panel de acciones de los contratos
export interface ActionProps {
  name: string;
  typeAction: Sections;
}

const items: ActionProps[] = [
  {
    name: "Listar contratos",
    typeAction: "LIST-CONTRACTS",
  },
  {
    name: "Listar borradores de contratos",
    typeAction: "LIST-CONTRACT-DRAFT",
  },
  {
    name: "Generar borradores",
    typeAction: "GENERATE-CONTRACT-DRAFT",
  },
];

function ItemAction({
  name,
  actionName,
  setAction,
  selected,
}: {
  name: string;
  actionName: Sections;
  setAction: React.Dispatch<React.SetStateAction<Sections>>;
  selected: boolean;
}) {
  const handlePress = () => {
    if (selected) return;

    setAction(actionName);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={selected}
      style={({ pressed }) => [
        itemActionStyles.itemAction,
        selected && itemActionStyles.itemActionSelected,
        pressed && !selected && itemActionStyles.itemActionPressed,
      ]}
    >
      <Text
        style={[
          itemActionStyles.itemActionText,
          selected && itemActionStyles.itemActionTextSelected,
        ]}
      >
        {name}
      </Text>
      {selected && (
        <CheckIcon
          width={24}
          height={24}
          style={{ position: "absolute", right: 5, top: 5 }}
        />
      )}
    </Pressable>
  );
}
const itemActionStyles = StyleSheet.create({
  itemAction: {
    position: "relative",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },

  itemActionSelected: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },

  itemActionPressed: {
    backgroundColor: "#F8FAFC",
  },

  itemActionText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },

  itemActionTextSelected: {
    fontWeight: "600",
    color: "#2563EB",
  },
});

export function ButtonContractAction({
  propertyName,
  sectionName,
  setSection,
  hidden = false,
}: {
  propertyName: string;
  sectionName: Sections;
  setSection: React.Dispatch<React.SetStateAction<Sections>>;
  hidden?: boolean;
}) {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => setToggle((prev) => !prev)}
      >
        <ActionIcon width={27} height={27} />
      </Pressable>

      {toggle ? (
        <View style={styles.info}>
          {items.map((item) => (
            <ItemAction
              key={item.name}
              name={item.name}
              setAction={setSection}
              actionName={item.typeAction}
              selected={sectionName === item.typeAction}
            />
          ))}
        </View>
      ) : (
        <>
          {hidden === false && (
            <View style={styles.cloudInfo}>
              <Text style={styles.cloudTitle}>Acciones</Text>

              <Text style={styles.cloudDescription}>
                Gestiona las acciones del contrato para{" "}
                <Text style={{ fontWeight: "900" }}>{propertyName}</Text>
              </Text>
            </View>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: "10%",
    right: 18,

    width: 58,
    height: 58,
    borderRadius: 29,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#2563EB",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,

    elevation: 6,

    zIndex: 10,
  },

  buttonPressed: {
    transform: [{ scale: 0.94 }],
    backgroundColor: "#b2b3b6",
  },

  info: {
    position: "absolute",
    bottom: "20%",
    right: 18,
    flexDirection: "column",

    gap: 8,

    width: "90%",
    minHeight: 170,

    padding: 16,

    backgroundColor: "#FFFFFF",

    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    elevation: 8,

    zIndex: 9,
  },

  cloudInfo: {
    position: "absolute",
    bottom: "9%",
    right: 80,

    width: "70%",
    minHeight: 70,

    padding: 10,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    borderWidth: 1,
    borderColor: "#E2E8F0",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    elevation: 8,

    zIndex: 9,
  },

  cloudTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },

  cloudDescription: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "400",
    color: "#94A3B8",
    textAlign: "center",
  },
});
