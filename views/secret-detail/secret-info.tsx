import { SecretParallaxObject } from "@/components/secret-parallax-object";
import { ThemedText } from "@/components/themed-text";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * Componente que muestra la información del secreto
 * Incluye la imagen, título y descripción del secreto descubierto
 *
 * @param name - Nombre del secreto
 * @param description - Descripción del secreto
 * @param imageUrl - URL de la imagen del secreto
 */
interface SecretInfoProps {
  name: string;
  description: string;
  imageUrl: string;
  kind?: "secret" | "achievement";
}

export const SecretInfo = ({
  name,
  description,
  imageUrl,
  kind = "secret",
}: SecretInfoProps) => {
  return (
    <View style={styles.imageContainer}>
      <SecretParallaxObject imageUrl={imageUrl} name={name} kind={kind} />

      {/* Título del secreto */}
      <ThemedText type="title" style={styles.centeredText}>
        {name}
      </ThemedText>

      {/* Descripción del secreto */}
      <ThemedText type="default" style={styles.centeredText}>
        {description}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredText: {
    textAlign: "center", // Centra el texto dentro del componente
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // Comienza desde arriba, sin espacio extra
    gap: 12,
  },
});
