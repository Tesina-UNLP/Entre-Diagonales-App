import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * QuizActions Component
 *
 * Este componente muestra los botones de acción del quiz:
 * - Botón para enviar la respuesta
 * - Botón para volver al inicio (solo visible después de responder)
 *
 * @param selectedAnswer - ID de la respuesta seleccionada (null si no hay selección)
 * @param correctAnswer - ID de la respuesta correcta (null si aún no se verificó)
 * @param onCheckAnswer - Función a ejecutar cuando se presiona el botón de enviar
 */
interface QuizActionsProps {
  selectedAnswer: number | null;
  correctAnswer: number | null;
  onCheckAnswer: () => void;
}

export const QuizActions: React.FC<QuizActionsProps> = ({
  selectedAnswer,
  correctAnswer,
  onCheckAnswer,
}) => {
  // El botón de enviar está deshabilitado si:
  // - No hay respuesta seleccionada, o
  // - Ya se verificó la respuesta
  const isSubmitDisabled = selectedAnswer === null || correctAnswer !== null;

  return (
    <View style={styles.container}>
      {/* Botón para enviar la respuesta */}
      <ThemedButton
        variant="primary"
        size="small"
        onPress={onCheckAnswer}
        style={styles.button}
        disabled={isSubmitDisabled}
      >
        <FontAwesome name="send" size={16} color={TOKENS.text} />
        <ThemedText type="defaultSemiBold">Enviar mi respuesta</ThemedText>
      </ThemedButton>

      {/* Botón para volver al inicio - solo visible después de responder */}
      {correctAnswer !== null && (
        <ThemedButton
          variant="secondary"
          size="small"
          onPress={() => router.push("/(tabs)")}
          style={styles.button}
        >
          <FontAwesome name="home" size={16} color={TOKENS.primary} />
          <ThemedText type="defaultSemiBold" style={styles.secondaryButtonText}>
            Volver al inicio
          </ThemedText>
        </ThemedButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  secondaryButtonText: {
    color: TOKENS.primary,
  },
});
