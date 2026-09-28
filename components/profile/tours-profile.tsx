import { ToursProfileSkeleton } from "@/components/skeletons/tours-profile-skeleton";
import { TOKENS } from "@/constants/colors";
import { TourApiResponse } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "react-i18next";

// Ahora este componente recibe los datos por props desde el componente padre
// Esto evita hacer llamadas API redundantes y mejora el rendimiento
interface ToursProfileProps {
  data: TourApiResponse[];
  loading: boolean;
}

const ToursProfile = ({ data, loading }: ToursProfileProps) => {
  const { t } = useTranslation();
  const startedTours = data.filter((tour) => tour.started);

  // Si aún está cargando, mostramos el skeleton
  if (loading) {
    return <ToursProfileSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText type="subtitle">Rutas</ThemedText>
          <ThemedText type="muted" translateContent={false}>
            {t("profile.routesSubtitle")}
          </ThemedText>
        </View>
        <Link asChild href={{ pathname: "/(tabs)/tours" }}>
          <ThemedText type="muted">Ver todos</ThemedText>
        </Link>
      </View>
      {/* Usamos 'data' en lugar de 'tours' ya que ahora lo recibimos por props */}
      {startedTours.length > 0 ? (
        <View style={styles.tourList}>
          {startedTours.map((tour, index) => (
            <TourItem
              key={tour.id}
              tour={tour}
              isLast={index === startedTours.length - 1}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <ThemedText type="muted" translateContent={false}>
            {t("profile.noStartedTours")}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

const formatDate = (date: string, locale: string) => {
  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TourItem = ({
  tour,
  isLast,
}: {
  tour: TourApiResponse;
  isLast: boolean;
}) => {
  const { locale } = useLanguage();
  const { t } = useTranslation();
  const progressNumber = (
    (Number(tour.progress) / (tour.spots.length || 0)) *
    100
  ).toFixed(0);
  return (
    <TouchableOpacity
      style={styles.tourItem}
      onPress={() => router.navigate(`/(tabs)/tours/${tour.id}`)}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.routeMarker,
          progressNumber === "100" && styles.routeMarkerCompleted,
        ]}
      >
        <View
          style={[
            styles.routeMarkerCore,
            progressNumber === "100" && styles.routeMarkerCoreCompleted,
          ]}
        />
      </View>
      {!isLast && <View style={styles.routeStem} />}
      <View style={styles.tourItemContent}>
        <ThemedText type="defaultSemiBold" style={styles.tourItemTitle}>
          {tour.name}
        </ThemedText>
        <ThemedText type="default" style={styles.tourItemCompleted}>
          {tour.completed_at
            ? `${t("common.completed")} · ${formatDate(tour.completed_at, locale)}`
            : t("common.inProgress")}
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
    gap: 14,
  },
  tourList: {
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
    minHeight: 104,
    paddingLeft: 24,
    paddingRight: 2,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TOKENS.tabBarInactive + "65",
    position: "relative",
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
    gap: 5,
    marginLeft: 12,
  },
  progressTrack: {
    width: 56,
    height: 5,
    backgroundColor: TOKENS.tabBarInactive + "55",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: 5,
    backgroundColor: TOKENS.badgeActive,
    borderRadius: 999,
  },
  progressFillCompleted: {
    backgroundColor: TOKENS.navActive,
  },
  progressPercentCompleted: {
    color: TOKENS.navActive,
  },
  progressPercent: { color: TOKENS.badgeActive, fontSize: 18 },
  routeMarker: {
    position: "absolute",
    left: 0,
    top: 24,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: TOKENS.navActive,
    alignItems: "center",
    justifyContent: "center",
  },
  routeMarkerCompleted: {
    borderColor: TOKENS.badgeActive,
  },
  routeMarkerCore: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: TOKENS.navActive,
  },
  routeMarkerCoreCompleted: {
    backgroundColor: TOKENS.badgeActive,
  },
  routeStem: {
    position: "absolute",
    left: 5.5,
    top: 32,
    bottom: -20,
    width: StyleSheet.hairlineWidth,
  },
  emptyContainer: {
    minHeight: 88,
    justifyContent: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.tabBarInactive + "65",
  },
});

export default ToursProfile;
