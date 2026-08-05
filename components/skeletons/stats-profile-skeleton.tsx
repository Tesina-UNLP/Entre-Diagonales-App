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
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={styles.textContainer}>
          <Skeleton width={80} height={18} borderRadius={4} />
          <Skeleton width={100} height={16} borderRadius={4} />
        </View>
      </View>

      {/* Progress bar skeleton */}
      <View style={styles.levelProgressionContainer}>
        <View style={styles.levelProgressBarContainer}>
          <Skeleton width="45%" height={10} borderRadius={4} />
        </View>
        <View style={styles.levelProgressPlan}>
          <Skeleton width={60} height={16} borderRadius={4} />
          <Skeleton width={100} height={16} borderRadius={4} />
        </View>
      </View>

      {/* Stats skeleton */}
      <View style={styles.statsContainer}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.statsItem}>
            <Skeleton width={18} height={18} borderRadius={9} />
            <Skeleton width={60} height={32} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: TOKENS.cardBackground,
    paddingHorizontal: 21,
    paddingVertical: 17,
    borderRadius: 16,
    gap: 10,
    marginBottom: 20,
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
    height: 10,
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
  },
  statsItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
