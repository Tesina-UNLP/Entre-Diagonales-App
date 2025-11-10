import { ThemedBackground } from "@/components/themed-background";
import { SecretCompletionActions } from "@/views/secret-detail/secret-completion-actions";
import { SecretCompletionInfo } from "@/views/secret-detail/secret-completion-info";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import * as z from "zod";

/**
 * Pantalla de celebración al descubrir un secreto
 * Muestra las recompensas obtenidas, la información del secreto
 * y opciones para compartir o continuar explorando
 */
const SecretScreen = () => {
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
    paddingBottom: 20,
    alignItems: "center", // Centra los elementos horizontalmente
    justifyContent: "space-between",
  },
});

export default SecretScreen;
