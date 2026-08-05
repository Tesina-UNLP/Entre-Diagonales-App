import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { SecretItemApiResponse } from "@/types";
import Entypo from "@expo/vector-icons/build/Entypo";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Obtener el ancho de la pantalla
const screenWidth = Dimensions.get("window").width;
// Calcular el tamaño de cada tarjeta: (ancho total - gaps - padding) / 3
// Gaps: 2 gaps de 10px entre las 3 columnas = 20px
// Padding lateral: 80px (40px a cada lado)
const cardSize = (screenWidth - 20 - 40) / 3;

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
          pathname: "/(tabs)/profile/secrets/[id]",
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
    // Tamaño calculado dinámicamente para ocupar todo el ancho de la pantalla
    width: cardSize,
    height: cardSize,
    borderRadius: 18,
    overflow: "hidden", // Evita que el contenido se salga de los bordes
  },
  secretItemCardNotObtained: {
    // Mismo tamaño exacto que secretItemCard para consistencia total
    width: cardSize,
    height: cardSize,
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
