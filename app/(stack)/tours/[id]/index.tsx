import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "@/hooks/use-location";
import { api } from "@/libs/api";
import {
  getInformationBetweenStops,
  StopDistanceInfo,
} from "@/libs/google-maps";
import { StopApiResponse, TourInfoApiResponse } from "@/types";
import NextStop from "@/views/tour-details/next-stop";
import Progression from "@/views/tour-details/progression";
import RewardCard from "@/views/tour-details/reward-card";
import SpotList from "@/views/tour-details/spot-list";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

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

  const isTourCompleted = useMemo(() => {
    return routeInfo?.completed_at !== null;
  }, [routeInfo?.completed_at]);

  const handleStartTour = async () => {
    if (user) {
      await api.startTour(user.access, parseInt(idStr));
      await handleGetRoute();

      Toast.show({
        type: "success",
        text1: "Tour iniciado correctamente",
        text2: "Ahora puedes comenzar a explorar el tour",
      });
    }
  };

  const handleGetRoute = useCallback(async () => {
    setLoading(true);
    if (user) {
      const response = await api.getRoute(user.access, parseInt(idStr));

      if (response) {
        setRouteInfo(response);

        const spotsQuantityCompleted = Number(response.progress);
        const completedSpots = response.spots.slice(0, spotsQuantityCompleted);
        // Si el tour comenzó, saltamos el spot actual (+1), sino comenzamos desde el primero
        const notCompletedSpots = response.spots.slice(
          spotsQuantityCompleted + (response.started ? 1 : 0),
        );
        setCompletedSpots(completedSpots);
        setNotCompletedSpots(notCompletedSpots);
        setCurrentSpot(
          response.started ? response.spots[spotsQuantityCompleted] : null,
        );
      }
    }
    setLoading(false);
  }, [user, idStr]);

  useEffect(() => {
    handleGetRoute();
  }, [handleGetRoute]);

  useEffect(() => {
    const calculateDistances = async () => {
      if (routeInfo?.spots && routeInfo.spots.length > 0) {
        const distanceInfo = await getInformationBetweenStops(
          routeInfo.spots,
          process.env.EXPO_PUBLIC_GOOGLE_MAPS || "",
          location && !isLoading
            ? { latitude: location.latitude, longitude: location.longitude }
            : null,
        );
        setStopsDistanceInfo(distanceInfo);
      }
    };

    calculateDistances();
  }, [location, isLoading, routeInfo]);

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
            description={`${routeInfo?.spots.length} Puntos  • ${stopsDistanceInfo.reduce((acc, info) => acc + (info.durationFromPrevious || 0), 0)} min aprox.`}
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
              <Progression
                completedSpots={completedSpots}
                currentSpot={currentSpot}
                notCompletedSpots={notCompletedSpots}
                spotsQuantity={routeInfo?.spots.length || 0}
              />
              {/* Next Stop */}
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
              {/* Spots List */}
              <SpotList
                completedSpots={completedSpots}
                currentSpot={currentSpot}
                notCompletedSpots={notCompletedSpots}
                tourId={parseInt(idStr)}
              />
              <RewardCard
                spots={routeInfo?.spots.length || 0}
                secrets={
                  routeInfo?.spots.reduce(
                    (acc, spot) => acc + spot.spot.secret_items.length,
                    0,
                  ) || 0
                }
              />
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
