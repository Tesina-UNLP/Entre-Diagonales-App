/**
 * COMPONENTE: HistoricalSection
 *
 * Este componente muestra la información histórica del lugar.
 * Incluye un encabezado con ícono y el texto de contexto histórico.
 */

import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { HistoricalSectionProps } from "./types";

export const HistoricalSection = ({
  historicalInfo,
}: HistoricalSectionProps) => {
  return (
    <View style={styles.section}>
      {/* Encabezado con ícono de reloj y título */}
      <View style={styles.header}>
        <Ionicons name="time-outline" size={20} color={TOKENS.accent} />
        <ThemedText type="defaultSemiBold">Contexto Histórico</ThemedText>
      </View>

      {/* Texto con la información histórica */}
      <ThemedText>{historicalInfo}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    gap: 8, // Espacio entre el encabezado y el texto
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // Espacio entre el ícono y el título
    marginBottom: 8,
  },
});
