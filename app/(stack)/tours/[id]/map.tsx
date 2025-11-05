import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api, StopApiResponse, TourInfoApiResponse } from "@/libs/api";
import { capitalizeFirstLetter } from "@/libs/utils";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
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

        setCompletedSpots(completedSpots);
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

  const renderItem = useCallback(
    ({ item, index }: { item: StopApiResponse; index: number }) => {
      const { isCompleted, isCurrent, isPending } = getSpotStatus(item);
      const isLastItem = index === (routeInfo?.spots.length || 0) - 1;

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

          <View style={styles.cardWrapper}>
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
                  <View style={styles.nextStopTagRating}>
                    <MaterialIcons
                      name="star"
                      size={14}
                      color={TOKENS.accent}
                    />
                    <ThemedText type="defaultSemiBold">
                      2.3 <ThemedText type="muted">(465)</ThemedText>
                    </ThemedText>
                  </View>
                </View>
                <ThemedText type="muted" style={styles.nextStopName}>
                  {item.spot.name}
                </ThemedText>
                <View style={styles.nextStopDistance}>
                  <FontAwesome6
                    name="location-dot"
                    size={14}
                    color={TOKENS.accent}
                  />
                  <ThemedText type="muted">
                    Desde{" "}
                    <ThemedText type="defaultSemiBold">
                      ${item.spot.ticket_price || 0}
                    </ThemedText>{" "}
                    por persona
                  </ThemedText>
                </View>
              </View>
            </View>
            <View style={styles.nextStopDescription}>
              <View style={styles.nextStopDescriptionItem}>
                <FontAwesome6 name="route" size={14} color={TOKENS.muted} />
                <ThemedText type="muted">5.2 KM</ThemedText>
              </View>
              <View style={styles.nextStopDescriptionItem}>
                <FontAwesome6
                  name="person-walking"
                  size={14}
                  color={TOKENS.muted}
                />
                <ThemedText type="muted">12 minutos</ThemedText>
              </View>
            </View>
          </View>
        </View>
      );
    },
    [routeInfo?.spots.length, getSpotStatus],
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
  nextStopName: {
    fontSize: 18,
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
});

export default Map;
