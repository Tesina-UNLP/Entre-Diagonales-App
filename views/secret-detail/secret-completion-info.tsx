import { ThemedText } from "@/components/themed-text";
import { TourRewards } from "@/components/tour-completion";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

/**
 * Componente que muestra la información de celebración cuando se descubre un secreto
 * Incluye el título de felicitación, recompensas, imagen, nombre y descripción
 *
 * @param name - Nombre del secreto descubierto
 * @param description - Descripción del secreto
 * @param imageUrl - URL de la imagen del secreto
 * @param xp - Cantidad de experiencia (XP) ganada
 * @param coins - Cantidad de monedas ganadas
 */
interface SecretCompletionInfoProps {
  name: string;
  description: string;
  imageUrl: string;
  xp: number;
  coins: number;
}

export const SecretCompletionInfo = ({
  name,
  description,
  imageUrl,
  xp,
  coins,
}: SecretCompletionInfoProps) => {
  return (
    <View style={styles.imageContainer}>
      {/* Título de celebración */}
      <ThemedText type="title" style={styles.centeredText}>
        Haz descubierto un nuevo objeto secreto!
      </ThemedText>

      {/* Recompensas obtenidas (XP y monedas) */}
      <TourRewards xp={xp} coins={coins} />

      {/* Imagen del secreto descubierto */}
      <Image source={{ uri: imageUrl }} style={styles.image} />

      {/* Nombre del secreto */}
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
