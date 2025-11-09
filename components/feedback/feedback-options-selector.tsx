import { TOKENS } from "@/constants/colors";
import { FEEDBACK_OPTIONS } from "@/constants/lists";
import { ThemedText } from "@/components/themed-text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SectionHeader } from "./section-header";

/**
 * Props para el componente FeedbackOptionsSelector
 * @param selectedOptions - Array de IDs de las opciones seleccionadas
 * @param onToggle - Función que se ejecuta cuando el usuario selecciona/deselecciona una opción
 */
interface FeedbackOptionsSelectorProps {
  selectedOptions: number[];
  onToggle: (id: number) => void;
}

/**
 * Componente FeedbackOptionsSelector
 * Muestra una cuadrícula de opciones de feedback que el usuario puede seleccionar
 * Permite selección múltiple (el usuario puede elegir varias opciones)
 */
export const FeedbackOptionsSelector: React.FC<
  FeedbackOptionsSelectorProps
> = ({ selectedOptions, onToggle }) => {
  return (
    <View style={styles.container}>
      {/* Encabezado de la sección */}
      <SectionHeader
        iconName="checkmark"
        title="Que fue lo que mas te gusto?"
      />

      {/* Contenedor de opciones en cuadrícula */}
      <View style={styles.optionsContainer}>
        {FEEDBACK_OPTIONS.map((option) => (
          <Pressable
            key={option.id}
            style={[
              styles.optionContainer,
              // Si esta opción está seleccionada, aplicamos el estilo de selección
              selectedOptions.includes(option.id) && styles.selectedOption,
            ]}
            onPress={() => onToggle(option.id)}
          >
            {/* Icono de la opción */}
            <MaterialCommunityIcons
              name={option.icon as any}
              size={20}
              color={TOKENS.accent}
            />

            {/* Texto descriptivo de la opción */}
            <ThemedText type="default">{option.label}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  optionsContainer: {
    flexDirection: "row", // Dirección horizontal
    flexWrap: "wrap", // Permite que los elementos pasen a la siguiente fila
    gap: 10, // Espacio entre elementos
  },
  optionContainer: {
    flexDirection: "row", // Ícono y texto lado a lado
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: "45%", // Ocupa al menos 45% del ancho (2 columnas)
    backgroundColor: TOKENS.cardBackground,
    flex: 1,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: TOKENS.badgeActive, // Borde visible cuando está seleccionada
    borderWidth: 2,
  },
});
