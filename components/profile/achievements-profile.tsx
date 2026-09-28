import { AchievementsProfileSkeleton } from "@/components/skeletons/achievements-profile-skeleton";
import { UserAchievementApiResponse } from "@/types";
import { TOKENS } from "@/constants/colors";
import { Link, router } from "expo-router";
import React, { useMemo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { ThemedText } from "../themed-text";

// Ahora este componente recibe los datos por props desde el componente padre
// Esto evita hacer llamadas API redundantes y mejora el rendimiento
interface AchievementsProfileProps {
  data: UserAchievementApiResponse[];
  loading: boolean;
}

const AchievementsProfile = ({ data, loading }: AchievementsProfileProps) => {
  const { t } = useTranslation();
  const completedAchievements = useMemo(
    () => data.filter((achievement) => achievement.is_completed),
    [data],
  );

  // Si aún está cargando, mostramos el skeleton
  if (loading) {
    return <AchievementsProfileSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText type="subtitle">Logros</ThemedText>
          <ThemedText type="muted" translateContent={false}>
            {t("profile.earnedAchievementsCount", {
              count: completedAchievements.length,
            })}
          </ThemedText>
        </View>
        <Link asChild href={{ pathname: "/(tabs)/profile/achievements" }}>
          <ThemedText type="muted">Ver todos</ThemedText>
        </Link>
      </View>
      {/* Usamos 'data' en lugar de 'achievements' ya que ahora lo recibimos por props */}
      {completedAchievements.length > 0 ? (
        <FlatList
          data={completedAchievements}
          horizontal
          ItemSeparatorComponent={ListSeparator}
          contentContainerStyle={styles.collectionShelf}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={styles.achievementItem}
              onPress={() =>
                router.navigate({
                  pathname: "/(tabs)/profile/achievements/[id]",
                  params: {
                    id: item.achievement.id.toString(),
                    name: item.achievement.name,
                    description: item.achievement.description,
                    image_url: item.achievement.image_url,
                  },
                })
              }
            >
              <Image
                source={{ uri: item.achievement.image_url || "" }}
                style={styles.secretImage}
              />
              <ThemedText
                type="muted"
                style={styles.itemLabel}
                numberOfLines={1}
              >
                {item.achievement.name}
              </ThemedText>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <ThemedText type="muted">No tienes ningún logro obtenido</ThemedText>
        </View>
      )}
    </View>
  );
};

const ListSeparator = () => <View style={styles.listSeparator} />;

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secretImage: {
    width: 86,
    height: 86,
  },
  collectionShelf: {
    paddingBottom: 12,
  },
  achievementItem: {
    width: 96,
    alignItems: "center",
    gap: 4,
  },
  itemLabel: {
    width: "100%",
    textAlign: "center",
    fontSize: 11,
  },
  listSeparator: { width: 10 },
  emptyContainer: {
    minHeight: 72,
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TOKENS.tabBarInactive + "65",
  },
});

export default AchievementsProfile;
