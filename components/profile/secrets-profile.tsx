import { SecretsProfileSkeleton } from "@/components/skeletons/secrets-profile-skeleton";
import { SecretItemApiResponse } from "@/types";
import { Link, router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ThemedText } from "../themed-text";

// Ahora este componente recibe los datos por props desde el componente padre
// Esto evita hacer llamadas API redundantes y mejora el rendimiento
interface SecretsProfileProps {
  data: SecretItemApiResponse[];
  loading: boolean;
}

const SecretsProfile = ({ data, loading }: SecretsProfileProps) => {
  // Si aún está cargando, mostramos el skeleton
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
      {/* Usamos 'data' en lugar de 'secrets' ya que ahora lo recibimos por props */}
      {data.filter((secret) => secret.obtained).length > 0 ? (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={data.filter((secret) => secret.obtained)}
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
      ) : (
        <View style={styles.emptyContainer}>
          <ThemedText type="muted">
            No tienes ningún secreto descubierto
          </ThemedText>
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

export default SecretsProfile;
