import AchievementsProfile from "@/components/profile/achievements-profile";
import HeaderProfile from "@/components/profile/header-profile";
import SecretsProfile from "@/components/profile/secrets-profile";
import StatsProfile from "@/components/profile/stats-profile";
import ToursProfile from "@/components/profile/tours-profile";
import { ThemedBackground } from "@/components/themed-background";
import { router, usePathname } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  const pathname = usePathname();

  // Resetear el stack de navegación cuando el usuario vuelve a esta pantalla
  // Esto evita que se muestren pantallas anteriores del stack (como complete.tsx)
  // cuando el usuario cambia de tab y luego vuelve al tab de perfil
  useFocusEffect(
    useCallback(() => {
      // Si la ruta actual no es la pantalla principal del perfil, navegar a ella
      // Esto resetea el stack y muestra la pantalla principal
      if (pathname !== "/profile") {
        router.replace("/(tabs)/profile");
      }
    }, [pathname])
  );

  return (
    <ThemedBackground style={styles.container} scrollable>
      <HeaderProfile />
      <StatsProfile />
      <SecretsProfile />
      <ToursProfile />
      <AchievementsProfile />
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
