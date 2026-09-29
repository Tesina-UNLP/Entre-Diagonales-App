import { Skeleton } from "@/components/skeleton";
import { TOKENS } from "@/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

// Skeleton para el mensaje del día
export const MessageOfTheDaySkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Icono skeleton */}
      <Skeleton width={28} height={28} borderRadius={14} />

      {/* Texto skeleton */}
      <View style={styles.textContainer}>
        <Skeleton width="80%" height={18} borderRadius={4} />
        <Skeleton
          width="60%"
          height={16}
          borderRadius={4}
          style={styles.description}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 14,
    paddingVertical: 16,
    alignItems: "flex-start",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.tabBarInactive + "65",
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  description: {
    marginTop: 4,
  },
});
