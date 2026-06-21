import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../themes/themes";

export type TypeInput = "phone-pad" | "numeric" | "default";

function Input({
  field,
  label,
  placeholder,
  fn,
  value,
  typeInput,
}: {
  field: string;
  label: string;
  placeholder: string;
  value: string;
  typeInput?: TypeInput;
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
        onChange={(event) => fn(field, event.nativeEvent.text.trim())} // el objeto event en react native es distinto
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
    borderColor: Colors.NEUTRAL,
    height: 50,
    paddingLeft: 12,
  },
});

export default Input;
