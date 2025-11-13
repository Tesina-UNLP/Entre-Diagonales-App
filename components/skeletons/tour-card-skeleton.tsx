import { Skeleton } from "@/components/skeleton";
import { TOKENS } from "@/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

// Skeleton para un TourCard
export const TourCardSkeleton = () => {
  return (
    <View style={styles.tourCard}>
      {/* Imagen skeleton */}
      <View style={styles.tourImageWrapper}>
        <Skeleton width="100%" height={140} borderRadius={0} />
        {/* Chip de categoría skeleton */}
        <View style={styles.categoryChip}>
          <Skeleton width={80} height={28} borderRadius={100} />
        </View>
      </View>

      {/* Contenido inferior skeleton */}
      <View style={styles.tourContent}>
        {/* Fila del título */}
        <View style={styles.titleRow}>
          <Skeleton width={180} height={20} borderRadius={4} />
          <Skeleton width={70} height={24} borderRadius={100} />
        </View>

        {/* Descripción skeleton */}
        <Skeleton width="100%" height={16} borderRadius={4} />
        <Skeleton width="80%" height={16} borderRadius={4} />

        {/* Barra de progreso skeleton */}
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <Skeleton width="60%" height={10} borderRadius={999} />
          </View>
          <Skeleton width={35} height={16} borderRadius={4} />
        </View>

        {/* Botón skeleton */}
        <Skeleton width="100%" height={40} borderRadius={8} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tourCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  tourImageWrapper: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  categoryChip: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  tourContent: {
    gap: 10,
    backgroundColor: TOKENS.cardBackground,
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
});
