import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { MIN_LOCATION_CHANGE_METERS } from "@/constants/mapping";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "@/hooks/use-location";
import { api } from "@/libs/api";
import {
  getDistanceInMeters,
  getInformationBetweenStopsLocal,
  getRouteCoords,
  StopDistanceInfo,
} from "@/libs/google-maps";
import { capitalizeFirstLetter } from "@/libs/utils";
import { StopApiResponse, TourInfoApiResponse } from "@/types";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { AppleMapsMapType } from "expo-maps/build/apple/AppleMaps.types";
import { GoogleMapsMapType } from "expo-maps/build/google/GoogleMaps.types";
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
  Image,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Map = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const idStr = useMemo(() => (Array.isArray(id) ? id?.[0] : id), [id]);
  const [routeInfo, setRouteInfo] = useState<TourInfoApiResponse | null>(null);
  const [currentSpot, setCurrentSpot] = useState<StopApiResponse | null>(null);
  const [completedSpots, setCompletedSpots] = useState<StopApiResponse[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);
  // Location refs para evitar re-renderizados innecesarios
  const lastLocationForDistancesRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const lastLocationForRouteRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);
  // Usamos el hook personalizado de ubicación
  const { location, isLoading } = useLocation();
  // Ruta solo hasta el siguiente punto a completar
  const [routeToNextSpot, setRouteToNextSpot] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  // Estado para la animación de la polyline
  const [animatedRouteToNextSpot, setAnimatedRouteToNextSpot] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  // Estado para almacenar información de distancia y duración entre stops
  const [stopsDistanceInfo, setStopsDistanceInfo] = useState<
    StopDistanceInfo[]
  >([]);
  // Estado para controlar la posición de la cámara del mapa
  const [cameraPosition, setCameraPosition] = useState({
    coordinates: { latitude: 0, longitude: 0 },
    zoom: 15,
  });

  useEffect(() => {
    if (location && !isLoading) {
      setCameraPosition({
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        zoom: 15,
      });
    }
  }, [location, isLoading]);

  const handleGetRoute = useCallback(async () => {
    setLoading(true);
    if (user) {
      const response = await api.getRoute(user.access, parseInt(idStr));

      if (response) {
        setRouteInfo(response);

        const spotsQuantityCompleted = Number(response.progress);
        const completedSpots = response.spots.slice(0, spotsQuantityCompleted);

        setCompletedSpots(completedSpots);
        setCurrentSpot(
          response.started ? response.spots[spotsQuantityCompleted] : null,
        );

        // Reset de distancias y últimas ubicaciones usadas
        setStopsDistanceInfo([]);
        lastLocationForDistancesRef.current = null;
        lastLocationForRouteRef.current = null;
        setRouteToNextSpot([]);
      }
    }
    setLoading(false);
  }, [user, idStr]);

  useEffect(() => {
    handleGetRoute();
  }, [handleGetRoute]);

  // Efecto para calcular la ruta desde la ubicación actual hasta el siguiente punto a completar
  useEffect(() => {
    const fetchRouteToNextSpot = async () => {
      // Si no hay spots o no hay ruta, no hacemos nada
      if (!routeInfo?.spots) {
        setRouteToNextSpot([]);
        return;
      }

      // Sin ubicación o cargando → limpiamos polyline y salimos
      if (!location || isLoading) {
        setRouteToNextSpot([]);
        return;
      }

      const userLoc = {
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const indexNextSpot = completedSpots.length;

      // Ya completó todos los puntos
      if (indexNextSpot >= routeInfo.spots.length) {
        setRouteToNextSpot([]);
        lastLocationForRouteRef.current = null;
        return;
      }

      const nextSpot = routeInfo.spots[indexNextSpot];

      // Chequeamos si la ubicación cambió lo suficiente
      if (lastLocationForRouteRef.current) {
        const movedMeters = getDistanceInMeters(
          lastLocationForRouteRef.current,
          userLoc,
        );

        if (
          movedMeters < MIN_LOCATION_CHANGE_METERS &&
          routeToNextSpot.length
        ) {
          // Se movió poco y ya tenemos una ruta dibujada → no llamamos a ORS
          return;
        }
      }

      const pointsForRoute: StopApiResponse[] = [
        {
          order: -1,
          spot: {
            latitude: userLoc.latitude,
            longitude: userLoc.longitude,
            name: "Mi ubicación",
            tag: "ubicacion_actual",
            image_urls: [],
            address: "",
            description: "",
            fun_facts: "",
            historical_information: "",
            secret_items: [],
            slug: "",
            ticket_price: 0,
            wheelchair_accessible: false,
            activated: false,
            id: 0,
            schedule: "",
          },
        },
        {
          order: nextSpot.order,
          spot: nextSpot.spot,
        },
      ];

      const ruta = await getRouteCoords(
        pointsForRoute,
        process.env.EXPO_PUBLIC_API_ROUTES || "",
      );

      setRouteToNextSpot(ruta.coordenadas);
      lastLocationForRouteRef.current = userLoc;
    };

    fetchRouteToNextSpot();
  }, [routeInfo, completedSpots, location, isLoading, routeToNextSpot.length]);

  // Efecto para animar la polyline progresivamente
  useEffect(() => {
    if (routeToNextSpot.length === 0) {
      setAnimatedRouteToNextSpot([]);
      return;
    }

    // Filtrar coordenadas válidas antes de animar
    const validCoordinates = routeToNextSpot.filter(
      (coord) =>
        coord &&
        typeof coord.latitude === "number" &&
        typeof coord.longitude === "number" &&
        !isNaN(coord.latitude) &&
        !isNaN(coord.longitude),
    );

    if (validCoordinates.length === 0) {
      setAnimatedRouteToNextSpot([]);
      return;
    }

    let currentIndex = 0;
    setAnimatedRouteToNextSpot([]);

    const interval = setInterval(() => {
      if (currentIndex < validCoordinates.length) {
        // Clonamos el objeto de coordenadas para evitar el error "This dynamic value has been recycled"
        // y aseguramos que solo pasamos latitude y longitude
        const nextCoord = {
          latitude: validCoordinates[currentIndex].latitude,
          longitude: validCoordinates[currentIndex].longitude,
        };

        setAnimatedRouteToNextSpot((prev) => [...prev, nextCoord]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 20); // Velocidad de la animación (ms por punto)

    return () => clearInterval(interval);
  }, [routeToNextSpot]);

  // Efecto separado para calcular distancias cuando la ubicación está disponible
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

      // Si ya tenemos distancias calculadas y tenemos ubicación,
      // solo recalculamos si se movió lo suficiente
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

  const snapPoints = useMemo(() => ["15%", "35%", "80%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={0}
        opacity={0.35}
        pressBehavior="collapse"
      />
    ),
    [],
  );

  const getSpotStatus = useCallback(
    (item: StopApiResponse) => {
      const isCompleted = completedSpots.some(
        (spot) => spot.order === item.order,
      );
      const isCurrent = currentSpot?.order === item.order;
      return { isCompleted, isCurrent, isPending: !isCompleted && !isCurrent };
    },
    [completedSpots, currentSpot],
  );

  // Función para mover la cámara del mapa a un punto específico
  const handleSpotPress = useCallback((item: StopApiResponse) => {
    if (item.spot.latitude && item.spot.longitude) {
      // Actualizamos la posición de la cámara para movernos a las coordenadas del punto
      setCameraPosition({
        coordinates: {
          latitude: item.spot.latitude,
          longitude: item.spot.longitude,
        },
        zoom: 17, // Nivel de zoom alto para ver el punto con detalle
      });

      // Colapsamos el bottomsheet para mostrar más del mapa
      sheetRef.current?.snapToIndex(0);
    }
  }, []);

  // Crear markers para mostrar en el mapa
  const mapMarkers = useMemo(() => {
    if (!routeInfo || routeInfo.spots.length === 0) return [];

    return routeInfo.spots
      .filter(
        (spot) =>
          spot.spot.latitude !== null &&
          spot.spot.latitude !== undefined &&
          spot.spot.longitude !== null &&
          spot.spot.longitude !== undefined,
      )
      .map((spot) => {
        const { isCompleted, isCurrent } = getSpotStatus(spot);

        let markerColor = TOKENS.badgeActive;

        if (isCompleted) {
          markerColor = TOKENS.primary;
        } else if (isCurrent) {
          markerColor = TOKENS.accent;
        }

        return {
          id: `marker-${spot.order}`,
          coordinates: {
            latitude: spot.spot.latitude as number,
            longitude: spot.spot.longitude as number,
          },
          title: spot.spot.name,
          snippet: spot.spot.tag || "",
          showCallout: true,
          color: markerColor,
        };
      });
  }, [routeInfo, getSpotStatus]);

  const renderItem = useCallback(
    ({ item, index }: { item: StopApiResponse; index: number }) => {
      const { isCompleted, isCurrent, isPending } = getSpotStatus(item);
      const isLastItem = index === (routeInfo?.spots.length || 0) - 1;

      // Buscamos la información de distancia y duración para este stop
      const distanceInfo = stopsDistanceInfo.find(
        (info) => info.order === item.order,
      );

      return (
        <View style={styles.spotContainer} key={item.order}>
          <View style={styles.timelineContainer}>
            <View
              style={[
                styles.timelineCircle,
                isCompleted && styles.timelineCircleCompleted,
                isCurrent && styles.timelineCircleCurrent,
                isPending && styles.timelineCirclePending,
              ]}
            >
              {isCompleted && (
                <MaterialIcons name="check" size={12} color={TOKENS.primary} />
              )}
              {isCurrent && (
                <FontAwesome6
                  name="location-arrow"
                  size={12}
                  color={TOKENS.accent}
                />
              )}
              {isPending && (
                <FontAwesome6
                  name="dot-circle"
                  size={12}
                  color={TOKENS.badgeActive}
                />
              )}
            </View>

            {!isLastItem && (
              <View
                style={[
                  styles.timelineLine,
                  isCompleted && styles.timelineLineCompleted,
                  !isCompleted && styles.timelineLineDashed,
                ]}
              />
            )}
          </View>

          {/* Envolvemos el contenido en Pressable para hacerlo tocable */}
          <Pressable
            style={styles.cardWrapper}
            onPress={() => handleSpotPress(item)}
            android_ripple={{ color: "rgba(139, 214, 196, 0.2)" }}
          >
            <View style={styles.nextStopDescription}>
              <View style={styles.nextStopDescriptionItem}>
                <FontAwesome6 name="route" size={14} color={TOKENS.muted} />
                <ThemedText type="muted">
                  {distanceInfo?.distanceFromPrevious != null
                    ? `${distanceInfo.distanceFromPrevious} km`
                    : "Calculando..."}
                </ThemedText>
              </View>
              <View style={styles.nextStopDescriptionItem}>
                <FontAwesome6
                  name="person-walking"
                  size={14}
                  color={TOKENS.muted}
                />
                <ThemedText type="muted">
                  {distanceInfo?.durationFromPrevious != null
                    ? `${distanceInfo.durationFromPrevious} ${distanceInfo.durationFromPrevious === 1 ? "minuto" : "minutos"}`
                    : "Calculando..."}
                </ThemedText>
              </View>
            </View>
            <View style={styles.messageOfTheDay}>
              <View style={styles.messageOfTheDayIconContainer}>
                <Image
                  source={{ uri: item?.spot.image_urls[0] }}
                  style={styles.messageOfTheDayImage}
                />
              </View>
              <View style={styles.nextStopContent}>
                <View style={styles.nextStopTag}>
                  <ThemedText type="defaultSemiBold">
                    {capitalizeFirstLetter(item.spot.tag || "")}
                  </ThemedText>
                  {item.spot?.ranking && (
                    <View style={styles.nextStopTagRating}>
                      <MaterialIcons
                        name="star"
                        size={14}
                        color={TOKENS.accent}
                      />
                      <ThemedText type="defaultSemiBold">
                        {item.spot?.ranking}
                      </ThemedText>
                    </View>
                  )}
                </View>
                <ThemedText type="bigMuted">{item.spot.name}</ThemedText>
                <View style={styles.nextStopDistance}>
                  <FontAwesome6
                    name="dollar-sign"
                    size={14}
                    color={TOKENS.accent}
                  />
                  {item.spot.ticket_price !== null &&
                  item.spot.ticket_price !== undefined ? (
                    <ThemedText type="muted">
                      Desde{" "}
                      <ThemedText type="defaultSemiBold">
                        ${item.spot.ticket_price || 0}
                      </ThemedText>{" "}
                      por persona
                    </ThemedText>
                  ) : (
                    <ThemedText type="muted">
                      <ThemedText type="defaultSemiBold">
                        Entrada gratuita
                      </ThemedText>{" "}
                    </ThemedText>
                  )}
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      );
    },
    [
      routeInfo?.spots.length,
      getSpotStatus,
      handleSpotPress,
      stopsDistanceInfo,
    ],
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
            description={`${routeInfo?.spots.length} Puntos  • ${stopsDistanceInfo ? stopsDistanceInfo.slice(completedSpots.length).reduce((acc, info) => acc + (info.durationFromPrevious || 0), 0) + " min aprox" : "Calculando..."}`}
            onBack={() => router.back()}
          />

          {Platform.OS === "ios" ? (
            <AppleMaps.View
              style={{ flex: 1 }}
              cameraPosition={cameraPosition}
              markers={mapMarkers}
              polylines={
                animatedRouteToNextSpot.length > 0
                  ? [
                      {
                        id: "ruta-hasta-siguiente",
                        coordinates: animatedRouteToNextSpot,
                        color: TOKENS.accent,
                        width: 20,
                      },
                    ]
                  : []
              }
              uiSettings={{
                myLocationButtonEnabled: true,
                compassEnabled: true,
              }}
              properties={{
                mapType: AppleMapsMapType.IMAGERY,
                isMyLocationEnabled: true,
              }}
            />
          ) : (
            <GoogleMaps.View
              style={{ flex: 1 }}
              cameraPosition={cameraPosition}
              uiSettings={{
                myLocationButtonEnabled: true,
                zoomControlsEnabled: true,
                mapToolbarEnabled: true,
                compassEnabled: true,
              }}
              markers={mapMarkers}
              properties={{
                mapType: GoogleMapsMapType.NORMAL,
                isMyLocationEnabled: true,
              }}
              polylines={
                animatedRouteToNextSpot.length > 0
                  ? [
                      {
                        id: "ruta-hasta-siguiente",
                        coordinates: animatedRouteToNextSpot,
                        color: TOKENS.accent,
                        width: 20,
                      },
                    ]
                  : []
              }
            />
          )}

          <BottomSheet
            ref={sheetRef}
            index={1}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose={false}
            handleIndicatorStyle={{ backgroundColor: TOKENS.muted }}
            backgroundStyle={styles.sheetBackground}
            handleStyle={styles.handle}
            keyboardBehavior="extend"
            android_keyboardInputMode="adjustResize"
            enableOverDrag={false}
            overDragResistanceFactor={0}
            enableDynamicSizing={false}
          >
            <View style={styles.sheetHeader}>
              <ThemedText type="title">Puntos del recorrido</ThemedText>
            </View>

            <BottomSheetScrollView
              contentContainerStyle={{
                paddingBottom: insets.bottom + 24,
                paddingHorizontal: 20,
              }}
            >
              {routeInfo?.spots.map((spot, index) =>
                renderItem({ item: spot, index }),
              )}
            </BottomSheetScrollView>
          </BottomSheet>
        </>
      )}
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
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
  nextStopTag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nextStopTagRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nextStopDescription: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    marginTop: 10,
  },
  spotContainer: {
    flexDirection: "row",
    gap: 16,
  },
  timelineContainer: {
    alignItems: "center",
    width: 24,
  },
  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: TOKENS.cardBackground,
    zIndex: 2,
  },
  timelineCircleCompleted: {
    backgroundColor: TOKENS.badgeActive,
    borderWidth: 2,
    borderColor: TOKENS.primary,
  },
  timelineCircleCurrent: {
    backgroundColor: "#BE5310",
    borderWidth: 2,
    borderColor: "#F7A340",
  },
  timelineCirclePending: {
    backgroundColor: "#DBECE6",
    borderColor: TOKENS.badgeActive,
    borderWidth: 2,
  },
  timelineLine: {
    width: 3,
    flex: 1,
    backgroundColor: TOKENS.tabBarInactive,
    position: "absolute",
    top: 24,
    bottom: 0,
    zIndex: 1,
  },
  timelineLineCompleted: {
    backgroundColor: TOKENS.badgeActive,
  },
  timelineLineDashed: {
    backgroundColor: "transparent",
    borderLeftWidth: 3,
    borderLeftColor: TOKENS.badgeActive,
    borderStyle: "dashed",
  },
  cardWrapper: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
  },
  messageOfTheDay: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 18,
  },
  messageOfTheDayImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  messageOfTheDayIconContainer: {
    borderRadius: 12,
    backgroundColor: TOKENS.tabBarInactive,
    alignSelf: "center",
  },
  nextStopContent: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },
  nextStopDistance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nextStopDescriptionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  sheetBackground: {
    backgroundColor: "#053734",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  handle: { borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  sheetHeader: { paddingHorizontal: 20, paddingVertical: 20 },
  sectionTitle: { color: "#F6FFFD", fontSize: 18, fontWeight: "700" },

  card: {
    flexDirection: "row",
    backgroundColor: "#0A3F3B",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
  },
  image: { width: 86, height: 86 },
  cardInfo: { flex: 1, padding: 10, justifyContent: "space-between" },
  tipo: { color: "#8BD6C4", fontSize: 12, marginBottom: 2 },
  title: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  star: { color: "#F59E0B", fontSize: 14 },
  rating: { color: "#F59E0B", fontSize: 13, fontWeight: "600" },
  reviews: { color: "#9AC5BE", fontSize: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  subtext: { color: "#CFEAE6", fontSize: 12 },
  calloutContainer: {
    padding: 10,
    minWidth: 150,
  },
  calloutTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 12,
  },
});

export default Map;
