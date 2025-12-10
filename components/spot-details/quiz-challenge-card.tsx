/**
 * COMPONENTE: QuizChallengeCard
 *
 * Tarjeta atractiva que muestra que hay una trivia disponible.
 * Incluye animación, iconos de recompensa y un diseño llamativo
 * para motivar a los usuarios a participar.
 */

import CoinIcon from "@/components/icons/coin";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { COINS_PER_QUIZ, XP_PER_QUIZ } from "@/constants/gamification";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";

interface QuizChallengeCardProps {
  quizId?: number;
}

const think = require("@/assets/images/think.png");

export const QuizChallengeCard = ({ quizId }: QuizChallengeCardProps) => {
  // Animaciones
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de pulso continuo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  const handlePress = () => {
    if (quizId) {
      router.navigate({
        pathname: "/(stack)/quizzes/[id]",
        params: { id: quizId.toString() },
      });
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: Animated.multiply(pulseAnim, scaleAnim) }],
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        {/* Contenido principal */}
        <View style={styles.content}>
          {/* Icono principal con badge "NUEVO" */}
          <View style={styles.iconContainer}>
            <Image source={think} style={styles.image} />
          </View>

          {/* Texto principal */}
          <View style={styles.textContainer}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              ¡Trivia Disponible!
            </ThemedText>
            <ThemedText>Demuestra tus conocimientos y gana</ThemedText>

            {/* Recompensas */}
            <View style={styles.rewardsContainer}>
              <View style={styles.rewardItem}>
                <CoinIcon width={18} height={18} />
                <ThemedText style={styles.rewardText}>
                  +{COINS_PER_QUIZ}
                </ThemedText>
              </View>
              <View style={styles.rewardItem}>
                <Ionicons name="star" size={18} color={TOKENS.warning} />
                <ThemedText style={styles.rewardText}>
                  +{XP_PER_QUIZ} XP
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 6,
  },
  pressable: {
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: TOKENS.accent,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  iconContainer: {
    position: "relative",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: TOKENS.accent,
    marginBottom: 1,
  },
  rewardsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: TOKENS.cardBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(249, 188, 96, 0.3)",
  },
  rewardText: {
    color: TOKENS.accent,
  },
  image: {
    width: 60,
    height: 60,
    transform: [{ rotate: "10deg" }],
  },
});
