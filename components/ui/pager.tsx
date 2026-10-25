import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { Palette } from "../../themes/themes";
import { FilterButton } from "../buttons/button";

type PagerProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  style?: StyleProp<ViewStyle>;
};

// paginacion compartida: anterior / pagina actual / siguiente
export function Pager({ page, totalPages, onChange, style }: PagerProps) {
  if (totalPages <= 1) return null;

  return (
    <View style={[styles.pager, style]}>
      <FilterButton
        title="Anterior"
        onPress={() => page > 1 && onChange(page - 1)}
      />
      <Text style={styles.pageText}>
        {page} / {totalPages}
      </Text>
      <FilterButton
        title="Siguiente"
        onPress={() => page < totalPages && onChange(page + 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pager: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 8,
  },
  pageText: {
    fontSize: 12,
    color: Palette.textMuted,
  },
});
