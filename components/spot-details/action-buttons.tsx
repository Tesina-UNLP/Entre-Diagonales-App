/**
 * COMPONENTE: ActionButtons
 *
 * Este componente muestra los botones de acción principales:
 * 1. Botón para abrir Google Maps con la dirección del lugar
 * 2. Botón para realizar la trivia (solo si no está resuelta y existe)
 */

import { ThemedButton } from "@/components/themed-button";
import { router } from "expo-router";
import { Linking, StyleSheet, View } from "react-native";
import { ActionButtonsProps } from "./types";

export const ActionButtons = ({
  address,
  quizSolved,
  hasQuiz,
  quizId,
}: ActionButtonsProps) => {
  /**
   * Abre Google Maps en el navegador o app con la dirección del lugar.
   * Usa la API de búsqueda de Google Maps.
   */
  const handleOpenMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
    Linking.openURL(mapsUrl);
  };

  return (
    <View style={styles.container}>
      {/* Botón de Google Maps - Siempre visible */}
      <ThemedButton variant="accent" size="small" onPress={handleOpenMaps}>
        Ir a Google Maps
      </ThemedButton>

      {/* Botón de trivia - Solo se muestra si NO está resuelta y SI existe */}
      {!quizSolved && hasQuiz && (
        <ThemedButton
          variant="primary"
          size="small"
          // TODO: Descomentar cuando esté lista la navegación a la trivia
          onPress={() =>
            router.navigate({
              pathname: "/(stack)/quizzes/[id]",
              params: { id: quizId?.toString() },
            })
          }
        >
          Realizar trivia de este lugar
        </ThemedButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 8, // Espacio entre los botones
  },
});
