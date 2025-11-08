import { Image, StyleSheet, View } from "react-native";
import { ThemedButton } from "./themed-button";

/**
 * PhotoPreview - Componente para mostrar la vista previa de una foto tomada
 *
 * Props:
 * - photoUri: string - La URI de la foto a mostrar
 * - onRetake: función que se ejecuta cuando el usuario quiere tomar otra foto
 * - onConfirm: función que se ejecuta cuando el usuario confirma usar esta foto
 * - isLoading: boolean (opcional) - Si está procesando la foto
 */
interface PhotoPreviewProps {
  photoUri: string;
  onRetake: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function PhotoPreview({
  photoUri,
  onRetake,
  onConfirm,
  isLoading = false,
}: PhotoPreviewProps) {
  return (
    <View style={styles.previewContainer}>
      {/* Imagen de la foto tomada */}
      <Image source={{ uri: photoUri }} style={styles.preview} />

      {/* Botones de acción */}
      <View style={styles.previewButtons}>
        <ThemedButton
          variant="outline"
          size="small"
          style={styles.previewButton}
          onPress={onRetake}
          disabled={isLoading} // Deshabilitamos mientras se procesa
        >
          Tomar otra foto
        </ThemedButton>

        <ThemedButton
          variant="secondary"
          size="small"
          style={styles.previewButton}
          onPress={onConfirm}
          disabled={isLoading} // Deshabilitamos mientras se procesa
        >
          Usar esta foto
        </ThemedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  preview: {
    flex: 1,
    resizeMode: "contain",
  },
  previewButtons: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  previewButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
