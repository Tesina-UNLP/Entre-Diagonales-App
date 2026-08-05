import { Skeleton } from "@/components/skeleton";
import { TOKENS } from "@/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

// Skeleton para la pantalla completa de ranking
export const RankingScreenSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Título y descripción skeleton */}
      <View style={styles.header}>
        <Skeleton width="60%" height={28} borderRadius={6} />
        <Skeleton
          width="80%"
          height={18}
          borderRadius={4}
          style={styles.description}
        />
      </View>

      {/* Tabs skeleton */}
      <View style={styles.tabContainer}>
        <Skeleton width="48%" height={44} borderRadius={8} />
        <Skeleton width="48%" height={44} borderRadius={8} />
      </View>

      {/* User Ranking Card skeleton */}
      <UserRankingCardSkeleton />

      {/* Podium skeleton */}
      <View style={styles.podiumContainer}>
        <PodiumItemSkeleton position={2} />
        <PodiumItemSkeleton position={1} />
        <PodiumItemSkeleton position={3} />
      </View>

      {/* Lista de usuarios skeleton */}
      <View style={styles.listContainer}>
        <RankingRowSkeleton />
        <RankingRowSkeleton />
        <RankingRowSkeleton />
        <RankingRowSkeleton />
      </View>
    </View>
  );
};

// Skeleton para la tarjeta del usuario actual
export const UserRankingCardSkeleton = () => {
  return (
    <View style={styles.userCard}>
      {/* Avatar y posición */}
      <View style={styles.userLeft}>
        <Skeleton width={50} height={50} borderRadius={25} />
        {/* Círculo de posición superpuesto */}
        <View style={styles.positionCircle}>
          <Skeleton width={16} height={16} borderRadius={4} />
        </View>
      </View>

      {/* Info central */}
      <View style={styles.userCenter}>
        <Skeleton width={100} height={18} borderRadius={4} />
        <Skeleton
          width={80}
          height={14}
          borderRadius={4}
          style={styles.userPoints}
        />
      </View>

      {/* Badge */}
      <Skeleton width={60} height={32} borderRadius={10} />
    </View>
  );
};

// Skeleton para un item del podio
const PodiumItemSkeleton = ({ position }: { position: 1 | 2 | 3 }) => {
  const config = {
    1: { size: 80, offset: 0 },
    2: { size: 64, offset: 20 },
    3: { size: 60, offset: 45 },
  };

  const { size, offset } = config[position];

  return (
    <View style={[styles.podiumItem, { marginTop: offset }]}>
      {/* Avatar */}
      <Skeleton width={size} height={size} borderRadius={size / 2} />

      {/* Nombre y puntos */}
      <View style={styles.podiumInfo}>
        <Skeleton width={70} height={14} borderRadius={4} />
        <Skeleton
          width={60}
          height={14}
          borderRadius={4}
          style={styles.podiumText}
        />
        <Skeleton
          width={48}
          height={position === 1 ? 48 : 28}
          borderRadius={6}
          style={styles.podiumBadge}
        />
      </View>
    </View>
  );
};

// Skeleton para una fila de ranking
const RankingRowSkeleton = () => {
  return (
    <View style={styles.rowCard}>
      {/* Posición */}
      <Skeleton width={28} height={28} borderRadius={14} />

      {/* Avatar */}
      <Skeleton width={44} height={44} borderRadius={22} />

      {/* Info */}
      <View style={styles.rowInfo}>
        <Skeleton width={120} height={18} borderRadius={4} />
        <Skeleton
          width={80}
          height={14}
          borderRadius={4}
          style={styles.rowPoints}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
  },

  // Header styles
  header: {
    marginBottom: 20,
  },
  description: {
    marginTop: 8,
  },

  // Tabs styles
  tabContainer: {
    flexDirection: "row",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 8,
  },

  // User card styles
  userCard: {
    flexDirection: "row",
    backgroundColor: TOKENS.cardBackground,
    paddingVertical: 13,
    paddingHorizontal: 17,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  userLeft: {
    position: "relative",
    marginRight: 20,
  },
  positionCircle: {
    position: "absolute",
    top: -6,
    left: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  userCenter: {
    flex: 1,
    gap: 6,
  },
  userPoints: {
    marginTop: 4,
  },

  // Podium styles
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
    marginHorizontal: 20,
    gap: 8,
  },
  podiumItem: {
    alignItems: "center",
    width: 110,
  },
  podiumInfo: {
    alignItems: "center",
    marginTop: 10,
    gap: 4,
  },
  podiumText: {
    marginTop: 4,
  },
  podiumBadge: {
    marginTop: 6,
  },

  // List styles
  listContainer: {
    gap: 12,
  },

  // Row card styles
  rowCard: {
    backgroundColor: TOKENS.cardBackground,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowInfo: {
    flex: 1,
    gap: 6,
  },
  rowPoints: {
    marginTop: 4,
  },
});
