import { StopApiResponse } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SpotCard } from "./spot-card";

const SpotList = ({
  completedSpots,
  currentSpot,
  notCompletedSpots,
  tourId,
}: {
  completedSpots: StopApiResponse[];
  currentSpot: StopApiResponse | null;
  notCompletedSpots: StopApiResponse[];
  tourId: number;
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
          tourId={tourId}
        />
      ))}
      {currentSpot && (
        <SpotCard
          key={currentSpot.order}
          spot={currentSpot}
          actual={true}
          completed={false}
          currentSpot={currentSpot}
          tourId={tourId}
        />
      )}
      {notCompletedSpots.map((spot) => (
        <SpotCard
          key={spot.order}
          spot={spot}
          actual={false}
          completed={false}
          currentSpot={currentSpot}
          tourId={tourId}
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
