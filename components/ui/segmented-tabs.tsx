import { ScrollView, StyleSheet } from "react-native";
import { FilterButton } from "../buttons/button";

export interface SegmentedTab<T extends string> {
  label: string;
  value: T;
}

// Pestañas horizontales para cambiar de sección dentro de una misma pantalla.
// Reutiliza FilterButton para mantener la misma estética de filtros de la app.
export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: SegmentedTab<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
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
});
