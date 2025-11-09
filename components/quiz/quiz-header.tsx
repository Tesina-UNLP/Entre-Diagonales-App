import { ThemedText } from "@/components/themed-text";
import { TourRewards } from "@/components/tour-completion";
import { COINS_PER_QUIZ, XP_PER_QUIZ } from "@/constants/gamification";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * QuizHeader Component
 *
 * Este componente muestra el encabezado del quiz con el título
 * y las recompensas (XP y monedas) que el usuario puede ganar.
 */
export const QuizHeader = () => {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Hora de trivia</ThemedText>
      <TourRewards xp={XP_PER_QUIZ} coins={COINS_PER_QUIZ} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});
