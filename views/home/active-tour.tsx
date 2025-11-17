import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { capitalizeFirstLetter } from "@/libs/utils";
import { TourApiResponse } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const ActiveTour = ({
  currentRoute,
}: {
  currentRoute: TourApiResponse | null;
}) => {
  const { user } = useAuth();

  // Calcular XP necesaria para el siguiente nivel
  const xpToNextLevel = user?.next_level
    ? user.next_level.xp_required - user.experience
    : 0;

  return (
    <View style={styles.currentRouteContainer}>
      <ThemedText type="subtitle" style={styles.subtitleMarginTop}>
        {currentRoute ? "Ruta actual" : "¡Es hora de explorar!"}
      </ThemedText>

      {currentRoute ? (
        // Card de ruta activa (código original)
        <Link
          href={{
            pathname: "/(tabs)/tours/[id]",
            params: { id: currentRoute.id.toString() },
          }}
          asChild
        >
          <TouchableOpacity style={styles.currentRouteCard}>
            <View style={styles.currentRouteHeaderRow}>
              <View style={styles.currentRouteLeftRow}>
                <MaterialIcons
                  name="route"
                  size={24}
                  color={TOKENS.tabBarInactive}
                />
                <ThemedText type="defaultSemiBold">
                  {currentRoute.name}
                </ThemedText>
              </View>
              {/* badge */}
              <View style={styles.badge}>
                <ThemedText type="default">
                  {capitalizeFirstLetter(currentRoute.tag || "General")}
                </ThemedText>
              </View>
            </View>
            <ThemedText type="default">{currentRoute.description}</ThemedText>
            {/* Progress bar simple  */}
            <View style={styles.simpleProgressBar}>
              <View
                style={[
                  styles.simpleProgressBarFill,
                  {
                    width:
                      (currentRoute.spots.length || 0) > 0
                        ? `${(Number(currentRoute.progress) / currentRoute.spots.length) * 100}%`
                        : 0,
                  },
                ]}
              />
            </View>
            {currentRoute.number_of_people_completed > 0 ? (
              <View style={styles.completedRow}>
                <View style={styles.completedAvatarsRow}>
                  {[1, 2, 3].map((item, i) => (
                    <Image
                      key={item}
                      source={{ uri: user?.character?.image_url }}
                      style={[
                        styles.overlapAvatarBase,
                        { marginLeft: i === 0 ? 0 : -6 },
                      ]}
                    />
                  ))}
                </View>
                <ThemedText type="muted">
                  {currentRoute.number_of_people_completed} personas lo
                  completaron!
                </ThemedText>
              </View>
            ) : (
              <ThemedText type="muted">
                Puedes ser el primero en completarla!
              </ThemedText>
            )}
          </TouchableOpacity>
        </Link>
      ) : (
        // Card de gamificación cuando NO hay ruta activa
        <View style={styles.gamificationCard}>
          {/* Header con icono y nivel */}
          <View style={styles.gamificationHeader}>
            <View style={styles.levelBadge}>
              <MaterialIcons name="star" size={20} color={TOKENS.background} />
              <ThemedText type="defaultSemiBold" style={styles.levelText}>
                {user?.level?.name || "Nivel 1"}
              </ThemedText>
            </View>
            <MaterialIcons
              name="emoji-events"
              size={40}
              color={TOKENS.badgeActive}
            />
          </View>

          {/* Mensaje motivacional */}
          <ThemedText type="defaultSemiBold" style={styles.gamificationTitle}>
            ¡Completa una ruta para ganar más XP!
          </ThemedText>

          {/* Barra de progreso de XP */}
          {user?.next_level && (
            <View style={styles.xpProgressContainer}>
              <View style={styles.xpProgressBar}>
                <View
                  style={[
                    styles.xpProgressFill,
                    {
                      width: `${((user.experience / user.next_level.xp_required) * 100).toFixed(0) as unknown as number}%`,
                    },
                  ]}
                />
              </View>
              <ThemedText type="muted" style={styles.xpText}>
                {user.experience} / {user.next_level.xp_required} XP
              </ThemedText>
              <ThemedText type="muted" style={styles.xpRemaining}>
                Faltan {xpToNextLevel} XP para {user.next_level.name}
              </ThemedText>
            </View>
          )}

          {/* Estadísticas del usuario */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialIcons
                name="map"
                size={24}
                color={TOKENS.tabBarInactive}
              />
              <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                {user?.total_tours_completed || 0}
              </ThemedText>
              <ThemedText type="muted" style={styles.statLabel}>
                Rutas
              </ThemedText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <MaterialIcons
                name="search"
                size={24}
                color={TOKENS.tabBarInactive}
              />
              <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                {user?.total_secret_items_completed || 0}
              </ThemedText>
              <ThemedText type="muted" style={styles.statLabel}>
                Secretos
              </ThemedText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <MaterialIcons
                name="quiz"
                size={24}
                color={TOKENS.tabBarInactive}
              />
              <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                {user?.total_quizzes_completed || 0}
              </ThemedText>
              <ThemedText type="muted" style={styles.statLabel}>
                Trivias
              </ThemedText>
            </View>
          </View>

          {/* Call to action */}
          <ThemedButton variant="gold" size="small" onPress={() => router.navigate({ pathname: "/(tabs)/tours" })}>
            Explorar rutas disponibles
          </ThemedButton>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subtitleMarginTop: { marginTop: 4 },
  currentRouteContainer: { gap: 10, marginBottom: 20 },
  currentRouteCard: {
    flexDirection: "column",
    gap: 10,
    backgroundColor: TOKENS.cardBackground,
    padding: 16,
    borderRadius: 18,
  },
  currentRouteHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currentRouteLeftRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: TOKENS.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
  },
  simpleProgressBar: {
    height: 8,
    width: "100%",
    borderRadius: 10,
    marginTop: 8,
    position: "relative",
    backgroundColor: "#FCDEAC",
  },
  simpleProgressBarFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: TOKENS.navActive,
  },
  completedRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  completedAvatarsRow: { flexDirection: "row", alignItems: "center" },
  overlapAvatarBase: {
    width: 28,
    height: 28,
    borderRadius: 100,
    backgroundColor: TOKENS.tabBarInactive,
    borderWidth: 2,
    borderColor: TOKENS.tabBarInactive,
  },
  // Estilos para la card de gamificación
  gamificationCard: {
    backgroundColor: TOKENS.cardBackground,
    padding: 20,
    borderRadius: 18,
    gap: 16,
  },
  gamificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: TOKENS.badgeActive,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  levelText: {
    color: TOKENS.background
  },
  gamificationTitle: {
    fontSize: 18,
    textAlign: "center",
  },
  xpProgressContainer: {
    gap: 8,
  },
  xpProgressBar: {
    height: 10,
    width: "100%",
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    overflow: "hidden",
  },
  xpProgressFill: {
    height: "100%",
    backgroundColor: TOKENS.primary,
    borderRadius: 10,
  },
  xpText: {
    textAlign: "center",
    fontSize: 12,
  },
  xpRemaining: {
    textAlign: "center",
    fontSize: 11,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 12,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: TOKENS.tabBarInactive,
    opacity: 0.3,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: TOKENS.navActive,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  ctaText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default ActiveTour;
