import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Props para el componente CompletionActions
 * @param tourId - ID del tour completado
 * @param onShare - Función callback para compartir el logro
 */
interface CompletionActionsProps {
  tourId: string;
  onShare: () => void;
}

/**
 * Componente que muestra los botones de acción después de completar un tour
 * Incluye: Ver progreso, Iniciar otro recorrido, Compartir logro
 */
export const CompletionActions = ({
  tourId,
  onShare,
}: CompletionActionsProps) => {
  // Función para navegar a la pantalla de detalles del tour
  const handleViewProgress = () => {
    router.push({
      pathname: "/(stack)/tours/[id]",
      params: { id: tourId },
    });
  };

  // Función para navegar a la lista de tours
  const handleStartAnother = () => {
    router.push({
      pathname: "/(tabs)/tours",
    });
  };

  return (
    <View style={styles.buttonsContainer}>
      {/* Botón para ver el progreso del tour */}
      <ThemedButton
        variant="primary"
        size="small"
        style={styles.button}
        onPress={handleViewProgress}
      >
        <FontAwesome name="line-chart" size={16} color={TOKENS.text} />
        <ThemedText type="defaultSemiBold">Ver mi progreso</ThemedText>
      </ThemedButton>

      {/* Botón para iniciar otro recorrido */}
      <ThemedButton
        variant="accent"
        size="small"
        style={styles.button}
        onPress={handleStartAnother}
      >
        <FontAwesome name="play-circle" size={16} color={TOKENS.primary} />
        <ThemedText type="defaultSemiBold" style={styles.accentButtonText}>
          Iniciar otro recorrido
        </ThemedText>
      </ThemedButton>

      {/* Botón para compartir el logro */}
      <ThemedButton
        variant="secondary"
        size="small"
        style={styles.button}
        onPress={onShare}
      >
        <FontAwesome name="share" size={16} color={TOKENS.primary} />
        <ThemedText type="defaultSemiBold" style={styles.accentButtonText}>
          Compartir logro
        </ThemedText>
      </ThemedButton>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  accentButtonText: {
    color: TOKENS.primary,
  },
});
