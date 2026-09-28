import { Skeleton } from "@/components/skeleton";
import React from "react";
import { StyleSheet, View } from "react-native";

// Skeleton para el header del perfil
export const HeaderProfileSkeleton = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {/* Avatar skeleton */}
        <Skeleton width={62} height={62} borderRadius={31} />
        <View style={styles.headerLeftTextContainer}>
          {/* Nombre skeleton */}
          <Skeleton width={132} height={20} borderRadius={4} />
          {/* Gems y coins skeleton */}
          <View style={styles.headerLocation}>
            <Skeleton width={48} height={18} borderRadius={4} />
            <View style={styles.resourceDivider} />
            <Skeleton width={48} height={18} borderRadius={4} />
          </View>
        </View>
      </View>

      {/* Botón de configuración skeleton */}
      <View style={styles.headerRight}>
        <Skeleton width={30} height={30} borderRadius={15} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLeftTextContainer: {
    gap: 4,
    alignItems: "flex-start",
  },
  headerLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  resourceDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(140, 188, 176, 0.35)",
  },
});
