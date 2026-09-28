import { SecretsProfileSkeleton } from "@/components/skeletons/secrets-profile-skeleton";
import { SecretItemApiResponse } from "@/types";
import { TOKENS } from "@/constants/colors";
import { Link, router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { ThemedText } from "../themed-text";

// Ahora este componente recibe los datos por props desde el componente padre
// Esto evita hacer llamadas API redundantes y mejora el rendimiento
interface SecretsProfileProps {
  data: SecretItemApiResponse[];
  loading: boolean;
}

const SecretsProfile = ({ data, loading }: SecretsProfileProps) => {
  const { t } = useTranslation();
  const obtainedSecrets = data.filter((secret) => secret.obtained);

  // Si aún está cargando, mostramos el skeleton
  if (loading) {
    return <SecretsProfileSkeleton />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText type="subtitle">Secretos</ThemedText>
          <ThemedText type="muted" translateContent={false}>
            {t("profile.foundSecretsCount", {
              count: obtainedSecrets.length,
            })}
          </ThemedText>
        </View>
        <Link asChild href={{ pathname: "/(tabs)/profile/secrets" }}>
          <ThemedText type="muted">Ver todos</ThemedText>
        </Link>
      </View>
      {/* Usamos 'data' en lugar de 'secrets' ya que ahora lo recibimos por props */}
      {obtainedSecrets.length > 0 ? (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={obtainedSecrets}
          // gap between item
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          contentContainerStyle={styles.collectionShelf}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={styles.secretItem}
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
              <ThemedText
                type="muted"
                style={styles.itemLabel}
                numberOfLines={1}
              >
                {item.name}
              </ThemedText>
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
  secretItem: {
    width: 96,
    alignItems: "center",
    gap: 4,
  },
  itemLabel: {
    width: "100%",
    textAlign: "center",
    fontSize: 11,
  },
  emptyContainer: {
    minHeight: 72,
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TOKENS.tabBarInactive + "65",
  },
});

export default SecretsProfile;
