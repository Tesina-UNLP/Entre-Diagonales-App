import { Skeleton } from "@/components/skeleton";
import React from "react";
import { StyleSheet, View } from "react-native";

// Skeleton para el header de la pantalla de inicio
export const HeaderHomeSkeleton = () => {
  return (
    <View style={styles.header}>
      {/* Lado izquierdo: Avatar y texto */}
      <View style={styles.headerLeft}>
        {/* Avatar skeleton */}
        <Skeleton width={48} height={48} borderRadius={24} />
        <View style={styles.headerLeftTextContainer}>
          {/* Ubicación skeleton */}
          <Skeleton width={80} height={16} borderRadius={4} />
          {/* Saludo skeleton */}
          <Skeleton width={120} height={18} borderRadius={4} />
        </View>
      </View>

      {/* Lado derecho: Clima skeleton */}
      <View style={styles.headerRight}>
        <View style={styles.headerRightWeather}>
          {/* Ícono del clima skeleton */}
          <Skeleton width={20} height={20} borderRadius={10} />
          {/* Temperatura skeleton */}
          <Skeleton width={40} height={18} borderRadius={4} />
        </View>
        {/* Condición del clima skeleton */}
        <Skeleton width={60} height={16} borderRadius={4} />
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
  headerRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  headerRightWeather: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
