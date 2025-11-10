import { ThemedText } from "@/components/themed-text";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

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
}

export const SecretInfo = ({
  name,
  description,
  imageUrl,
}: SecretInfoProps) => {
  return (
    <View style={styles.imageContainer}>
      {/* Imagen del secreto */}
      <Image source={{ uri: imageUrl }} style={styles.image} />

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
  image: {
    aspectRatio: 1, // Mantiene la imagen cuadrada
    width: "100%",
  },
  centeredText: {
    textAlign: "center", // Centra el texto dentro del componente
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // Comienza desde arriba, sin espacio extra
    gap: 10,
  },
});
