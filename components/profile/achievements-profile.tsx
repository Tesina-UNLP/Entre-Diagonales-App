import { AchievementsProfileSkeleton } from "@/components/skeletons/achievements-profile-skeleton";
import { UserAchievementApiResponse } from "@/types";
import { Link, router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ThemedText } from "../themed-text";

// Ahora este componente recibe los datos por props desde el componente padre
// Esto evita hacer llamadas API redundantes y mejora el rendimiento
interface AchievementsProfileProps {
  data: UserAchievementApiResponse[];
  loading: boolean;
}

const AchievementsProfile = ({ data, loading }: AchievementsProfileProps) => {
  // Si aún está cargando, mostramos el skeleton
  if (loading) {
    return <AchievementsProfileSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Logros</ThemedText>
        <Link asChild href={{ pathname: "/(tabs)/profile/achievements" }}>
          <ThemedText type="muted">Ver todos</ThemedText>
        </Link>
      </View>
      {/* Usamos 'data' en lugar de 'achievements' ya que ahora lo recibimos por props */}
      {data.filter((achievement) => achievement.is_completed).length > 0 ? (
        <FlatList
          data={data.filter((achievement) => achievement.is_completed)}
          horizontal
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
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

const styles = StyleSheet.create({
  container: {
    // Removido flex: 1 para permitir que el gap funcione correctamente
    gap: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secretImage: {
    width: 90,
    height: 90,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AchievementsProfile;
