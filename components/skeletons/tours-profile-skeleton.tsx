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
        <View style={styles.headingGroup}>
          <Skeleton width={70} height={20} borderRadius={4} />
          <Skeleton width={140} height={14} borderRadius={4} />
        </View>
        <Skeleton width={70} height={16} borderRadius={4} />
      </View>

      {/* Lista de tours skeleton */}
      <View style={styles.tourList}>
        {[1, 2].map((item) => (
          <View key={item} style={styles.tourItem}>
            <Skeleton
              width={12}
              height={12}
              borderRadius={6}
              style={styles.routeMarker}
            />
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
              <Skeleton width={56} height={5} borderRadius={999} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tourList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TOKENS.tabBarInactive + "65",
  },
  tourItem: {
    minHeight: 104,
    paddingLeft: 24,
    paddingRight: 2,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TOKENS.tabBarInactive + "65",
    position: "relative",
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
  routeMarker: {
    position: "absolute",
    left: 0,
    top: 20,
  },
  headingGroup: { gap: 4 },
});
