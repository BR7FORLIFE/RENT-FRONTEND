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

// Input

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
  const [onfocus, setOnFocus] = useState(false);

  const shouldSee = onfocus || value.trim().length > 0;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          {
            top: shouldSee ? -8 : 15,
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
          {
            borderColor: shouldSee ? Colors.TERTIARY : Colors.NEUTRAL,
          },
        ]}
        keyboardType={typeInput || "default"}
        value={value}
        onFocus={() => setOnFocus(true)}
        onBlur={() => setOnFocus(false)}
        placeholder={shouldSee ? placeholder : ""}
        placeholderTextColor="#9CA3AF"
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
    height: 52,

    position: "relative",

    justifyContent: "center",
  },

  text: {
    position: "absolute",

    left: 12,

    zIndex: 2,

    paddingHorizontal: 4,

    fontSize: 14,
    fontWeight: "600",

    backgroundColor: "#FFFFFF",
  },

  input: {
    width: "100%",
    height: 52,

    paddingHorizontal: 12,
    paddingRight: 44,

    borderWidth: 1,
    borderRadius: 8,

    fontSize: 15,
    color: "#111827",

    backgroundColor: "#FFFFFF",
  },
});

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};
// SearchInput

function SearchInput({
  value,
  onChangeText,
  placeholder = "Buscar",
}: SearchInputProps) {
  const [focus, setFocus] = useState(false);

  return (
    <View
      style={[
        stylesSearch.container,
        {
          borderColor: focus ? Colors.TERTIARY : "#D8DDE6",
        },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={stylesSearch.input}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />

      <SearchIcon width={18} height={18} style={stylesSearch.icon} />
    </View>
  );
}

const stylesSearch = StyleSheet.create({
  container: {
    width: "100%",

    minHeight: 44,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderRadius: 12,

    paddingHorizontal: 14,

    gap: 10,
  },

  input: {
    flex: 1,

    minHeight: 42,

    fontSize: 14,
    color: "#111827",

    paddingVertical: 0,
  },

  icon: {
    flexShrink: 0,
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
    <View style={stylesNumber.container}>
      <TextInput
        value={String(number)}
        style={stylesNumber.input}
        keyboardType="numeric"
      />

      <View style={stylesNumber.controls}>
        <Pressable
          onPress={increment}
          style={({ pressed }) => [
            stylesNumber.controlButton,
            pressed && stylesNumber.controlButtonPressed,
          ]}
        >
          <Text style={stylesNumber.controlText}>▲</Text>
        </Pressable>

        <Pressable
          onPress={decrement}
          style={({ pressed }) => [
            stylesNumber.controlButton,
            stylesNumber.controlButtonBottom,
            pressed && stylesNumber.controlButtonPressed,
          ]}
        >
          <Text style={stylesNumber.controlText}>▼</Text>
        </Pressable>
      </View>
    </View>
  );
}

const stylesNumber = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,

    flexDirection: "row",
    alignItems: "center",

    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,

    backgroundColor: "#FFFFFF",
  },

  input: {
    flex: 1,

    height: "100%",

    paddingHorizontal: 10,

    fontSize: 16,
    color: "#111827",

    textAlign: "center",
  },

  controls: {
    width: 36,
    height: "100%",

    borderLeftWidth: 1,
    borderLeftColor: "#D1D5DB",
  },

  controlButton: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F9FAFB",
  },

  controlButtonBottom: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  controlButtonPressed: {
    opacity: 0.6,
  },

  controlText: {
    fontSize: 11,
    color: "#374151",
  },
});

export { Input, NumberInput, SearchInput };
