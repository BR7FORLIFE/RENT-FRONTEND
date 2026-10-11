import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";
import { Pressable } from "react-native";
import { Palette } from "../../../../themes/themes";

// Piezas visuales compartidas por todos los pasos del registro de propiedad.

export function StepLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <View style={styles.layout}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {children}
      </ScrollView>

      <View style={styles.footer}>{footer}</View>
    </View>
  );
}

export function FormCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function TextField({
  prefix,
  multiline,
  ...props
}: TextInputProps & { prefix?: string }) {
  const filled = String(props.value ?? "").trim().length > 0;

  return (
    <View
      style={[
        styles.inputWrapper,
        multiline && styles.inputWrapperMultiline,
        filled && styles.inputWrapperFilled,
      ]}
    >
      {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
      <TextInput
        placeholderTextColor={Palette.textFaint}
        multiline={multiline}
        {...props}
        style={[styles.input, multiline && styles.inputMultiline]}
      />
    </View>
  );
}

export function Counter({ current, max }: { current: number; max: number }) {
  return (
    <Text style={styles.counter}>
      {current}/{max}
    </Text>
  );
}

export function OptionChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.chips}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipSelected,
              pressed && styles.chipPressed,
            ]}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function HintBox({ children }: { children: string }) {
  return (
    <View style={styles.hintBox}>
      <Text style={styles.hintBoxText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    width: "100%",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
    gap: 16,
  },

  header: {
    gap: 4,
  },

  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: Palette.textPrimary,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textMuted,
  },

  footer: {
    width: "100%",
    paddingTop: 8,
    paddingBottom: 8,
    gap: 8,
  },

  card: {
    width: "100%",
    padding: 16,
    gap: 16,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 16,
  },

  field: {
    width: "100%",
    gap: 6,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Palette.textSecondary,
  },

  hint: {
    fontSize: 11,
    color: Palette.textFaint,
  },

  inputWrapper: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    borderRadius: 12,
  },

  inputWrapperFilled: {
    borderColor: Palette.accent,
  },

  inputWrapperMultiline: {
    alignItems: "flex-start",
  },

  prefix: {
    marginRight: 6,
    fontSize: 15,
    color: Palette.textMuted,
  },

  input: {
    flex: 1,
    minHeight: 46,
    fontSize: 15,
    color: Palette.textPrimary,
  },

  inputMultiline: {
    minHeight: 110,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  counter: {
    alignSelf: "flex-end",
    fontSize: 11,
    color: Palette.textFaint,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    borderRadius: 999,
  },

  chipSelected: {
    backgroundColor: Palette.accentSoft,
    borderColor: Palette.accent,
  },

  chipPressed: {
    opacity: 0.7,
  },

  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Palette.textSecondary,
  },

  chipTextSelected: {
    color: Palette.accentStrong,
  },

  hintBox: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Palette.surfaceMuted,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 12,
  },

  hintBoxText: {
    fontSize: 12,
    lineHeight: 17,
    color: Palette.textMuted,
  },
});
