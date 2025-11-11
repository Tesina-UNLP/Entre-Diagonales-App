import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import {
  AnimatedStars,
  CompletionActions,
  TourRewards,
  TourStatistics,
} from "@/components/tour-completion";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { useHaptics } from "@/hooks/use-haptics";
import { useTourCompletion } from "@/hooks/use-tour-completion";
import {
  calculateQualityPercentage,
  calculateStarsToShow,
} from "@/utils/tour-quality";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import * as z from "zod";

const CompleteTour = () => {
  const ParamsSchema = z.object({
    tour_id: z.string().optional().default(""),
    xp: z.coerce.number().optional().default(0),
    coins: z.coerce.number().optional().default(0),
    secrets: z.coerce.number().optional().default(0),
    trivias: z.coerce.number().optional().default(0),
    secrets_completed: z.coerce.number().optional().default(0),
    trivias_completed: z.coerce.number().optional().default(0),
    tour_name: z.string().optional().default(""),
  });

  const parsed = ParamsSchema.safeParse(useLocalSearchParams());
  const params = parsed.success
    ? parsed.data
    : {
        xp: 0,
        coins: 0,
        secrets: 0,
        trivias: 0,
        secrets_completed: 0,
        trivias_completed: 0,
        tour_name: "",
        tour_id: "",
      };

  const { user } = useAuth();

  const { shareAchievement } = useTourCompletion();

  const qualityPercentage = calculateQualityPercentage(
    params.secrets_completed,
    params.trivias_completed,
    params.secrets,
    params.trivias,
  );

  const starsToShow = calculateStarsToShow(qualityPercentage);

  const handleShareAchievement = () => {
    shareAchievement({
      tourName: params.tour_name,
      xp: params.xp,
      coins: params.coins,
      secretsCompleted: params.secrets_completed,
      secretsTotal: params.secrets,
      triviasCompleted: params.trivias_completed,
      triviasTotal: params.trivias,
    });
  };

  const { playSound } = useHaptics();

  useEffect(() => {
    playSound("tourCompleted");
  }, [playSound]);

  return (
    <ThemedBackground style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.headerTourName}>
          {params.tour_name}
        </ThemedText>
        <ThemedText type="title">Ruta completada!</ThemedText>
        <ThemedText type="subtitle">Buen Trabajo, explorador</ThemedText>
      </View>

      <View style={styles.characterContainer}>
        <Image
          source={{ uri: user?.character?.image_url }}
          style={styles.characterImage}
        />
        <AnimatedStars starsToShow={starsToShow} />
      </View>

      <TourRewards xp={params.xp} coins={params.coins} />

      <View style={styles.buttonsContainer}>
        <TourStatistics
          secretsCompleted={params.secrets_completed}
          secretsTotal={params.secrets}
          triviasCompleted={params.trivias_completed}
          triviasTotal={params.trivias}
        />
        <CompletionActions
          tourId={params.tour_id}
          onShare={handleShareAchievement}
        />
      </View>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 60,
    marginTop: 20,
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTourName: {
    color: TOKENS.accent,
  },
  characterContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  characterImage: {
    width: 160,
    height: 160,
    borderRadius: 100,
  },
  buttonsContainer: {
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});

export default CompleteTour;
