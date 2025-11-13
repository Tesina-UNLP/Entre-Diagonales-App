import { Skeleton } from "@/components/skeleton";
import React from "react";
import { StyleSheet, View } from "react-native";

// Skeleton para el header de la pantalla de tours
export const ToursHeaderSkeleton = () => {
  return (
    <View style={styles.header}>
      {/* Título skeleton */}
      <Skeleton width={250} height={28} borderRadius={4} />
      {/* Descripción skeleton */}
      <Skeleton
        width={200}
        height={16}
        borderRadius={4}
        style={styles.description}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  description: {
    marginTop: 8,
  },
});
