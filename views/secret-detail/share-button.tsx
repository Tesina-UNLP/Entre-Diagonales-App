import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Alert, Platform, Share, StyleSheet } from "react-native";

/**
 * Botón para compartir el secreto descubierto
 * Utiliza la API nativa de Share de React Native
 *
 * @param secretName - Nombre del secreto a compartir
 * @param secretDescription - Descripción del secreto
 */
interface ShareButtonProps {
  secretName: string;
  secretDescription: string;
}

export const ShareButton = ({
  secretName,
  secretDescription,
}: ShareButtonProps) => {
  /**
   * Función que maneja el compartir del secreto
   * Usa la API nativa de Share para compartir en diferentes plataformas
   */
  const handleShare = async () => {
    try {
      // Preparar el mensaje para compartir
      const message = `¡Descubrí un secreto! 🎉\n\n${secretName}\n\n${secretDescription}\n\n#EntreDigonales #SecretsApp`;

      // Llamar a la API de Share nativa
      const result = await Share.share(
        {
          message: message,
          // En iOS, puedes agregar un título separado
          ...(Platform.OS === "ios" && {
            title: `Secreto: ${secretName}`,
          }),
        },
        {
          // En Android, puedes especificar el título del diálogo
          ...(Platform.OS === "android" && {
            dialogTitle: `Compartir secreto: ${secretName}`,
          }),
        },
      );

      // Verificar si se compartió exitosamente (solo en iOS se puede detectar)
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Se compartió con una actividad específica (iOS)
        } else {
          // Se compartió
        }
      } else if (result.action === Share.dismissedAction) {
        // El usuario canceló el compartir (iOS)
      }
    } catch (error) {
      // Manejar errores al compartir
      console.error("Error al compartir:", error);
      Alert.alert(
        "Error al compartir",
        "No se pudo compartir el secreto. Por favor, intenta nuevamente.",
      );
    }
  };

  return (
    <ThemedButton
      variant="outline"
      onPress={handleShare}
      size="small"
      style={styles.shareButton}
    >
      <FontAwesome name="share" size={16} color={TOKENS.text} />
      <ThemedText
        type="defaultSemiBold"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ flexShrink: 1 }}
      >
        Compartir
      </ThemedText>
    </ThemedButton>
  );
};

const styles = StyleSheet.create({
  shareButton: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});
