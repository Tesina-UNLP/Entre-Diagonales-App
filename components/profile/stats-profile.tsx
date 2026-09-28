import { StatsProfileSkeleton } from "@/components/skeletons/stats-profile-skeleton";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ThemedText } from "../themed-text";

const StatsProfile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  // Creamos un valor animado que comenzará en 0
  const animatedProgress = useRef(new Animated.Value(0)).current;

  // Calculamos el porcentaje de progreso (usando valores por defecto si user no existe)
  const xp = user?.experience || 0;
  const req = user?.next_level?.xp_required || 1;
  const percent = Math.min((xp / req) * 100, 100);

  // Efecto que se ejecuta cuando cambia el porcentaje o cuando el componente se monta
  // IMPORTANTE: Los hooks deben estar ANTES de cualquier return condicional
  useEffect(() => {
    // Solo animamos si hay un usuario (percent será 0 si no hay user)
    // Reiniciamos la animación a 0
    animatedProgress.setValue(0);

    // Creamos la animación que va de 0 al porcentaje final
    const animation = Animated.timing(animatedProgress, {
      toValue: percent / 100,
      duration: 450,
      useNativeDriver: true,
    });
    animation.start();

    return () => animation.stop();
  }, [percent, animatedProgress]);

  // Ahora verificamos si hay usuario DESPUÉS de todos los hooks
  if (!user) {
    return <StatsProfileSkeleton />;
  }

  return (
    <View style={styles.statsProfileContainer}>
      <View style={styles.levelHeader}>
        <Image
          source={{ uri: user?.level?.image_url }}
          style={styles.levelImage}
        />
        <View style={styles.levelCopy}>
          <ThemedText type="title" style={styles.experienceText}>
            {user?.experience} XP
          </ThemedText>
          <ThemedText type="bigMuted">{user?.level?.name}</ThemedText>
        </View>
      </View>

      <View style={styles.levelProgressionContainer}>
        <View style={styles.levelProgressBarContainer}>
          <Animated.View
            style={[
              styles.levelProgressBar,
              { transform: [{ scaleX: animatedProgress }] },
            ]}
          />
        </View>

        <View style={styles.levelProgressPlan}>
          <ThemedText
            type="defaultSemiBold"
            style={styles.levelProgressPlanText}
          >
            {t("profile.progressLabel")}
          </ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={styles.levelProgressPlanText}
          >
            {user?.next_level?.name
              ? `${user?.next_level?.name}`
              : t("profile.maxLevel")}
          </ThemedText>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <StatItem
          icon="map-outline"
          value={user?.total_tours_completed || 0}
          label={toTwoLineLabel(t("profile.completedTours"))}
        />
        <View style={styles.statDivider} />
        <StatItem
          icon="help-circle-outline"
          value={user?.total_quizzes_completed || 0}
          label={toTwoLineLabel(t("profile.answeredTrivia"))}
        />
        <View style={styles.statDivider} />
        <StatItem
          icon="location-outline"
          value={user?.total_secret_items_completed || 0}
          label={toTwoLineLabel(t("profile.discoveredSecrets"))}
        />
      </View>
    </View>
  );
};

const toTwoLineLabel = (label: string) => {
  const words = label.trim().split(/\s+/);
  const breakAt = Math.ceil(words.length / 2);
  const firstLine = words.slice(0, breakAt).join(" ");
  const secondLine = words.slice(breakAt).join(" ");

  return `${firstLine}\n${secondLine || " "}`;
};

const StatItem = ({
  icon,
  value,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  value: number;
  label: string;
}) => (
  <View style={styles.statItem}>
    <View style={styles.statValueRow}>
      <Ionicons name={icon} size={17} color={TOKENS.badgeActive} />
      <ThemedText type="subtitle" style={styles.statValue}>
        {value}
      </ThemedText>
    </View>
    <ThemedText
      type="muted"
      style={styles.statLabel}
      translateContent={false}
      numberOfLines={2}
      accessibilityLabel={label.replace("\n", " ").trim()}
    >
      {label}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  statsProfileContainer: {
    gap: 18,
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  levelImage: {
    width: 64,
    height: 64,
  },
  levelCopy: {
    flex: 1,
    gap: 1,
  },
  experienceText: {
    color: TOKENS.text,
    fontSize: 28,
  },
  levelProgressBarContainer: {
    height: 6,
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
    position: "relative",
    backgroundColor: TOKENS.tabBarInactive + "55",
  },
  levelProgressBar: {
    width: "100%",
    height: "100%",
    backgroundColor: TOKENS.navActive,
    borderRadius: 999,
    transformOrigin: "left center",
  },
  levelProgressionContainer: {
    flexDirection: "column",
    gap: 6,
    width: "100%",
  },
  levelProgressPlan: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  levelProgressPlanText: { fontSize: 12 },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.tabBarInactive + "65",
  },
  statItem: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 11,
    lineHeight: 14,
    minHeight: 28,
    width: "100%",
    textAlign: "center",
    flexShrink: 1,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 38,
    backgroundColor: TOKENS.tabBarInactive + "65",
  },
});
export default StatsProfile;
