import { Skeleton } from "@/components/skeleton";
import { TOKENS } from "@/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

// Skeleton para las estadísticas del perfil
export const StatsProfileSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Level información skeleton */}
      <View style={styles.statsProfileItem}>
        <Skeleton width={64} height={64} borderRadius={32} />
        <View style={styles.textContainer}>
          <Skeleton width={108} height={28} borderRadius={4} />
          <Skeleton width={128} height={18} borderRadius={4} />
        </View>
      </View>

      {/* Progress bar skeleton */}
      <View style={styles.levelProgressionContainer}>
        <View style={styles.levelProgressBarContainer}>
          <Skeleton width="45%" height={6} borderRadius={999} />
        </View>
        <View style={styles.levelProgressPlan}>
          <Skeleton width={60} height={14} borderRadius={4} />
          <Skeleton width={100} height={14} borderRadius={4} />
        </View>
      </View>

      {/* Stats skeleton */}
      <View style={styles.statsContainer}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.statsItem}>
            <Skeleton width={50} height={20} borderRadius={4} />
            <Skeleton width={72} height={12} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  statsProfileItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  levelProgressBarContainer: {
    height: 6,
    width: "100%",
    borderRadius: 4,
    position: "relative",
  },
  levelProgressionContainer: {
    flexDirection: "column",
    gap: 2,
    width: "100%",
  },
  levelProgressPlan: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.tabBarInactive + "65",
  },
  statsItem: {
    flex: 1,
    gap: 5,
    paddingHorizontal: 8,
  },
});
