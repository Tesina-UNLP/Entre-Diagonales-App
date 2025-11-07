import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { StopDistanceInfo } from "@/libs/google-maps";
import { StopApiResponse, TourInfoApiResponse } from "@/types";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const NextStop = ({
  routeInfo,
  currentSpot,
  handleStartTour,
  stopsDistanceInfo,
}: {
  routeInfo: TourInfoApiResponse | null;
  currentSpot: StopApiResponse | null;
  handleStartTour: () => void;
  stopsDistanceInfo: StopDistanceInfo | null;
}) => {
  return (
    <View style={styles.nextStopContainer}>
      {routeInfo?.started && (
        <View style={styles.messageOfTheDay}>
          <View style={styles.messageOfTheDayIconContainer}>
            <Image
              source={{ uri: currentSpot?.spot.image_urls[0] }}
              style={styles.messageOfTheDayImage}
            />
          </View>
          <View style={styles.nextStopContent}>
            <ThemedText type="defaultSemiBold">Siguiente parada:</ThemedText>
            <ThemedText type="subtitle" style={styles.nextStopName}>
              {currentSpot?.spot.name}
            </ThemedText>
            <View style={styles.nextStopDistance}>
              <FontAwesome6
                name="location-dot"
                size={14}
                color={TOKENS.accent}
              />
              {stopsDistanceInfo?.distanceFromPrevious != null &&
              stopsDistanceInfo?.durationFromPrevious != null ? (
                <ThemedText type="muted">
                  {stopsDistanceInfo?.distanceFromPrevious} km •{" "}
                  {stopsDistanceInfo?.durationFromPrevious}{" "}
                  {stopsDistanceInfo?.durationFromPrevious === 1
                    ? "minuto"
                    : "minutos"}{" "}
                  a pie.
                </ThemedText>
              ) : (
                <ThemedText type="muted">Calculando...</ThemedText>
              )}
            </View>
          </View>
        </View>
      )}
      {/* Next Stop Actions */}
      {routeInfo?.started ? (
        <View style={styles.nextStopActions}>
          <ThemedButton
            variant="primary"
            size="small"
            style={styles.actionButton}
          >
            <MaterialCommunityIcons
              name="line-scan"
              size={20}
              color={TOKENS.text}
            />
            <ThemedText type="defaultSemiBold">Completar</ThemedText>
          </ThemedButton>
          <ThemedButton
            variant="secondary"
            size="small"
            style={styles.actionButton}
            onPress={() =>
              router.push({
                pathname: "/(stack)/tours/[id]/map",
                params: { id: routeInfo?.id.toString() },
              })
            }
          >
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={20}
              color={TOKENS.primary}
            />
            <ThemedText type="defaultSemiBold" style={styles.actionButtonText}>
              Ver mapa
            </ThemedText>
          </ThemedButton>
        </View>
      ) : (
        <ThemedButton
          variant="gold"
          size="small"
          style={styles.actionButton}
          onPress={handleStartTour}
        >
          <ThemedText type="defaultSemiBold">Comenzar aventura</ThemedText>
        </ThemedButton>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageOfTheDay: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 18,
    marginBottom: 20,
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
    color: TOKENS.accent,
  },
  nextStopContent: {
    flexDirection: "column",
    gap: 2,
  },
  nextStopDistance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nextStopActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  nextStopContainer: {
    flexDirection: "column",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  actionButtonText: {
    color: TOKENS.primary,
  },
});

export default NextStop;
