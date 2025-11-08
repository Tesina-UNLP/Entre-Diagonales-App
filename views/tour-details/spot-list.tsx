import { StopApiResponse } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SpotCard } from "./spot-card";

const SpotList = ({
  completedSpots,
  currentSpot,
  notCompletedSpots,
}: {
  completedSpots: StopApiResponse[];
  currentSpot: StopApiResponse | null;
  notCompletedSpots: StopApiResponse[];
}) => {
  return (
    <View style={styles.spotsList}>
      {completedSpots.map((spot) => (
        <SpotCard
          key={spot.order}
          spot={spot}
          actual={false}
          completed={true}
          currentSpot={currentSpot}
        />
      ))}
      {currentSpot && (
        <SpotCard
          key={currentSpot.order}
          spot={currentSpot}
          actual={true}
          completed={false}
          currentSpot={currentSpot}
        />
      )}
      {notCompletedSpots.map((spot) => (
        <SpotCard
          key={spot.order}
          spot={spot}
          actual={false}
          completed={false}
          currentSpot={currentSpot}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  spotsList: {
    flexDirection: "column",
    gap: 10,
  },
});

export default SpotList;
