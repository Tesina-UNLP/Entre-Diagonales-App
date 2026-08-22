import { FadeInView } from "@/components/animations/fade-in-view";
import { ActiveTourSkeleton } from "@/components/skeletons/active-tour-skeleton";
import { HeaderHomeSkeleton } from "@/components/skeletons/header-home-skeleton";
import { HorizontalToursSkeleton } from "@/components/skeletons/horizontal-tours-skeleton";
import { MessageOfTheDaySkeleton } from "@/components/skeletons/message-of-the-day-skeleton";
import { ProgressionLevelSkeleton } from "@/components/skeletons/progression-level-skeleton";
import { ThemedBackground } from "@/components/themed-background";
import { UpdateAvailableCard } from "@/components/update-available-card";
import { useAuth } from "@/hooks/use-auth";
import { useMarkInteractive } from "@/hooks/use-mark-interactive";
import { useMessageOfTheDay } from "@/hooks/use-message-of-the-day";
import { useWeather } from "@/hooks/use-weather";
import { api } from "@/libs/api";
import { TourApiResponse } from "@/types";
import ActiveTour from "@/views/home/active-tour";
import HeaderHome from "@/views/home/header-home";
import HorizontalTourList from "@/views/home/horizontal-tours-list";
import MessageOfTheDay from "@/views/home/message-of-the-day";
import ProgressionLevel from "@/views/home/progression-level";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const { user, checkAuthState } = useAuth();
  const { fetchWeather, isLoading: isWeatherLoading } = useWeather();
  const { refreshMessage } = useMessageOfTheDay();
  const [routes, setRoutes] = useState<TourApiResponse[]>([]);
  const [currentRoute, setCurrentRoute] = useState<TourApiResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useMarkInteractive(!loading && !isWeatherLoading);

  const handleGetRoutes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getRoutes(user?.access || "");
      const current = response.find(
        (route) => route.started && route.completed_at === null,
      );
      setRoutes(response);
      setCurrentRoute(current || null);
    } catch {
      Toast.show({
        type: "error",
        text1: "Error al obtener las rutas",
        text2: "Por favor, intente nuevamente más tarde.",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.access]);

  const refreshAll = async () => {
    await Promise.all([
      handleGetRoutes(),
      fetchWeather(),
      refreshMessage(),
      checkAuthState ? checkAuthState() : Promise.resolve(),
    ]);
  };

  useEffect(() => {
    handleGetRoutes();
  }, [handleGetRoutes]);

  return (
    <ThemedBackground
      style={styles.container}
      scrollable
      onRefresh={refreshAll}
    >
      {loading ? (
        <>
          <MessageOfTheDaySkeleton />
          <ProgressionLevelSkeleton />
          <ActiveTourSkeleton />
          <HorizontalToursSkeleton />
        </>
      ) : (
        <>
          {/* Si está cargando el clima, muestra el skeleton sin animación */}
          {isWeatherLoading ? (
            <HeaderHomeSkeleton />
          ) : (
            // El HeaderHome aparece primero con un pequeño delay
            <FadeInView delay={100}>
              <HeaderHome />
            </FadeInView>
          )}

          <FadeInView delay={200}>
            <UpdateAvailableCard />
          </FadeInView>

          {/* Cada componente aparece con un delay incremental para crear un efecto escalonado */}
          <FadeInView delay={250}>
            <MessageOfTheDay />
          </FadeInView>

          <FadeInView delay={300}>
            <ProgressionLevel />
          </FadeInView>

          <FadeInView delay={400}>
            <ActiveTour currentRoute={currentRoute} />
          </FadeInView>

          <FadeInView delay={500}>
            <HorizontalTourList routes={routes} />
          </FadeInView>
        </>
      )}
      <View style={styles.bottomSpacer}></View>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  bottomSpacer: { height: 120 },
});
