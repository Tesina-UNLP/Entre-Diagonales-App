import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { TourApiResponse } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

const SecretsProfile = () => {
  const { user } = useAuth();
  const [tours, setTours] = useState<TourApiResponse[]>([]);

  // Obtener las rutas del usuario desde la API
  const handleGetTours = useCallback(async () => {
    if (user) {
      const response = await api.getRoutes(user.access);

      if (response) {
        setTours(response);
      }
    }
  }, [user]);

  useEffect(() => {
    handleGetTours();
  }, [handleGetTours]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Rutas realizados</ThemedText>
        <Link asChild href={{ pathname: "/(tabs)/tours" }}>
          <ThemedText type="muted">Ver todos</ThemedText>
        </Link>
      </View>
      <View style={styles.tourList}>
        {tours
          .filter((tour) => tour.started)
          .map((tour) => (
            <TourItem key={tour.id} tour={tour} />
          ))}
      </View>
    </View>
  );
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TourItem = ({ tour }: { tour: TourApiResponse }) => {
  const progressNumber = (
    (Number(tour.progress) / (tour.spots.length || 0)) *
    100
  ).toFixed(0);
  return (
    <TouchableOpacity
      style={styles.tourItem}
      onPress={() => router.navigate(`/(tabs)/tours/${tour.id}`)}
    >
      <View style={styles.tourItemContent}>
        <ThemedText type="defaultSemiBold" style={styles.tourItemTitle}>
          {tour.name}
        </ThemedText>
        <ThemedText type="default" style={styles.tourItemCompleted}>
          {tour.completed_at
            ? "Completado · " + formatDate(tour.completed_at)
            : "En progreso"}
        </ThemedText>
        <View style={styles.tourItemStopsContainer}>
          <Ionicons name="footsteps" size={14} color={TOKENS.badgeActive} />
          <ThemedText type="defaultSemiBold" style={styles.tourItemStops}>
            {tour.spots.length} paradas
          </ThemedText>
        </View>
      </View>

      {/* barra de progreso */}
      <View style={styles.progressRow}>
        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.progressPercent,
            progressNumber === "100" ? styles.progressPercentCompleted : {},
          ]}
        >
          {progressNumber}%
        </ThemedText>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              progressNumber === "100"
                ? styles.progressFillCompleted
                : { width: `${progressNumber}%` as any },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // Removido flex: 1 para permitir que el gap funcione correctamente
    gap: 10,
    marginBottom: 20,
  },
  tourList: {
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secretImage: {
    width: 90,
    height: 90,
  },
  // tour item
  tourItem: {
    backgroundColor: TOKENS.cardBackground,
    paddingHorizontal: 21,
    paddingVertical: 17,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tourItemTitle: {
    fontSize: 16,
  },
  tourItemContent: {
    flex: 1,
    gap: 4,
  },
  tourItemStops: {
    fontSize: 14,
    color: TOKENS.badgeActive,
  },
  tourItemCompleted: {
    fontSize: 14,
  },
  tourItemStopsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  progressRow: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
  },
  progressTrack: {
    width: 56,
    height: 10,
    backgroundColor: TOKENS.badgeActive,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    backgroundColor: TOKENS.primary,
    borderRadius: 999,
  },
  progressFillCompleted: {
    backgroundColor: TOKENS.navActive,
  },
  progressPercentCompleted: {
    color: TOKENS.navActive,
  },
  progressPercent: { color: TOKENS.badgeActive, fontSize: 18 },
});

export default SecretsProfile;
