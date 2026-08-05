// app/(tabs)/ranking.tsx
import { FadeInView } from "@/components/animations/fade-in-view";
import PodiumItem from "@/components/podium-item";
import { RankingScreenSkeleton } from "@/components/skeletons/ranking-skeleton";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { UserRankingCard } from "@/components/user-ranking-card";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { useRanking } from "@/hooks/use-ranking";
import { Octicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";

// Tipo para los tabs disponibles
type RankingTab = "global" | "level";

export default function RankingScreen() {
  const { user } = useAuth();
  const token = user?.access || "";
  const level = user?.level || null;

  // Estado para controlar qué tab está activo
  const [activeTab, setActiveTab] = useState<RankingTab>("global");

  // Determinar qué nivel pasar al hook basado en el tab activo
  // Si es "global", pasamos undefined para obtener el ranking global
  // Si es "level", pasamos el nivel del usuario
  const levelFilter = activeTab === "level" ? String(level?.id) : undefined;

  const { top3, rest, userPosition, loading } = useRanking(
    token,
    user?.username,
    levelFilter,
  );

  return (
    <ThemedBackground style={styles.container}>
      {loading ? (
        <RankingScreenSkeleton />
      ) : (
        <FlatList
          ListFooterComponent={<View style={styles.bottomSpacer}></View>}
          ListHeaderComponent={
            <>
              {/* Título y descripción con animación */}
              <FadeInView delay={100}>
                <ThemedText type="title" style={styles.title}>
                  Exploradores top
                </ThemedText>
                <ThemedText type="muted" style={styles.description}>
                  Mira como es la clasificación de tu ciudad
                </ThemedText>
              </FadeInView>

              {/* Tab Switcher - Selector de tipo de ranking */}
              <FadeInView delay={150}>
                <View style={styles.tabContainer}>
                  {/* Tab: Puntaje Global */}
                  <Pressable
                    style={[
                      styles.tab,
                      activeTab === "global" && styles.tabActive,
                    ]}
                    onPress={() => setActiveTab("global")}
                  >
                    <ThemedText
                      type={
                        activeTab === "global" ? "defaultSemiBold" : "muted"
                      }
                      style={[
                        styles.tabText,
                        activeTab === "global" && styles.tabTextActive,
                      ]}
                    >
                      Global
                    </ThemedText>
                  </Pressable>

                  {/* Tab: Puntaje de Rango */}
                  <Pressable
                    style={[
                      styles.tab,
                      activeTab === "level" && styles.tabActive,
                    ]}
                    onPress={() => setActiveTab("level")}
                  >
                    <ThemedText
                      type={activeTab === "level" ? "defaultSemiBold" : "muted"}
                      style={[
                        styles.tabText,
                        activeTab === "level" && styles.tabTextActive,
                      ]}
                    >
                      Nivel actual
                    </ThemedText>
                  </Pressable>
                </View>
              </FadeInView>

              {/* Tarjeta del usuario actual con animación */}
              {userPosition && (
                <FadeInView key={`user-${activeTab}`} delay={200}>
                  <UserRankingCard
                    user={userPosition}
                    userLevel={level?.name}
                  />
                </FadeInView>
              )}

              {/* PODIO con animaciones escalonadas - el ganador aparece primero */}
              <View style={styles.podiumContainer}>
                {/* Segundo lugar (izquierda) aparece tercero */}
                {top3[1] && (
                  <FadeInView key={`podium-2-${activeTab}`} delay={400}>
                    <PodiumItem user={top3[1]} position={2} />
                  </FadeInView>
                )}

                {/* Primer lugar (centro) aparece primero */}
                {top3[0] && (
                  <FadeInView key={`podium-1-${activeTab}`} delay={300}>
                    <PodiumItem user={top3[0]} position={1} />
                  </FadeInView>
                )}

                {/* Tercer lugar (derecha) aparece último */}
                {top3[2] && (
                  <FadeInView key={`podium-3-${activeTab}`} delay={500}>
                    <PodiumItem user={top3[2]} position={3} />
                  </FadeInView>
                )}
              </View>

              <View style={{ height: 20 }} />
            </>
          }
          data={rest}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            // Cada usuario del ranking aparece con un delay incremental
            // Comienza después del podio (600ms) y agrega 40ms por cada uno
            <FadeInView
              delay={600 + Math.min(index * 40, 200)}
              key={`ranking-${activeTab}-${index}`}
            >
              <View style={styles.rowCard}>
                <ThemedText type="subtitle" style={styles.position}>
                  {item.position}
                </ThemedText>

                <Image
                  source={{ uri: item.character }}
                  style={styles.rowAvatar}
                />

                <View style={{ flex: 1, gap: 4 }}>
                  <ThemedText type="subtitle">
                    {item?.display_name?.slice(0, 40) ??
                      item.username?.slice(0, 40)}
                  </ThemedText>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Octicons
                      name="star-fill"
                      size={15}
                      color={TOKENS.accent}
                    />

                    <ThemedText type="muted" style={styles.rowPts}>
                      {item.experience.toLocaleString()} puntos
                    </ThemedText>
                  </View>
                </View>
              </View>
            </FadeInView>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
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

  // Estilos para el Tab Switcher
  tabContainer: {
    flexDirection: "row",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: TOKENS.badgeActive,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: TOKENS.muted,
  },
  tabTextActive: {
    color: TOKENS.background,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
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
    fontSize: 18,
    marginRight: 10,
  },
  rowAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: TOKENS.muted,
    marginRight: 14,
  },
  rowPts: {
    marginTop: 2,
    fontSize: 13,
  },
  bottomSpacer: { height: 60 },
});
