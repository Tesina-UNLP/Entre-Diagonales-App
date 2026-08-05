import { FadeInView } from "@/components/animations/fade-in-view";
import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { TOKENS } from "@/constants/colors";
import { MIN_LOCATION_CHANGE_METERS } from "@/constants/mapping";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "@/hooks/use-location";
import { api } from "@/libs/api";
import {
  getDistanceInMeters,
  getInformationBetweenStopsLocal,
  StopDistanceInfo,
} from "@/libs/google-maps";
import { StopApiResponse, TourInfoApiResponse } from "@/types";
import NextStop from "@/views/tour-details/next-stop";
import Progression from "@/views/tour-details/progression";
import RewardCard from "@/views/tour-details/reward-card";
import SpotList from "@/views/tour-details/spot-list";
import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const RouteDetails = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const idStr = useMemo(() => (Array.isArray(id) ? id?.[0] : id), [id]);
  const { user } = useAuth();
  const [routeInfo, setRouteInfo] = useState<TourInfoApiResponse | null>(null);
  const [currentSpot, setCurrentSpot] = useState<StopApiResponse | null>(null);
  const [completedSpots, setCompletedSpots] = useState<StopApiResponse[]>([]);
  const [notCompletedSpots, setNotCompletedSpots] = useState<StopApiResponse[]>(
    [],
  );
  const [stopsDistanceInfo, setStopsDistanceInfo] = useState<
    StopDistanceInfo[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { location, isLoading } = useLocation();

  // guardamos la última ubicación usada para calcular distancias
  const lastLocationForDistancesRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const isTourCompleted = useMemo(() => {
    return routeInfo?.completed_at !== null;
  }, [routeInfo?.completed_at]);

  const handleStartTour = async () => {
    if (user) {
      await api.startTour(user.access, parseInt(idStr));
      await handleGetRoute();
    }
  };

  const handleGetRoute = useCallback(async () => {
    setLoading(true);
    if (user && idStr) {
      const response = await api.getRoute(user.access, parseInt(idStr, 10));

      if (response) {
        setRouteInfo(response);

        const spotsQuantityCompleted = Number(response.progress);
        const completed = response.spots.slice(0, spotsQuantityCompleted);

        // Si el tour comenzó, saltamos el spot actual (+1), sino comenzamos desde el primero
        const notCompleted = response.spots.slice(
          spotsQuantityCompleted + (response.started ? 1 : 0),
        );

        setCompletedSpots(completed);
        setNotCompletedSpots(notCompleted);
        setCurrentSpot(
          response.started ? response.spots[spotsQuantityCompleted] : null,
        );

        // Nueva ruta → reseteamos distancias y última ubicación usada
        setStopsDistanceInfo([]);
        lastLocationForDistancesRef.current = null;
      }
    }
    setLoading(false);
  }, [user, idStr]);

  useEffect(() => {
    handleGetRoute();
  }, [handleGetRoute]);

  // Cálculo de distancias/tiempos con Haversine + velocidad caminando
  useEffect(() => {
    const calculateDistances = async () => {
      if (!routeInfo?.spots || routeInfo.spots.length === 0) return;

      if (!location) return;

      const userLoc =
        location && !isLoading
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
            }
          : null;

      // Si ya tenemos distancias y tenemos ubicación del usuario,
      // solo recalculamos si se movió más de MIN_LOCATION_CHANGE_METERS.
      if (
        userLoc &&
        lastLocationForDistancesRef.current &&
        stopsDistanceInfo.length > 0
      ) {
        const movedMeters = getDistanceInMeters(
          lastLocationForDistancesRef.current,
          userLoc,
        );

        if (movedMeters < MIN_LOCATION_CHANGE_METERS) {
          // Se movió poco → no recalculamos
          return;
        }
      }

      const distanceInfo = await getInformationBetweenStopsLocal(
        routeInfo.spots,
        userLoc,
      );

      setStopsDistanceInfo(distanceInfo);

      if (userLoc) {
        lastLocationForDistancesRef.current = userLoc;
      }
    };

    calculateDistances();
  }, [routeInfo, location, isLoading, stopsDistanceInfo.length]);

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={TOKENS.primary} />
        </View>
      ) : (
        <>
          <Header
            title={routeInfo?.name || ""}
            description={`${routeInfo?.spots.length} Puntos  • ${stopsDistanceInfo ? stopsDistanceInfo.slice(completedSpots.length).reduce((acc, info) => acc + (info.durationFromPrevious || 0), 0) + " min aprox" : "Calculando..."}`}
            onBack={() => router.navigate("/(tabs)/tours")}
          />
          <ScrollView
            style={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => handleGetRoute()}
                tintColor={TOKENS.primary}
                progressBackgroundColor={TOKENS.primary}
                colors={[TOKENS.navActive]}
              />
            }
          >
            <View style={styles.content}>
              {/* Progress bar */}
              <FadeInView delay={100}>
                <Progression
                  completedSpots={completedSpots}
                  currentSpot={currentSpot}
                  notCompletedSpots={notCompletedSpots}
                  spotsQuantity={routeInfo?.spots.length || 0}
                />
              </FadeInView>
              {/* Next Stop */}
              <FadeInView delay={200}>
                <NextStop
                  routeInfo={routeInfo}
                  currentSpot={currentSpot}
                  stopsDistanceInfo={
                    stopsDistanceInfo.find(
                      (info) => info.order === currentSpot?.order,
                    ) || null
                  }
                  handleStartTour={handleStartTour}
                  isTourCompleted={isTourCompleted}
                />
              </FadeInView>
              {/* Spots List */}
              <FadeInView delay={300}>
                <SpotList
                  completedSpots={completedSpots}
                  currentSpot={currentSpot}
                  notCompletedSpots={notCompletedSpots}
                  tourId={parseInt(idStr)}
                />
              </FadeInView>
              <FadeInView delay={400}>
                <RewardCard
                  spots={routeInfo?.spots.length || 0}
                  secrets={
                    routeInfo?.spots.reduce(
                      (acc, spot) => acc + spot.spot.secret_items.length,
                      0,
                    ) || 0
                  }
                />
              </FadeInView>
            </View>
          </ScrollView>
        </>
      )}
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    marginTop: 0,
    paddingInline: 0,
    paddingHorizontal: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RouteDetails;
