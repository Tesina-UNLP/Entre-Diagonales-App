import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

/**
 * QuizAnswer Component
 *
 * Este componente representa una opción de respuesta individual en el quiz.
 * Maneja el estado visual según si está seleccionada, es correcta o incorrecta.
 *
 * @param letter - La letra identificadora de la respuesta (A, B, C, etc.)
 * @param text - El texto de la respuesta
 * @param isSelected - Si esta respuesta fue seleccionada por el usuario
 * @param isCorrect - Si esta es la respuesta correcta
 * @param isIncorrect - Si esta respuesta fue seleccionada pero es incorrecta
 * @param isAnswered - Si el quiz ya fue respondido (deshabilita la interacción)
 * @param onPress - Función a ejecutar cuando se presiona la respuesta
 */
interface QuizAnswerProps {
  letter: string;
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  isIncorrect: boolean;
  isAnswered: boolean;
  onPress: () => void;
}

export const QuizAnswer: React.FC<QuizAnswerProps> = ({
  letter,
  text,
  isSelected,
  isCorrect,
  isIncorrect,
  isAnswered,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        // Mostrar borde si está seleccionada pero aún no verificada
        isSelected && !isAnswered && styles.selected,
        // Mostrar fondo verde si es la respuesta correcta (después de verificar)
        isCorrect && isAnswered && styles.correct,
        // Mostrar fondo rojo si es incorrecta
        isIncorrect && styles.incorrect,
      ]}
      onPress={onPress}
      disabled={isAnswered} // Deshabilitar después de verificar
    >
      <ThemedText type="defaultSemiBold">{letter}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.text}>
        {text}
      </ThemedText>

      {/* Mostrar ícono de check si es la respuesta correcta */}
      {isCorrect && isAnswered && (
        <FontAwesome name="check-circle" size={24} color={TOKENS.text} />
      )}

      {/* Mostrar ícono de X si es la respuesta incorrecta */}
      {isIncorrect && (
        <FontAwesome name="times-circle" size={24} color={TOKENS.text} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 18,
    gap: 20,
  },
  selected: {
    borderColor: TOKENS.badgeActive,
    borderWidth: 2,
  },
  correct: {
    backgroundColor: TOKENS.success,
  },
  incorrect: {
    backgroundColor: TOKENS.error,
  },
  text: {
    flex: 1,
    textAlign: "justify",
    textAlignVertical: "center",
    justifyContent: "center",
    alignItems: "center",
    lineHeight: 20,
    maxWidth: "90%",
  },
});
