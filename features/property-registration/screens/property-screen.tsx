import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PlusIcon from "../../../assets/icons/plus.svg";
import { AIButton } from "../../../components/ai";
import { FilterButton } from "../../../components/buttons/button";
import Header from "../../../components/header";
import { SearchInput } from "../../../components/inputs/input";
import PropertyCard from "../../../components/property-card";
import { Colors } from "../../../themes/themes";

export default function PropertyScreen() {
  const [text, setText] = useState("");
  const [Ai, setAt] = useState<boolean>(false);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#ffffff",
        gap: 24,
      }}
    >
      <AIButton />

      <AIButton onPress={() => setAt((prev) => !prev)} />
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Header />
        <Pressable
          onPress={() => router.navigate("/home/property-registration")}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <PlusIcon width={22} height={22} />
        </Pressable>
      </View>

      {/*seccion de titulo y text input y botones de paginaciones */}
      <View style={{ marginHorizontal: 16, flexDirection: "column", gap: 4 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            opacity: 0.5,
          }}
        >
          Mis Propiedades
        </Text>
        <SearchInput onChangeText={setText} value={text} />
        <View style={{ flexDirection: "row", marginTop: 12, gap: 5 }}>
          <FilterButton title="Todas" onPress={() => null} />
          <FilterButton title="Disponibles" onPress={() => null} />
          <FilterButton title="Ocupadas" onPress={() => null} />
        </View>
      </View>

      <View
        style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {/* IMPORTANTE USAR FLATLIST CUANDO RECUPEREMOS INFO DE LA API */}
          <View
            style={{
              width: "90%",
              flexDirection: "column",
              gap: 8,
              overflow: "hidden",
            }}
          >
            <PropertyCard
              fmi="060-467897"
              direction="Diagonal a manga"
              typeProperty="COMMERCIAL"
              city="Cartagena"
              occupationType="OCCUPIED"
            />
            <PropertyCard
              fmi="060-1234571"
              direction="AV Caracoles"
              typeProperty="INDUSTRIAL"
              city="Cartagena"
              occupationType="VACANT"
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 24,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: Colors.PRIMARY,

    marginRight: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,

    elevation: 6,
  },

  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
});
