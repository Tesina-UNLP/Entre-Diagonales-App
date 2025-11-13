import { Skeleton } from "@/components/skeleton";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

// Skeleton para la sección de logros del perfil
export const AchievementsProfileSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.header}>
        <Skeleton width={100} height={20} borderRadius={4} />
        <Skeleton width={70} height={16} borderRadius={4} />
      </View>

      {/* Lista horizontal de logros skeleton */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.achievementItem}>
            <Skeleton width={90} height={90} borderRadius={8} />
          </View>
        ))}
      </ScrollView>
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
  listContainer: {
    gap: 10,
  },
  achievementItem: {
    borderRadius: 8,
  },
});
