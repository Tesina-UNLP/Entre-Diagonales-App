import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { SecretItemApiResponse } from "@/types";
import { ProgressSection } from "@/views/secrets-list/progress-section";
import { SecretItemCard } from "@/views/secrets-list/secret-item-card";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
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
          {/* Usamos FlatList en lugar de ScrollView para evitar problemas con listas anidadas */}
          <FlatList
            data={secrets}
            numColumns={3}
            renderItem={({ item }) => <SecretItemCard secret={item} />}
            keyExtractor={(item) => item.id.toString()}
            // Header con la sección de progreso
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                <ProgressSection
                  obtained={secretsProgress.obtained}
                  total={secretsProgress.total}
                />
              </View>
            }
            // Estilos para el contenido y columnas
            contentContainerStyle={styles.content}
            columnWrapperStyle={styles.columnWrapper}
            // Pull to refresh
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => handleGetSecrets()}
                tintColor={TOKENS.primary}
                progressBackgroundColor={TOKENS.primary}
                colors={[TOKENS.navActive]}
              />
            }
          />
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 10,
  },
  headerContainer: {
    marginBottom: 20,
  },
  columnWrapper: {
    gap: 10,
    // No usamos space-between para que filas incompletas se alineen a la izquierda
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SecretsScreen;
