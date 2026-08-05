import { Skeleton } from "@/components/skeleton";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

// Skeleton para los filtros de tours (tags y niveles)
export const ToursFiltersSkeleton = () => {
  return (
    <>
      {/* Filtros de categorías skeleton */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgeContainer}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <View key={item} style={styles.badge}>
              <Skeleton width={100} height={36} borderRadius={20} />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Filtros de niveles skeleton */}
      <View style={[styles.filterSection, { marginBottom: 20 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgeContainer}
        >
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.badge}>
              <Skeleton width={80} height={36} borderRadius={20} />
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    marginBottom: 10,
  },
  badgeContainer: {
    paddingRight: 20,
    gap: 8,
  },
  badge: {
    borderRadius: 20,
  },
});
