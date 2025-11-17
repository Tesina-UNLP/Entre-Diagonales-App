// app/(tabs)/ranking.tsx
import PodiumItem from "@/components/podium-item";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { UserRankingCard } from "@/components/user-ranking-card";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { useRanking } from "@/hooks/use-ranking";
import { Octicons } from "@expo/vector-icons";
import { FlatList, Image, StyleSheet, View } from "react-native";

export default function RankingScreen() {
  const { user } = useAuth();
  const token = user?.access || "";
  const level = user?.level || null;
  const { top3, rest, userPosition, loading } = useRanking(
    token,
    user?.username,
    String(level?.id),
  );

  return (
    <ThemedBackground style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <ThemedText type="title" style={styles.title}>
              Exploradores top
            </ThemedText>
            <ThemedText type="muted" style={styles.description}>
              Mira como es la clasificación de tu ciudad
            </ThemedText>

            {userPosition && (
              <UserRankingCard user={userPosition} userLevel={level?.name} />
            )}

            {/* PODIO */}
            <View style={styles.podiumContainer}>
              {top3[1] && <PodiumItem user={top3[1]} position={2} />}

              {top3[0] && <PodiumItem user={top3[0]} position={1} />}

              {top3[2] && <PodiumItem user={top3[2]} position={3} />}
            </View>

            <View style={{ height: 20 }} />
          </>
        }
        data={rest}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.rowCard}>
            <ThemedText style={styles.position}>{item.position}</ThemedText>

            <Image source={{ uri: item.character }} style={styles.rowAvatar} />

            <View style={{ flex: 1 }}>
              <ThemedText style={styles.rowUsername}>
                {item.username}
              </ThemedText>
              <ThemedText style={styles.rowPts}>
                <Octicons name="star-fill" size={16} color={TOKENS.accent} />{" "}
                {item.experience.toLocaleString()} pts
              </ThemedText>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    textAlign: "left",
    marginBottom: 4,
    fontSize: 24,
  },
  description: {
    marginBottom: 20,
    fontSize: 16,
  },

  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
    marginHorizontal: 20,
  },

  // fila de la lista
  rowCard: {
    backgroundColor: TOKENS.cardBackground,
    padding: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  position: {
    width: 28,
    height: 28,
    color: TOKENS.muted,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 10,
  },
  rowAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: TOKENS.muted,
    marginRight: 14,
  },
  rowUsername: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rowPts: {
    color: TOKENS.text,
    marginTop: 2,
    fontSize: 13,
  },
});
