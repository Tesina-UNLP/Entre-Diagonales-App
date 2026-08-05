import { TOKENS } from "@/constants/colors";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { SectionHeader } from "./section-header";

/**
 * Props para el componente CommentSection
 * @param value - Valor actual del campo de comentarios
 * @param onChangeText - Función que se ejecuta cuando el usuario escribe en el campo
 */
interface CommentSectionProps {
  value: string;
  onChangeText: (text: string) => void;
}

/**
 * Componente CommentSection
 * Muestra un campo de texto multilinea donde el usuario puede escribir
 * comentarios adicionales o sugerencias sobre su experiencia
 */
export const CommentSection: React.FC<CommentSectionProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      {/* Encabezado de la sección */}
      <SectionHeader
        iconName="chatbox-ellipses-outline"
        title="Algo mas que quieras compartir?"
      />

      {/* Campo de texto multilinea */}
      <TextInput
        placeholder="Escribe aqui tu idea o sugerencia..."
        placeholderTextColor={TOKENS.muted}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        multiline={true} // Permite múltiples líneas
        numberOfLines={4} // Número de líneas visibles por defecto
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: TOKENS.muted,
    borderRadius: 10,
    padding: 10,
    height: 100,
    textAlignVertical: "top", // El texto empieza desde arriba
    textAlign: "left",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: TOKENS.text,
    backgroundColor: TOKENS.cardBackground,
  },
});
