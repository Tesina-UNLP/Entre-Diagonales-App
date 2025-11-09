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

const happyImage = require("@/assets/images/happy.png");

const NextStop = ({
  routeInfo,
  currentSpot,
  handleStartTour,
  stopsDistanceInfo,
  isTourCompleted,
}: {
  routeInfo: TourInfoApiResponse | null;
  currentSpot: StopApiResponse | null;
  handleStartTour: () => void;
  stopsDistanceInfo: StopDistanceInfo | null;
  isTourCompleted: boolean;
}) => {
  return (
    <View style={styles.nextStopContainer}>
      {/* Mostrar mensaje de felicitación si el tour está completado */}
      {routeInfo?.started && isTourCompleted ? (
        <View style={styles.completedTourContainer}>
          <View style={styles.completedIconContainer}>
            <Image source={happyImage} style={styles.completedIcon} />
          </View>
          <View style={styles.completedTextContent}>
            <ThemedText type="subtitle" style={styles.completedTitle}>
              ¡Tour Completado!
            </ThemedText>
            <ThemedText type="default" style={styles.completedDescription}>
              Has visitado todos los puntos de este tour. ¡Felicitaciones por
              completar la aventura!
            </ThemedText>
          </View>
        </View>
      ) : routeInfo?.started ? (
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
      ) : null}
      {/* Next Stop Actions */}
      {routeInfo?.started && !isTourCompleted ? (
        // Mostrar botones normales cuando el tour no está completado
        <View style={styles.nextStopActions}>
          <ThemedButton
            variant="primary"
            size="small"
            style={styles.actionButton}
            onPress={() =>
              router.navigate(
                `/(tabs)/scanner?mode=spot&from=/(tabs)/tours/${routeInfo?.id}&spot_id=${currentSpot?.spot.id}&tour_id=${routeInfo?.id}`,
              )
            }
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
      ) : routeInfo?.started && isTourCompleted ? (
        // Mostrar solo botón de ver mapa cuando el tour está completado
        <ThemedButton
          variant="secondary"
          size="small"
          style={styles.completedActionButton}
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
            Revisar mapa del tour
          </ThemedText>
        </ThemedButton>
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
  // Estilos para el estado de tour completado
  completedTourContainer: {
    flexDirection: "column",
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 18,
    marginBottom: 20,
    gap: 16,
    borderWidth: 2,
    borderColor: TOKENS.accent,
  },
  completedIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  completedTextContent: {
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
  },
  completedTitle: {
    color: TOKENS.accent,
    textAlign: "center",
  },
  completedDescription: {
    textAlign: "center",
    color: TOKENS.muted,
    paddingHorizontal: 10,
  },
  completedActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  completedIcon: {
    width: 80,
    height: 80,
  },
});

export default NextStop;
