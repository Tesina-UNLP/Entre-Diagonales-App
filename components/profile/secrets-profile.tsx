import { SecretsProfileSkeleton } from "@/components/skeletons/secrets-profile-skeleton";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { SecretItemApiResponse } from "@/types";
import { Link, router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ThemedText } from "../themed-text";

const SecretsProfile = () => {
  const { user } = useAuth();
  const [secrets, setSecrets] = useState<SecretItemApiResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener los secretos del usuario desde la API
  const handleGetSecrets = useCallback(async () => {
    if (user) {
      try {
        setLoading(true);
        const response = await api.getSecrets(user.access);

        if (response) {
          setSecrets(response);
        }
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    handleGetSecrets();
  }, [handleGetSecrets]);

  if (loading) {
    return <SecretsProfileSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Secretos descubriertos</ThemedText>
        <Link asChild href={{ pathname: "/(tabs)/profile/secrets" }}>
          <ThemedText type="muted">Ver todos</ThemedText>
        </Link>
      </View>
      {secrets.filter((secret) => secret.obtained).length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText type="muted">
            No tienes ningún secreto descubierto
          </ThemedText>
        </View>
      ) : (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={secrets.filter((secret) => secret.obtained)}
          // gap between item
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                router.navigate(
                  `/(tabs)/profile/secrets/${item.id}?id=${item.id}&name=${item.name}&description=${item.description}&image_url=${item.image_url}`,
                )
              }
            >
              <Image
                source={{ uri: item.image_url || "" }}
                style={styles.secretImage}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
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
    gap: 20,
  },
});

export default SecretsProfile;
