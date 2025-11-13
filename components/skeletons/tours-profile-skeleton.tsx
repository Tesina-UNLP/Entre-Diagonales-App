import { Skeleton } from "@/components/skeleton";
import { TOKENS } from "@/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

// Skeleton para la sección de tours del perfil
export const ToursProfileSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.header}>
        <Skeleton width={150} height={20} borderRadius={4} />
        <Skeleton width={70} height={16} borderRadius={4} />
      </View>

      {/* Lista de tours skeleton */}
      <View style={styles.tourList}>
        {[1, 2].map((item) => (
          <View key={item} style={styles.tourItem}>
            <View style={styles.tourItemContent}>
              {/* Título skeleton */}
              <Skeleton width={180} height={18} borderRadius={4} />
              {/* Estado skeleton */}
              <Skeleton width={120} height={16} borderRadius={4} />
              {/* Paradas skeleton */}
              <Skeleton width={80} height={16} borderRadius={4} />
            </View>

            {/* Progress skeleton */}
            <View style={styles.progressRow}>
              <Skeleton width={35} height={18} borderRadius={4} />
              <View style={styles.progressTrack}>
                <Skeleton width="60%" height={10} borderRadius={999} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tourList: {
    gap: 10,
  },
  tourItem: {
    backgroundColor: TOKENS.cardBackground,
    paddingHorizontal: 21,
    paddingVertical: 17,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tourItemContent: {
    flex: 1,
    gap: 4,
  },
  progressRow: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
  },
  progressTrack: {
    width: 56,
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
});
