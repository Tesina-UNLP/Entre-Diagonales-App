import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Props para el componente TourStatistics
 * @param secretsCompleted - Número de secretos descubiertos
 * @param secretsTotal - Total de secretos disponibles
 * @param triviasCompleted - Número de trivias respondidas
 * @param triviasTotal - Total de trivias disponibles
 */
interface TourStatisticsProps {
  secretsCompleted: number;
  secretsTotal: number;
  triviasCompleted: number;
  triviasTotal: number;
}

/**
 * Componente que muestra las estadísticas del tour completado
 * Incluye información sobre secretos descubiertos y trivias respondidas
 */
export const TourStatistics = ({
  secretsCompleted,
  secretsTotal,
  triviasCompleted,
  triviasTotal,
}: TourStatisticsProps) => {
  return (
    <View style={styles.informationContainer}>
      {/* Card de secretos descubiertos */}
      <View style={styles.informationItem}>
        <ThemedText type="muted">Secretos descubiertos</ThemedText>
        <View style={styles.informationItemValue}>
          <FontAwesome6 name="diamond" size={16} color={TOKENS.accent} />
          <ThemedText type="defaultSemiBold">
            {secretsCompleted}/{secretsTotal}
          </ThemedText>
        </View>
      </View>

      {/* Card de trivias respondidas */}
      <View style={styles.informationItem}>
        <ThemedText type="muted">Trivias respondidas</ThemedText>
        <View style={styles.informationItemValue}>
          <FontAwesome6
            name="question-circle"
            size={16}
            color={TOKENS.accent}
          />
          <ThemedText type="defaultSemiBold">
            {triviasCompleted}/{triviasTotal}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  informationContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  informationItem: {
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: TOKENS.cardBackground,
  },
  informationItemValue: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
