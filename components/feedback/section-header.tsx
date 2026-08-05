import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Props para el componente SectionHeader
 * @param iconName - Nombre del icono de Ionicons a mostrar
 * @param title - Texto del título de la sección
 */
interface SectionHeaderProps {
  iconName: keyof typeof Ionicons.glyphMap; // Esto asegura que solo uses nombres válidos de iconos
  title: string;
}

/**
 * Componente SectionHeader
 * Un encabezado reutilizable que muestra un icono y un título
 * Se usa para dar estructura visual a las diferentes secciones del formulario
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  iconName,
  title,
}) => {
  return (
    <View style={styles.container}>
      {/* Icono decorativo a la izquierda */}
      <Ionicons name={iconName} size={20} color={TOKENS.accent} />

      {/* Título de la sección */}
      <ThemedText type="subtitle">{title}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
