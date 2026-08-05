/**
 * COMPONENTE: ActionButtons
 *
 * Este componente muestra el botón de acción para abrir Google Maps.
 * La trivia ahora se muestra con QuizChallengeCard de forma más atractiva.
 */

import { ThemedButton } from "@/components/themed-button";
import { Linking, StyleSheet, View } from "react-native";
import { ActionButtonsProps } from "./types";

export const ActionButtons = ({ address }: ActionButtonsProps) => {
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 8, // Espacio entre los botones
  },
});
