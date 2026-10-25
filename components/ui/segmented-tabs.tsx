import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Palette } from "../../themes/themes";
import { FilterButton } from "../buttons/button";

export interface SegmentedTab<T extends string> {
  label: string;
  value: T;
  count?: number;
}

// "pills": filtros dentro de una sección (estética de FilterButton).
// "underline": navegación principal de la pantalla (texto con indicador inferior), para que
// no se confunda con los filtros "pills" que aparecen debajo.
export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
  variant = "pills",
}: {
  tabs: SegmentedTab<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: "pills" | "underline";
}) {
  if (variant === "underline") {
    return (
      <View style={styles.underlineBar}>
        {tabs.map((tab) => {
          const active = tab.value === value;
          return (
            <Pressable
              key={tab.value}
              onPress={() => onChange(tab.value)}
              style={[styles.underlineTab, active && styles.underlineActive]}
            >
              <Text
                style={[styles.underlineText, active && styles.underlineTextActive]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {tabs.map((tab) => (
        <FilterButton
          key={tab.value}
          title={tab.label}
          count={tab.count}
          active={tab.value === value}
          onPress={() => onChange(tab.value)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },

  underlineBar: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },

  underlineTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginBottom: -1,
  },

  underlineActive: {
    borderBottomColor: Palette.textPrimary,
  },

  underlineText: {
    fontSize: 15,
    fontWeight: "500",
    color: Palette.textMuted,
  },

  underlineTextActive: {
    fontWeight: "700",
    color: Palette.textPrimary,
  },
});
