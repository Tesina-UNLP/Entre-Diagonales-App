import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { SecretInfo } from "@/views/secret-detail/secret-info";
import { ShareButton } from "@/views/secret-detail/share-button";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import * as z from "zod";

/**
 * Pantalla de detalle de secreto
 * Muestra la información completa de un secreto descubierto
 * y permite compartirlo
 */
const SecretScreen = () => {
  // Schema de validación para los parámetros de la URL
  const ParamsSchema = z.object({
    id: z.string().optional().default(""),
    name: z.string().optional().default(""),
    description: z.string().optional().default(""),
    image_url: z.string().optional().default(""),
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
      };

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <>
        <Header
          title={params.name}
          description={"Explora el mundo y descubre secretos"}
          onBack={() => router.back()}
        />

        <View style={styles.content}>
          {/* Información del secreto (imagen, título, descripción) */}
          <SecretInfo
            name={params.name}
            description={params.description}
            imageUrl={params.image_url}
          />

          {/* Botón para compartir el secreto */}
          <ShareButton
            secretName={params.name}
            secretDescription={params.description}
          />
        </View>
      </>
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
    paddingBottom: 20,
    alignItems: "center", // Centra los elementos horizontalmente
    justifyContent: "space-between",
  },
});

export default SecretScreen;
