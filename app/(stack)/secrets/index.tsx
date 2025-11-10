import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { SecretItemApiResponse } from "@/types";
import { FilterSection } from "@/views/secrets-list/filter-section";
import { ProgressSection } from "@/views/secrets-list/progress-section";
import { SecretsGrid } from "@/views/secrets-list/secrets-grid";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

/**
 * Pantalla principal de Secretos
 * Muestra una lista de secretos que el usuario puede descubrir y coleccionar
 */
const SecretsScreen = () => {
  // Hooks y estado
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [secrets, setSecrets] = useState<SecretItemApiResponse[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("todos");

  // Manejador para cambiar el filtro seleccionado
  const handleFilterByTag = (tag: string) => {
    setSelectedTag(tag);
  };

  // Calcular el progreso de secretos obtenidos
  // Contamos cuántos secretos tienen la propiedad obtained en true
  const secretsProgress = useMemo(() => {
    const obtained = secrets.filter((secret) => secret.obtained).length;
    const total = secrets.length;
    return { obtained, total };
  }, [secrets]);

  // Obtener los secretos del usuario desde la API
  const handleGetSecrets = useCallback(async () => {
    setLoading(true);
    if (user) {
      const response = await api.getSecrets(user.access);

      if (response) {
        setSecrets(response);
      }
    }
    setLoading(false);
  }, [user]);

  // Cargar secretos al montar el componente
  useEffect(() => {
    handleGetSecrets();
  }, [handleGetSecrets]);

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={TOKENS.primary} />
        </View>
      ) : (
        <>
          <Header
            title={"Secretos"}
            description={"Descubre los secretos de la ciudad"}
            onBack={() => router.navigate("/(tabs)")}
          />
          <ScrollView
            style={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => handleGetSecrets()}
                tintColor={TOKENS.primary}
                progressBackgroundColor={TOKENS.primary}
                colors={[TOKENS.navActive]}
              />
            }
          >
            <View style={styles.content}>
              {/* Sección de filtros */}
              <FilterSection
                selectedTag={selectedTag}
                onSelectTag={handleFilterByTag}
              />

              {/* Sección de progreso */}
              <ProgressSection
                obtained={secretsProgress.obtained}
                total={secretsProgress.total}
              />

              {/* Grilla de secretos */}
              <SecretsGrid secrets={secrets} />
            </View>
          </ScrollView>
        </>
      )}
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    marginTop: 0,
    paddingInline: 0,
    paddingHorizontal: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SecretsScreen;
