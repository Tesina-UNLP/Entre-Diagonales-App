/**
 * COMPONENTE: VisitInfoSection
 *
 * Este componente muestra información práctica para visitar el lugar:
 * - Horarios de apertura
 * - Precio de entrada
 * - Accesibilidad para sillas de ruedas
 *
 * Solo muestra los campos que tienen información disponible.
 */

import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { VisitInfoSectionProps } from "./types";

export const VisitInfoSection = ({
  schedule,
  ticketPrice,
  wheelchairAccessible,
}: VisitInfoSectionProps) => {
  return (
    <View style={styles.container}>
      {/* Título de la sección */}
      <View style={[styles.infoRow, { marginBottom: 8 }]}>
        <FontAwesome6 name="door-open" size={18} color={TOKENS.accent} />
        <ThemedText type="defaultSemiBold">
          Informacion para la visita
        </ThemedText>
      </View>

      {/* Horarios - Solo se muestra si existe la información */}
      {schedule && (
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color={TOKENS.muted} />
          <ThemedText style={styles.infoText}>{schedule}</ThemedText>
        </View>
      )}

      {/* Precio de entrada - Solo se muestra si el precio no es null */}
      {ticketPrice !== null && ticketPrice !== undefined && (
        <View style={styles.infoRow}>
          <Ionicons name="ticket" size={20} color={TOKENS.muted} />
          <ThemedText type="muted">Entrada: ${ticketPrice}</ThemedText>
        </View>
      )}

      {/* Accesibilidad - Solo se muestra si es accesible */}
      {wheelchairAccessible && (
        <View style={styles.infoRow}>
          <FontAwesome6 name="accessible-icon" size={20} color={TOKENS.muted} />
          <ThemedText style={styles.infoText}>
            Accesible para sillas de ruedas
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 12, // Espacio entre cada fila de información
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // Espacio entre el ícono y el texto
    maxWidth: "80%",
  },
  infoText: {
    fontSize: 14,
    color: TOKENS.muted,
  },
});
