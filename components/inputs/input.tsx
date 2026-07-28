import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
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

export { Input, SearchInput };
