import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { TAGS } from "@/constants/lists";
import React, { cloneElement } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * Sección de filtros con badges
 * Permite filtrar los secretos por diferentes categorías
 *
 * @param selectedTag - Tag actualmente seleccionado
 * @param onSelectTag - Función que se ejecuta cuando se selecciona un tag
 */
interface FilterSectionProps {
  selectedTag: string;
  onSelectTag: (tag: string) => void;
}

export const FilterSection = ({
  selectedTag,
  onSelectTag,
}: FilterSectionProps) => {
  return (
    <View style={styles.filterSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.badgeContainer}
      >
        {/* Mapeamos todos los tags disponibles y creamos un badge para cada uno */}
        {TAGS.map((tag) => (
          <TouchableOpacity
            key={tag.id}
            style={[styles.badge, selectedTag === tag.id && styles.badgeActive]}
            onPress={() => onSelectTag(tag.id)}
          >
            {/* Clonamos el icono para cambiar su color según el estado */}
            {cloneElement(tag.icon, {
              color: selectedTag === tag.id ? TOKENS.background : TOKENS.text,
            })}

            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.badgeText,
                selectedTag === tag.id && styles.badgeTextActive,
              ]}
            >
              {tag.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    marginBottom: 10,
  },
  badgeContainer: {
    paddingRight: 20,
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: TOKENS.primary,
  },
  badgeActive: {
    backgroundColor: TOKENS.badgeActive,
    borderColor: TOKENS.badgeActive,
  },
  badgeText: {
    color: TOKENS.text,
    fontSize: 14,
  },
  badgeTextActive: {
    color: TOKENS.background,
    fontSize: 14,
  },
});
