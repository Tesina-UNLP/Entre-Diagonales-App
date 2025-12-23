import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import CoinIcon from "../icons/coin";
import { Ionicons } from "@expo/vector-icons";

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
        <Ionicons name="star" size={20} color={TOKENS.warning} />
        <ThemedText type="default"> +{xp}</ThemedText>
      </View>

      {/* Sección de monedas */}
      <View style={styles.rewardsItem}>
        <CoinIcon height={25} width={25} />
        <ThemedText type="default"> {coins}</ThemedText>
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
    gap: 5,
  },
  xpText: {
    color: TOKENS.accent,
    fontSize: 28,
    lineHeight: 34,
  },
  coinImage: {
    width: 25,
    height: 25,
  },
});
