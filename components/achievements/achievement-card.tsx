import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { useHaptics } from "@/hooks/use-haptics";
import { api } from "@/libs/api";
import { AppUser, UserAchievementApiResponse } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import GemIcon from "../icons/gem";
import { ThemedText } from "../themed-text";
import { Ionicons } from "@expo/vector-icons";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const AchievementCard = ({
  achievement,
  user,
}: {
  achievement: UserAchievementApiResponse;
  user: AppUser;
}) => {
  const [isClaiming, setIsClaiming] = useState<string | null>(null);

  const { playSound } = useHaptics();
  const { checkAuthState } = useAuth();

  const progressNumber = (
    (Number(achievement.progress) / (achievement.achievement.goal || 1)) *
    100
  ).toFixed(0);

  const getMessage = () => {
    switch (achievement.achievement.goal_type) {
      case "tour":
        return "";
      case "secret_item":
        return "Continua explorando";
      case "trivia":
        return achievement.achievement.goal > 1
          ? `Solo ${achievement.achievement.goal - achievement.progress} trivias mas!`
          : `Solo una trivia mas!`;
      default:
        return "Completa el logro";
    }
  };

  const handleClaimAchievement = async () => {
    if (
      isClaiming === null &&
      achievement.progress !== achievement.achievement.goal
    ) {
      return;
    }

    try {
      await api.claimAchievement(
        user?.access || "",
        achievement.achievement.id,
      );
      playSound("success");
      setIsClaiming(new Date().toISOString());
      await checkAuthState?.();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al canjear el logro",
        text2: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  useEffect(() => {
    setIsClaiming(achievement.completed_at);
  }, [achievement]);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isClaiming && styles.cardCompleted,
        achievement.achievement.expired_at && styles.cardSpecial,
      ]}
      onPress={
        isClaiming
          ? () =>
            router.navigate({
              pathname: "/(tabs)/profile/achievements/[id]",
              params: {
                id: achievement.achievement.id.toString(),
                name: achievement.achievement.name,
                description: achievement.achievement.description,
                image_url: achievement.achievement.image_url,
              },
            })
          : handleClaimAchievement
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: achievement.achievement.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <ThemedText type="subtitle">{achievement.achievement.name}</ThemedText>
        <ThemedText type="default">
          {achievement.achievement.description}
        </ThemedText>
        {isClaiming ? (
          <View style={styles.completedContainer}>
            <MaterialIcons
              name="verified"
              size={16}
              color={TOKENS.badgeActive}
            />
            <ThemedText type="muted">
              Canjeado el {formatDate(isClaiming || "")}
            </ThemedText>
          </View>
        ) : (
          <View>
            <View style={styles.progressRow}>
              <ThemedText type="default">Progreso</ThemedText>
              <ThemedText type="default">{progressNumber}%</ThemedText>
            </View>
            <View style={styles.levelProgressBarContainer}>
              <LinearGradient
                colors={
                  achievement.achievement.expired_at
                    ? ["#BE5310", "#F4881B"]
                    : ["#31544F", "#8CBCB0"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.levelProgressGradient,
                  { width: `${progressNumber}%` as any },
                ]}
              />
            </View>
            <ThemedText type="default" style={styles.progressMessage}>
              {achievement.progress === achievement.achievement.goal
                ? "Puedes canjear este logro!"
                : achievement.achievement.expired_at
                  ? "Termina el " +
                  formatDate(achievement.achievement.expired_at || "")
                  : getMessage()}
            </ThemedText>

            <View style={styles.rewardContainer}>
              {/* Sección de XP */}
              <View style={styles.rewardsItem}>
                <Ionicons name="star" size={20} color={TOKENS.warning} />
                <ThemedText type="default">
                  {" "}
                  +{achievement.experience_reward}
                </ThemedText>
              </View>

              {/* Sección de monedas */}
              <View style={styles.rewardsItem}>
                <GemIcon height={20} width={20} />
                <ThemedText type="default">
                  {" "}
                  {achievement.gems_reward}
                </ThemedText>
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: TOKENS.cardBackground,
    padding: 16,
    flexDirection: "row",
    gap: 16,
    borderRadius: 16,
    justifyContent: "flex-start",
  },
  cardCompleted: {
    borderWidth: 2,
    borderColor: TOKENS.badgeActive,
  },
  cardSpecial: {
    borderWidth: 2,
    borderColor: TOKENS.accent,
  },
  image: {
    width: 65,
    height: 65,
  },
  imageContainer: {
    width: 65,
    height: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    gap: 5,
  },
  contentText: {
    color: TOKENS.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  completedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  levelProgressionInfo: { justifyContent: "center", flex: 1, gap: 2 },
  levelExperience: { flexDirection: "row", alignItems: "center", gap: 4 },
  levelProgressBarContainer: {
    height: 8,
    width: "100%",
    borderRadius: 4,
    marginTop: 4,
    position: "relative",
    backgroundColor: TOKENS.text,
  },
  levelProgressGradient: { height: 8, borderRadius: 4 },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressMessage: {
    marginTop: 4,
  },
  rewardsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rewardContainer: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  rewardsItem: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  xpText: {
    color: TOKENS.accent,
    fontSize: 20,
  },
});

export default AchievementCard;
