/**
 * COMPONENTE: SpotHeader
 *
 * Este componente muestra el encabezado del spot con:
 * - Nombre del lugar
 * - Dirección con un ícono de ubicación
 * - Tag/etiqueta opcional (ej: "Museo", "Parque")
 */

import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { capitalizeFirstLetter } from "@/libs/utils";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { SpotHeaderProps } from "./types";

export const SpotHeader = ({ name, address, tag }: SpotHeaderProps) => {
  return (
    <View style={styles.header}>
      {/* Contenido principal: nombre y ubicación */}
      <View style={styles.headerContent}>
        {/* Nombre del lugar con estilo subtitle (más grande y destacado) */}
        <ThemedText type="subtitle">{name}</ThemedText>

        {/* Contenedor de la ubicación con ícono */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={16} color={TOKENS.accent} />
          <ThemedText type="muted">{address}</ThemedText>
        </View>
      </View>

      {/* Tag/Badge - Solo se muestra si existe */}
      {tag && (
        <View style={styles.tagContainer}>
          <ThemedText style={styles.tagText}>
            {/* Capitaliza la primera letra del tag */}
            {capitalizeFirstLetter(tag)}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    flexDirection: "row", // Alinea el contenido y el tag horizontalmente
    justifyContent: "space-between", // Separa el contenido del tag
    alignItems: "center",
  },
  headerContent: {
    gap: 8, // Espacio entre el nombre y la ubicación
    flex: 1, // Ocupa el espacio disponible
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: "80%", // Evita que el texto se superponga con el tag
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: TOKENS.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100, // Bordes muy redondeados para efecto de píldora
  },
  tagText: {
    color: TOKENS.background,
  },
});
