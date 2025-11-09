import { TOKENS } from "@/constants/colors";
import { QUALIFICATION_OPTIONS } from "@/constants/lists";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SectionHeader } from "./section-header";

/**
 * Props para el componente QualificationSelector
 * @param selectedQualification - ID de la calificación seleccionada actualmente
 * @param onSelect - Función que se ejecuta cuando el usuario selecciona una calificación
 */
interface QualificationSelectorProps {
  selectedQualification: number | null;
  onSelect: (id: number) => void;
}

/**
 * Componente QualificationSelector
 * Muestra una fila de emojis que representan diferentes niveles de satisfacción
 * El usuario puede seleccionar uno para calificar su experiencia
 */
export const QualificationSelector: React.FC<QualificationSelectorProps> = ({
  selectedQualification,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {/* Encabezado de la sección */}
      <SectionHeader iconName="happy" title="Cuanto disfrutaste este tour?" />

      {/* Contenedor de opciones de calificación */}
      <View style={styles.optionsContainer}>
        {QUALIFICATION_OPTIONS.map((option) => (
          <Pressable
            key={option.id}
            style={[
              styles.optionContainer,
              // Si esta opción está seleccionada, aplicamos el estilo de selección
              selectedQualification === option.id && styles.selectedOption,
            ]}
            onPress={() => onSelect(option.id)}
          >
            {/* Icono del emoji */}
            <MaterialCommunityIcons
              name={option.icon as any}
              size={50}
              color={TOKENS.badgeActive}
            />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 10,
  },
  optionContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    padding: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent", // Sin borde por defecto
  },
  selectedOption: {
    borderColor: TOKENS.badgeActive, // Borde visible cuando está seleccionada
    borderWidth: 2,
    borderRadius: 100,
  },
});
