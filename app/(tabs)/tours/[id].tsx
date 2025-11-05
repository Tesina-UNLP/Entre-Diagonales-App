import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api, StopApiResponse, TourInfoApiResponse } from "@/libs/api";
import NextStop from "@/views/tour-details/next-stop";
import Progression from "@/views/tour-details/progression";
import RewardCard from "@/views/tour-details/reward-card";
import SpotList from "@/views/tour-details/spot-list";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const RouteDetails = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const idStr = useMemo(() => (Array.isArray(id) ? id?.[0] : id), [id]);
  const navigation = useNavigation();
  const { user } = useAuth();
  const [routeInfo, setRouteInfo] = useState<TourInfoApiResponse | null>(null);
  const [currentSpot, setCurrentSpot] = useState<StopApiResponse | null>(null);
  const [completedSpots, setCompletedSpots] = useState<StopApiResponse[]>([]);
  const [notCompletedSpots, setNotCompletedSpots] = useState<StopApiResponse[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);

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

        const spotsQuantityCompleted = Math.floor(
          (Number(response.progress) / 100) * response.spots.length,
        );
        const completedSpots = response.spots.slice(0, spotsQuantityCompleted);
        const notCompletedSpots = response.spots.slice(
          spotsQuantityCompleted + 1,
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

  // Hide TabBar when this screen is focused, restore on blur
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent?.();
      parent?.setOptions({ tabBarStyle: { display: "none" } });

      return () => {
        parent?.setOptions({
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "transparent",
            borderColor: "transparent",
            height: Platform.OS === "ios" ? 75 : 70,
            elevation: 0,
            shadowOpacity: 0,
            paddingTop: Platform.OS === "ios" ? 2 : 5,
          },
        });
      };
    }, [navigation]),
  );

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
            description={`${routeInfo?.spots.length} Puntos  •  10 min aprox.`}
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
                handleStartTour={handleStartTour}
              />
              {/* Spots List */}
              <SpotList
                completedSpots={completedSpots}
                currentSpot={currentSpot}
                notCompletedSpots={notCompletedSpots}
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
    padding: 20,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RouteDetails;
