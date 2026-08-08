import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../themes/themes";

import SearchIcon from "../../assets/icons/search-input.svg";

export type TypeInput =
  | "phone-pad"
  | "numeric"
  | "default"
  | "email-address"
  | "number-pad";

function Input({
  field,
  label,
  placeholder,
  fn,
  value,
  typeInput,
  maxLength = 50,
}: {
  field: string;
  label: string;
  placeholder: string;
  value: string;
  typeInput?: TypeInput;
  maxLength?: number;
  fn: (id: string, value: string) => void;
}) {
  const [onfocus, setOnFocus] = useState<boolean>(false);

  const shouldSee = onfocus || value.trim().length > 0;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          {
            top: shouldSee ? -20 : 15,
            color: shouldSee ? Colors.TERTIARY : Colors.NEUTRAL,
          },
        ]}
      >
        {label}
      </Text>
      <TextInput
        nativeID={field}
        style={[
          styles.input,
          { borderColor: shouldSee ? Colors.TERTIARY : Colors.NEUTRAL },
        ]}
        keyboardType={typeInput || "default"}
        value={value}
        onFocus={() => setOnFocus(true)}
        onBlur={() => setOnFocus(false)}
        placeholder={shouldSee ? placeholder : ""}
        onChangeText={(text) => fn(field, text)}
        autoCorrect={false}
        autoCapitalize="none"
        maxLength={maxLength}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    position: "relative",
  },
  text: {
    width: "80%",
    position: "absolute",
    left: 12,
    fontWeight: 600,
    color: "#000",
    fontStyle: "normal",
  },
  input: {
    borderWidth: 1,
    width: "100%",
    borderRadius: 6,
    borderColor: Colors.TERTIARY,
    height: 50,
    paddingLeft: 12,
  },
});

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};
function SearchInput({
  value,
  onChangeText,
  placeholder = "Buscar",
}: SearchInputProps) {
  const [focus, setFocus] = useState<boolean>(false);

  return (
    <View
      style={[
        stylesSearch.container,
        { borderColor: focus ? Colors.TERTIARY : "#D8DDE6" },
      ]}
    >
      <SearchIcon width={18} height={18} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={stylesSearch.input}
        onFocus={() => setFocus(true)}
      />
    </View>
  );
}

const stylesSearch = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 40,
    gap: 12,
  },

  input: {
    flex: 1,
    fontSize: 12,
    color: "#000000",
  },
});

function NumberInput<T>({
  field,
  saveData,
}: {
  field: keyof T;
  saveData: React.Dispatch<React.SetStateAction<T>>;
}) {
  const [number, setNumber] = useState<number>(0);

  const increment = () => {
    setNumber((prev) => {
      const newValue = prev + 1;

      saveData((currentData) => ({
        ...currentData,
        [field]: newValue,
      }));

      return newValue;
    });
  };

  const decrement = () => {
    setNumber((prev) => {
      const newValue = Math.max(0, prev - 1);

      saveData((currentData) => ({
        ...currentData,
        [field]: newValue,
      }));

      return newValue;
    });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 6,
        height: 50,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
      }}
    >
      <TextInput
        value={String(number)}
        style={{
          flex: 1,
          height: "100%",
          paddingHorizontal: 10,
          fontSize: 16,
          color: "#111827",
          textAlign: "center",
        }}
        keyboardType="numeric"
      />

      <View
        style={{
          height: "100%",
          width: 32,
          borderLeftWidth: 1,
          borderLeftColor: "#D1D5DB",
        }}
      >
        <Pressable
          onPress={increment}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F9FAFB",
          }}
        >
          <Text style={{ fontSize: 12, color: "#374151" }}>▲</Text>
        </Pressable>

        <Pressable
          onPress={decrement}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F9FAFB",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
          }}
        >
          <Text style={{ fontSize: 12, color: "#374151" }}>▼</Text>
        </Pressable>
      </View>
    </View>
  );
}

export { Input, NumberInput, SearchInput };
