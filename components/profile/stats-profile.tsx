import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";

const StatsProfile = () => {
  const { user } = useAuth();

  return (
    <View style={styles.statsProfileContainer}>
      {/* Level informacion */}
      <View style={styles.statsProfileItem}>
        <Image
          source={{ uri: user?.level?.image_url }}
          style={{ width: 48, height: 48 }}
        />
        <View style={{ flex: 1, gap: 2 }}>
          <ThemedText type="defaultSemiBold">{user?.experience} XP</ThemedText>
          <ThemedText type="default">{user?.level?.name}</ThemedText>
        </View>
      </View>

      {/* Progression level */}
      <View style={styles.levelProgressionContainer}>
        {(() => {
          const xp = user?.experience || 0;
          const req = user?.next_level?.xp_required || 1;
          const percent = Math.min((xp / req) * 100, 100);

          return (
            <View style={styles.levelProgressBarContainer}>
              <View
                style={{
                  width: `${percent}%`,
                  height: "100%",
                  backgroundColor: TOKENS.text,
                  borderRadius: 4,
                }}
              />
            </View>
          );
        })()}

        <View style={styles.levelProgressPlan}>
          <ThemedText
            type="defaultSemiBold"
            style={styles.levelProgressPlanText}
          >
            {user?.experience} XP
          </ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={styles.levelProgressPlanText}
          >
            Siguiente: {user?.next_level?.xp_required} XP
          </ThemedText>
        </View>
      </View>

      {/* Stats */}

      <View style={styles.statsContainer}>
        <View style={styles.statsItem}>
          <Ionicons name="map" size={18} color={TOKENS.text} />
          <ThemedText
            type="defaultSemiBold"
            style={{ fontSize: 12, lineHeight: 16 }}
          >
            {user?.total_tours_completed || 0} rutas{"\n"}completadas
          </ThemedText>
        </View>

        <View style={styles.statsItem}>
          <Ionicons name="help-circle" size={18} color={TOKENS.text} />
          <ThemedText
            type="defaultSemiBold"
            style={{ fontSize: 12, lineHeight: 16 }}
          >
            {user?.total_quizzes_completed || 0} trivia{"\n"}casuales
          </ThemedText>
        </View>

        <View style={styles.statsItem}>
          <Ionicons name="location" size={18} color={TOKENS.text} />
          <ThemedText
            type="defaultSemiBold"
            style={{ fontSize: 12, lineHeight: 16 }}
          >
            {user?.total_secret_items_completed || 0} secretos{"\n"}encontrados
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsProfileContainer: {
    // Removido flex: 1 para permitir que el gap del padre funcione correctamente
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: TOKENS.cardBackground,
    paddingHorizontal: 21,
    paddingVertical: 17,
    borderRadius: 16,
    gap: 10,
    marginBottom: 20,
  },
  statsProfileItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  levelProgressBarContainer: {
    height: 10,
    width: "100%",
    borderRadius: 4,
    position: "relative",
    backgroundColor: TOKENS.tabBarInactive,
  },
  levelProgressionContainer: {
    flexDirection: "column",
    gap: 2,
    width: "100%",
  },
  levelProgressPlan: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  levelProgressPlanText: { marginTop: 4 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  statsItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
export default StatsProfile;
