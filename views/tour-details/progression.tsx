import { TOKENS } from "@/constants/colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { StopApiResponse } from "@/types";
import React from "react";

const Progression = ({
  completedSpots,
  currentSpot,
  notCompletedSpots,
  spotsQuantity,
}: {
  completedSpots: StopApiResponse[];
  currentSpot: StopApiResponse | null;
  notCompletedSpots: StopApiResponse[];
  spotsQuantity: number;
}) => {
  return (
    <View style={styles.routeProgress}>
      <View style={styles.routeProgressHeader}>
        <ThemedText type="subtitle">Progreso del tour</ThemedText>
        <ThemedText type="muted">
          {completedSpots.length || 0}/{spotsQuantity || 0} puntos
        </ThemedText>
      </View>
      <View style={styles.routeProgressTrack}>
        <View style={styles.routeProgressLine} />
        {/* este progress bar es direferente, tiene diferentes dots que cada uno es un spot */}
        {completedSpots.map((spot) => (
          <DotCompleted key={spot.order} />
        ))}
        {currentSpot && <DotActual key={currentSpot.order} />}
        {notCompletedSpots.map((spot) => (
          <DotNotCompleted key={spot.order} />
        ))}
      </View>
    </View>
  );
};

export default Progression;

const DotCompleted = () => {
  return (
    <View style={styles.routeProgressDotCompleted}>
      <MaterialIcons name="check" size={20} color={TOKENS.primary} />
    </View>
  );
};

const DotActual = () => {
  return (
    <View style={styles.routeActualDot}>
      <FontAwesome6 name="location-arrow" size={18} color={"#F7A340"} />
    </View>
  );
};

const DotNotCompleted = () => {
  return (
    <View style={styles.routeNotCompletedDot}>
      <FontAwesome6 name="dot-circle" size={18} color={TOKENS.badgeActive} />
    </View>
  );
};

const styles = StyleSheet.create({
  routeProgress: {
    flexDirection: "column",
    gap: 10,
  },
  routeProgressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routeProgressTrack: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    height: 32,
  },
  routeProgressLine: {
    position: "absolute",
    left: 16,
    right: 16,
    height: 10,
    backgroundColor: TOKENS.badgeActive,
    borderRadius: 5,
  },
  routeNotCompletedDot: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: "#DBECE6",
    borderColor: TOKENS.badgeActive,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  routeProgressDotCompleted: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: TOKENS.badgeActive,
    borderWidth: 2,
    borderColor: TOKENS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  routeActualDot: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: "#BE5310",
    borderWidth: 2,
    borderColor: "#F7A340",
    alignItems: "center",
    justifyContent: "center",
  },
});
