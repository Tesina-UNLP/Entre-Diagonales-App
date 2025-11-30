import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";
import CoinIcon from "../icons/coin";

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
        <CoinIcon height={30} width={30} />
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
    gap: 5,
  },
  xpText: {
    color: TOKENS.accent,
    fontSize: 28,
    height: 30,
    lineHeight: 30,
    textAlignVertical: "center",
  },
  valueText: {
    fontSize: 28,
  },
  coinImage: {
    width: 30,
    height: 30,
  },
});
