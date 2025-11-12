import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { UserAchievementApiResponse } from "@/types";
import { Link, router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ThemedText } from "../themed-text";

const AchievementsProfile = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<
    UserAchievementApiResponse[]
  >([]);

  // Obtener los logros del usuario desde la API
  const handleGetAchievements = useCallback(async () => {
    if (user) {
      const response = await api.getAchievements(user.access);

      if (response) {
        setAchievements(response);
      }
    }
  }, [user]);

  useEffect(() => {
    handleGetAchievements();
  }, [handleGetAchievements]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Logros</ThemedText>
        <Link asChild href={{ pathname: "/(tabs)/profile/achievements" }}>
          <ThemedText type="muted">Ver todos</ThemedText>
        </Link>
      </View>
      <FlatList
        data={achievements.filter((achievement) => achievement.is_completed)}
        horizontal
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.navigate(`/(tabs)/profile/achievements`)}
          >
            <Image
              source={{ uri: item.achievement.image_url || "" }}
              style={styles.secretImage}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
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
});

export default AchievementsProfile;
