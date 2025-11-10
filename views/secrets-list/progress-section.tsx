import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import { CircleProgress } from "./circle-progress";

/**
 * Sección de progreso que muestra cuántos secretos han sido encontrados
 *
 * @param obtained - Cantidad de secretos obtenidos
 * @param total - Cantidad total de secretos
 */
interface ProgressSectionProps {
  obtained: number;
  total: number;
}

export const ProgressSection = ({ obtained, total }: ProgressSectionProps) => {
  // Determinar si se completó la colección
  const isComplete = obtained === total;

  return (
    <View style={styles.progressSection}>
      {/* Indicador circular de progreso */}
      <View style={styles.progressIconContainer}>
        <CircleProgress obtained={obtained} total={total} size={60} />
      </View>

      {/* Textos de progreso */}
      <View style={styles.progressTextContainer}>
        <ThemedText type="defaultSemiBold">
          {obtained}/{total} secretos encontrados
        </ThemedText>
        <ThemedText type="muted">
          {isComplete
            ? "¡Felicitaciones! Completaste tu colección"
            : "Sigue explorando para completar tu colección!"}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressSection: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 18,
    marginBottom: 20,
  },
  progressIconContainer: {
    padding: 10,
    alignSelf: "center",
  },
  progressTextContainer: {
    flex: 1,
  },
});
