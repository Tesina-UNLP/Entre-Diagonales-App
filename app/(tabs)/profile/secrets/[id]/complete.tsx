import { ThemedBackground } from "@/components/themed-background";
import { useAuth } from "@/hooks/use-auth";
import { useHaptics } from "@/hooks/use-haptics";
import { SecretCompletionActions } from "@/views/secret-detail/secret-completion-actions";
import { SecretCompletionInfo } from "@/views/secret-detail/secret-completion-info";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useConfetti } from "typegpu-confetti/react-native";
import * as z from "zod";

/**
 * Pantalla de celebración al descubrir un secreto
 * Muestra las recompensas obtenidas, la información del secreto
 * y opciones para compartir o continuar explorando
 */
const SecretScreen = () => {
  const { checkAuthState } = useAuth();
  const confettiRef = useConfetti();
  // Schema de validación para los parámetros de la URL
  const ParamsSchema = z.object({
    id: z.string().optional().default(""),
    name: z.string().optional().default(""),
    description: z.string().optional().default(""),
    image_url: z.string().optional().default(""),
    coins: z.coerce.number().optional().default(0),
    xp: z.coerce.number().optional().default(0),
  });

  // Obtener y validar los parámetros de la URL
  const parsed = ParamsSchema.safeParse(useLocalSearchParams());
  const params = parsed.success
    ? parsed.data
    : {
        id: "",
        name: "",
        description: "",
        image_url: "",
        coins: 0,
        xp: 0,
      };

  const { playSound } = useHaptics();
  const hasNavigatedAway = useRef(false);

  // Reproducir sonido y verificar autenticación solo una vez al montar el componente
  useEffect(() => {
    const checkAuth = async () => {
      playSound("secretFound");
      confettiRef?.current?.addParticles(200);
      await checkAuthState?.();
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío = solo se ejecuta una vez al montar

  // Si el usuario navega a otro tab y luego vuelve al tab de perfil,
  // redirigir a la pantalla principal del perfil en lugar de mostrar esta pantalla
  useFocusEffect(
    useCallback(() => {
      // Si el usuario ya navegó a otro tab, redirigir a la pantalla principal del perfil
      if (hasNavigatedAway.current) {
        router.replace("/(tabs)/profile");
      }
    }, []),
  );

  // Función para marcar que el usuario navegó a otro tab
  const handleNavigateAway = useCallback(() => {
    hasNavigatedAway.current = true;
  }, []);

  return (
    <ThemedBackground style={styles.container}>
      <View style={styles.content}>
        {/* Información del secreto descubierto con recompensas */}
        <SecretCompletionInfo
          name={params.name}
          description={params.description}
          imageUrl={params.image_url}
          xp={params.xp}
          coins={params.coins}
        />

        {/* Botones de acción: ir a colecciones, compartir, continuar */}
        <SecretCompletionActions
          secretName={params.name}
          secretDescription={params.description}
          onNavigateAway={handleNavigateAway}
        />
      </View>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center", // Centra los elementos horizontalmente
    justifyContent: "space-between",
  },
});

export default SecretScreen;
