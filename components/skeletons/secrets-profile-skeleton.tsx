import { Skeleton } from "@/components/skeleton";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { TOKENS } from "@/constants/colors";

// Skeleton para la sección de secretos del perfil
export const SecretsProfileSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.header}>
        <View style={styles.headingGroup}>
          <Skeleton width={90} height={20} borderRadius={4} />
          <Skeleton width={70} height={14} borderRadius={4} />
        </View>
        <Skeleton width={70} height={16} borderRadius={4} />
      </View>

      {/* Lista horizontal de secretos skeleton */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.secretItem}>
            <Skeleton width={86} height={86} borderRadius={8} />
            <Skeleton width={72} height={12} borderRadius={4} />
          </View>
        ))}
      </ScrollView>
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
  listContainer: {
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TOKENS.tabBarInactive + "65",
  },
  secretItem: {
    width: 96,
    alignItems: "center",
    gap: 4,
  },
  headingGroup: { gap: 4 },
});
