import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

// Importamos la imagen de la moneda
const coinImage = require("@/assets/images/coin.png");

/**
 * Props para el componente TourRewards
 * @param xp - Puntos de experiencia ganados
 * @param coins - Monedas ganadas
 */
interface TourRewardsProps {
  xp: number;
  coins: number;
}

/**
 * Componente que muestra las recompensas obtenidas al completar un tour
 * Incluye XP y monedas ganadas
 */
export const TourRewards = ({ xp, coins }: TourRewardsProps) => {
  return (
    <View style={styles.rewardContainer}>
      {/* Sección de XP */}
      <View style={styles.rewardsItem}>
        <ThemedText type="defaultSemiBold" style={styles.xpText}>
          XP
        </ThemedText>
        <ThemedText type="default" style={styles.valueText}>
          {" "}
          +{xp}
        </ThemedText>
      </View>

      {/* Sección de monedas */}
      <View style={styles.rewardsItem}>
        <Image source={coinImage} style={styles.coinImage} />
        <ThemedText type="default" style={styles.valueText}>
          {" "}
          {coins}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rewardContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  xpText: {
    color: TOKENS.accent,
    fontSize: 40,
  },
  valueText: {
    fontSize: 24,
  },
  coinImage: {
    width: 40,
    height: 40,
  },
});
