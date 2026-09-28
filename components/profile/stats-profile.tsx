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
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // Calculamos el porcentaje de progreso (usando valores por defecto si user no existe)
  const xp = user?.experience || 0;
  const req = user?.next_level?.xp_required || 1;
  const percent = Math.min((xp / req) * 100, 100);

  // Efecto que se ejecuta cuando cambia el porcentaje o cuando el componente se monta
  // IMPORTANTE: Los hooks deben estar ANTES de cualquier return condicional
  useEffect(() => {
    // Solo animamos si hay un usuario (percent será 0 si no hay user)
    // Reiniciamos la animación a 0
    animatedWidth.setValue(0);

    // Creamos la animación que va de 0 al porcentaje final
    Animated.timing(animatedWidth, {
      toValue: percent, // Valor final: el porcentaje calculado
      duration: 1000, // Duración de la animación en milisegundos (1 segundo)
      useNativeDriver: false, // No podemos usar native driver para width
    }).start(); // Iniciamos la animación
  }, [percent, animatedWidth]);

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
            style={{
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
              height: "100%",
              backgroundColor: TOKENS.navActive,
              borderRadius: 999,
            }}
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
          label="Recorridos completados"
        />
        <View style={styles.statDivider} />
        <StatItem
          icon="help-circle-outline"
          value={user?.total_quizzes_completed || 0}
          label="Trivias respondidas"
        />
        <View style={styles.statDivider} />
        <StatItem
          icon="location-outline"
          value={user?.total_secret_items_completed || 0}
          label="Secretos encontrados"
        />
      </View>
    </View>
  );
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
    <ThemedText type="muted" style={styles.statLabel}>
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
    justifyContent: "center",
    gap: 3,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 11,
    lineHeight: 14,
    width: "100%",
    flexShrink: 1,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 38,
    backgroundColor: TOKENS.tabBarInactive + "65",
  },
});
export default StatsProfile;
