import AchievementsProfile from "@/components/profile/achievements-profile";
import HeaderProfile from "@/components/profile/header-profile";
import SecretsProfile from "@/components/profile/secrets-profile";
import StatsProfile from "@/components/profile/stats-profile";
import ToursProfile from "@/components/profile/tours-profile";
import { ThemedBackground } from "@/components/themed-background";
import { router, usePathname } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import {
  SecretItemApiResponse,
  TourApiResponse,
  UserAchievementApiResponse,
} from "@/types";

export default function ProfileScreen() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Estado centralizado para todos los datos del perfil
  const [profileData, setProfileData] = useState<{
    secrets: SecretItemApiResponse[];
    tours: TourApiResponse[];
    achievements: UserAchievementApiResponse[];
    loading: boolean;
  }>({
    secrets: [],
    tours: [],
    achievements: [],
    loading: true,
  });

  // Cargar todos los datos en paralelo cuando el componente se monta
  useEffect(() => {
    const loadProfileData = async () => {
      // Si no hay usuario, no cargar nada
      if (!user) {
        setProfileData((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        setProfileData((prev) => ({ ...prev, loading: true }));

        // Hacemos las 3 llamadas API EN PARALELO con Promise.all()
        // Esto significa que las 3 peticiones se ejecutan al mismo tiempo
        // en lugar de esperar que cada una termine antes de iniciar la siguiente
        const [secretsData, toursData, achievementsData] = await Promise.all([
          api.getSecrets(user.access),
          api.getRoutes(user.access),
          api.getAchievements(user.access),
        ]);

        // Una vez que todas las peticiones terminan, actualizamos el estado
        setProfileData({
          secrets: secretsData || [],
          tours: toursData || [],
          achievements: achievementsData || [],
          loading: false,
        });
      } catch (error) {
        console.error("Error loading profile data:", error);
        // En caso de error, marcamos como no loading para mostrar estados vacíos
        setProfileData((prev) => ({ ...prev, loading: false }));
      }
    };

    loadProfileData();
  }, [user]); // Solo se ejecuta cuando cambia el usuario

  // Resetear el stack de navegación cuando el usuario vuelve a esta pantalla
  // Optimizado para solo ejecutarse cuando realmente venimos de una sub-pantalla
  useFocusEffect(
    useCallback(() => {
      // Solo hacer el replace si realmente estamos en una sub-pantalla de profile
      // Ejemplo: /profile/settings o /profile/achievements/1
      if (pathname.startsWith("/profile/") && pathname !== "/profile") {
        router.replace("/(tabs)/profile");
      }
    }, [pathname]),
  );

  return (
    <ThemedBackground style={styles.container} scrollable>
      <HeaderProfile />
      <StatsProfile />
      {/* Pasamos los datos y el estado de loading a cada componente hijo */}
      <SecretsProfile
        data={profileData.secrets}
        loading={profileData.loading}
      />
      <ToursProfile data={profileData.tours} loading={profileData.loading} />
      <AchievementsProfile
        data={profileData.achievements}
        loading={profileData.loading}
      />
      <View style={styles.bottomSpacer}></View>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  bottomSpacer: { height: 120 },
});
