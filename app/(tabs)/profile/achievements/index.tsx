import AchievementCard from "@/components/achievements/achievement-card";
import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { ACHIEVEMENT_TAGS } from "@/constants/lists";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { UserAchievementApiResponse } from "@/types";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function AchievementsScreen() {
  const [achievements, setAchievements] = useState<
    UserAchievementApiResponse[]
  >([]);
  const [allAchievements, setAllAchievements] = useState<
    UserAchievementApiResponse[]
  >([]);
  const [selectedTag, setSelectedTag] = useState<string | null>("todos");
  const [refreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const { user } = useAuth();

  const handleGetAchievements = useCallback(async () => {
    try {
      // Activar el estado de carga al inicio
      setIsLoading(true);
      const response = await api.getAchievements(user?.access || "");
      setAllAchievements(response);
      setAchievements(response);
    } catch {
      Toast.show({
        type: "error",
        text1: "Error al obtener los logros",
        text2: "Por favor, intente nuevamente más tarde.",
      });
    } finally {
      // Desactivar el estado de carga al finalizar (exitoso o con error)
      setIsLoading(false);
    }
  }, [user?.access]);

  useEffect(() => {
    handleGetAchievements();
  }, [handleGetAchievements]);

  const applyFilters = useCallback(
    (tag: string | null) => {
      let result = allAchievements;

      if (tag === "not-completed") {
        result = result.filter((achievement) => !achievement.completed_at);
      } else {
        if (tag && tag !== "todos") {
          result = result.filter(
            (achievement) =>
              achievement.achievement.goal_type === tag.toLowerCase(),
          );
        }
      }

      setAchievements(result);
    },
    [allAchievements],
  );

  useEffect(() => {
    applyFilters(selectedTag);
  }, [applyFilters, selectedTag]);

  const handleFilterByTag = (tag: string) => {
    setSelectedTag(tag);
    applyFilters(tag);
  };

  // Si está cargando, mostrar el loader
  if (isLoading) {
    return (
      <ThemedBackground style={styles.container}>
        <LoadingComponent />
      </ThemedBackground>
    );
  }

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <Header
        title={"Logros"}
        description={"Insignias obtenidas explorando"}
        onBack={() => router.back()}
      />
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgeContainer}
        >
          {ACHIEVEMENT_TAGS.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.badge,
                selectedTag === tag.id && styles.badgeActive,
              ]}
              onPress={() => handleFilterByTag(tag.id)}
            >
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.badgeText,
                  selectedTag === tag.id && styles.badgeTextActive,
                ]}
              >
                {tag.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={achievements}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => handleGetAchievements()}
            tintColor={TOKENS.primary}
            progressBackgroundColor={TOKENS.primary}
            colors={[TOKENS.navActive]}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        ListFooterComponent={() => <View style={styles.bottomSpacer}></View>}
        style={styles.listContainer}
        renderItem={({ item }) => (
          <AchievementCard user={user!} achievement={item} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </ThemedBackground>
  );
}
// Componente que se muestra mientras se cargan los datos
const LoadingComponent = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={TOKENS.primary} />
  </View>
);

const styles = StyleSheet.create({
  emptyImage: {
    width: 200,
    height: 200,
  },
  emptyContainer: {
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    marginTop: 12,
    color: TOKENS.text,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomSpacer: { height: 120 },
  container: {
    flex: 1,
    paddingTop: 0,
    marginTop: 0,
    paddingInline: 0,
    paddingHorizontal: 0,
  },
  header: {
    marginBottom: 24,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 14,
    marginBottom: 12,
    color: TOKENS.text,
  },
  badgeContainer: {
    paddingRight: 20,
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: TOKENS.primary,
  },
  badgeActive: {
    backgroundColor: TOKENS.badgeActive,
    borderColor: TOKENS.badgeActive,
  },
  badgeText: {
    color: TOKENS.text,
    fontSize: 14,
  },
  badgeTextActive: {
    color: TOKENS.background,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemSeparator: {
    height: 16,
  },
});
