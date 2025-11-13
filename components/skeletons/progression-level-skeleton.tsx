import { Skeleton } from "@/components/skeleton";
import React from "react";
import { StyleSheet, View } from "react-native";

// Skeleton para el nivel de progreso
export const ProgressionLevelSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Imagen del nivel skeleton */}
      <Skeleton width={56} height={56} borderRadius={28} />

      {/* Información skeleton */}
      <View style={styles.infoContainer}>
        {/* Experiencia skeleton */}
        <View style={styles.experienceRow}>
          <Skeleton width={40} height={18} borderRadius={4} />
          <Skeleton width={150} height={16} borderRadius={4} />
        </View>

        {/* Progress bar skeleton */}
        <View style={styles.progressBarContainer}>
          <Skeleton width="45%" height={8} borderRadius={4} />
        </View>

        {/* Niveles skeleton */}
        <View style={styles.levelsRow}>
          <Skeleton width={80} height={14} borderRadius={4} />
          <Skeleton width={80} height={14} borderRadius={4} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  infoContainer: {
    justifyContent: "center",
    flex: 1,
    gap: 2,
  },
  experienceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  progressBarContainer: {
    height: 8,
    width: "100%",
    borderRadius: 4,
    marginTop: 8,
  },
  levelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
});
