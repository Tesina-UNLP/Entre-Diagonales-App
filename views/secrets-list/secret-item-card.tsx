import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { SecretItemApiResponse } from "@/types";
import Entypo from "@expo/vector-icons/build/Entypo";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * Tarjeta individual de secreto
 * Muestra un secreto obtenido con su imagen, o un placeholder si no está obtenido
 *
 * @param secret - Datos del secreto a mostrar
 */
interface SecretItemCardProps {
  secret: SecretItemApiResponse;
}

export const SecretItemCard = ({ secret }: SecretItemCardProps) => {
  // Si el secreto no ha sido obtenido, mostramos un placeholder
  if (!secret.obtained) {
    return (
      <View style={styles.secretItemCardNotObtained}>
        <Entypo name="help" size={24} color={TOKENS.muted} />
        <ThemedText type="muted">Sin descubrir</ThemedText>
      </View>
    );
  }

  // Si el secreto fue obtenido, mostramos su imagen y permitimos navegación
  return (
    <TouchableOpacity
      style={styles.secretItemCard}
      onPress={() =>
        router.navigate({
          pathname: "/(stack)/secrets/[id]",
          params: {
            id: secret.id.toString(),
            name: secret.name,
            description: secret.description,
            image_url: secret.image_url || "",
          },
        })
      }
    >
      <Image
        source={{ uri: secret.image_url || "" }}
        style={styles.secretItemCardImage}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  secretItemCard: {
    // Calculamos el ancho: (100% - 2 gaps de 10px) / 3 columnas
    // Usamos width en lugar de flex para mantener el tamaño consistente
    width: "30%",
    aspectRatio: 1, // Mantiene la tarjeta cuadrada (ancho = alto)
    borderRadius: 18,
    overflow: "hidden", // Evita que el contenido se salga de los bordes
    padding: 10,
  },
  secretItemCardNotObtained: {
    // Mismo tamaño que secretItemCard para consistencia
    width: "30%",
    aspectRatio: 1, // Mantiene la tarjeta cuadrada (ancho = alto)
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 18,
    overflow: "hidden", // Evita que el contenido se salga de los bordes
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  secretItemCardImage: {
    width: "100%", // Ocupa todo el ancho del contenedor
    height: "100%", // Ocupa todo el alto del contenedor
    resizeMode: "cover", // La imagen cubre todo el espacio sin distorsionarse
  },
});
