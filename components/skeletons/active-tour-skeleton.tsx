import { Skeleton } from "@/components/skeleton";
import { TOKENS } from "@/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

// Skeleton para el tour activo
export const ActiveTourSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Título skeleton */}
      <Skeleton
        width={120}
        height={20}
        borderRadius={4}
        style={styles.subtitle}
      />

      {/* Card skeleton */}
      <View style={styles.card}>
        {/* Header row skeleton */}
        <View style={styles.headerRow}>
          <View style={styles.leftRow}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <Skeleton width={150} height={18} borderRadius={4} />
          </View>
          <Skeleton width={70} height={24} borderRadius={100} />
        </View>

        {/* Descripción skeleton */}
        <Skeleton width="100%" height={16} borderRadius={4} />
        <Skeleton width="80%" height={16} borderRadius={4} />

        {/* Progress bar skeleton */}
        <View style={styles.progressBarContainer}>
          <Skeleton width="60%" height={8} borderRadius={4} />
        </View>

        {/* Footer skeleton */}
        <Skeleton width={180} height={14} borderRadius={4} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 4,
  },
  card: {
    flexDirection: "column",
    gap: 10,
    backgroundColor: TOKENS.cardBackground,
    padding: 16,
    borderRadius: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBarContainer: {
    marginTop: 8,
  },
});
