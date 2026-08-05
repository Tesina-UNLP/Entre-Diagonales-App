import { Skeleton } from "@/components/skeleton";
import React from "react";
import { StyleSheet, View } from "react-native";

// Skeleton para el header del perfil
export const HeaderProfileSkeleton = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {/* Avatar skeleton */}
        <Skeleton width={64} height={64} borderRadius={32} />
        <View style={styles.headerLeftTextContainer}>
          {/* Nombre skeleton */}
          <Skeleton width={120} height={18} borderRadius={4} />
          {/* Gems y coins skeleton */}
          <View style={styles.headerLocation}>
            <Skeleton width={60} height={16} borderRadius={4} />
            <Skeleton width={60} height={16} borderRadius={4} />
          </View>
        </View>
      </View>

      {/* Botón de configuración skeleton */}
      <View style={styles.headerRight}>
        <Skeleton width={24} height={24} borderRadius={12} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
});
