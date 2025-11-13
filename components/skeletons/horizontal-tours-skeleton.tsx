import { Skeleton } from "@/components/skeleton";
import { TOKENS } from "@/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

// Skeleton para la lista horizontal de tours
export const HorizontalToursSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header del skeleton */}
      <View style={styles.headerRow}>
        <Skeleton width={150} height={20} borderRadius={4} />
        <Skeleton width={80} height={20} borderRadius={4} />
      </View>

      {/* Lista horizontal de cards skeleton */}
      <View style={styles.horizontalList}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.card}>
            {/* Imagen skeleton */}
            <Skeleton width="100%" height="100%" borderRadius={12} />
            {/* Contenido del card */}
            <View style={styles.cardContent}>
              {/* Tag skeleton */}
              <View style={styles.tagRow}>
                <Skeleton width={60} height={16} borderRadius={4} />
              </View>
              {/* Título skeleton */}
              <Skeleton
                width={120}
                height={18}
                borderRadius={4}
                style={styles.title}
              />
              {/* Footer skeleton */}
              <View style={styles.footerRow}>
                <Skeleton width={50} height={14} borderRadius={4} />
                <Skeleton width={50} height={14} borderRadius={4} />
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
    marginTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  horizontalList: {
    flexDirection: "row",
    gap: 12,
  },
  card: {
    width: 180,
    height: 223,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: TOKENS.cardBackground,
    position: "relative",
  },
  cardContent: {
    position: "absolute",
    bottom: 8,
    left: 15,
    right: 15,
    gap: 4,
  },
  tagRow: {
    marginBottom: 4,
  },
  title: {
    marginTop: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
});
