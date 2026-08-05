import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, Platform, Share, StyleSheet, View } from "react-native";

/**
 * Componente que muestra las acciones disponibles después de descubrir un secreto
 * Incluye botones para: ir a colecciones, compartir, y continuar con el recorrido
 *
 * @param secretName - Nombre del secreto para compartir
 * @param secretDescription - Descripción del secreto para compartir
 * @param onNavigateAway - Callback que se ejecuta cuando el usuario navega a otro tab
 */
interface SecretCompletionActionsProps {
  secretName: string;
  secretDescription: string;
  onNavigateAway?: () => void;
}

export const SecretCompletionActions = ({
  secretName,
  secretDescription,
  onNavigateAway,
}: SecretCompletionActionsProps) => {
  /**
   * Función que maneja el compartir del secreto descubierto
   * Usa la API nativa de Share para compartir en diferentes plataformas
   */
  const handleShare = async () => {
    try {
      // Preparar el mensaje personalizado para cuando se descubre un secreto
      const message = `¡Acabo de descubrir un secreto! 🎉✨\n\n${secretName}\n\n${secretDescription}\n\n¿Podrás encontrarlo tú también? 🔍\n\n#EntreDigonales #SecretsDiscovered`;

      // Llamar a la API de Share nativa
      const result = await Share.share(
        {
          message: message,
          // En iOS, puedes agregar un título separado
          ...(Platform.OS === "ios" && {
            title: `¡Descubrí: ${secretName}!`,
          }),
        },
        {
          // En Android, puedes especificar el título del diálogo
          ...(Platform.OS === "android" && {
            dialogTitle: `Compartir descubrimiento: ${secretName}`,
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
        "No se pudo compartir tu descubrimiento. Por favor, intenta nuevamente.",
      );
    }
  };

  /**
   * Navega a la pantalla de colecciones de secretos
   */
  const handleGoToCollections = () => {
    router.navigate("/(tabs)/profile/secrets");
  };

  /**
   * Navega de vuelta a la lista de tours
   * Usa replace() para reemplazar la pantalla actual y evitar que quede en el stack
   * Marca que el usuario navegó a otro tab para que cuando vuelva al tab de perfil,
   * se muestre la pantalla principal en lugar de esta pantalla
   */
  const handleContinueTour = () => {
    // Marcar que el usuario navegó a otro tab
    onNavigateAway?.();
    router.replace("/(tabs)/tours");
  };

  return (
    <View style={styles.actionsContainer}>
      {/* Botón principal: Ir a colecciones */}
      <ThemedButton
        variant="primary"
        onPress={handleGoToCollections}
        size="small"
        style={styles.actionButton}
      >
        <FontAwesome name="book" size={16} color={TOKENS.text} />
        <ThemedText
          type="defaultSemiBold"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ flexShrink: 1 }}
        >
          Ir a colecciones
        </ThemedText>
      </ThemedButton>

      {/* Botón secundario: Compartir descubrimiento */}
      <ThemedButton
        variant="outline"
        onPress={handleShare}
        size="small"
        style={styles.actionButton}
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

      {/* Botón terciario: Continuar con el recorrido */}
      <ThemedButton variant="ghost" onPress={handleContinueTour} size="small">
        <ThemedText
          type="defaultSemiBold"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.ghostButtonText, { flexShrink: 1 }]}
        >
          Continuar con el recorrido
        </ThemedText>
      </ThemedButton>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    width: "100%",
    gap: 0,
  },
  actionButton: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  ghostButtonText: {
    color: TOKENS.muted,
  },
});
