import { StyleSheet, View } from "react-native";
import { ThemedBackground } from "./themed-background";
import { ThemedButton } from "./themed-button";
import { ThemedText } from "./themed-text";

/**
 * CameraPermissionView - Vista que se muestra cuando no se tienen permisos de cámara
 *
 * Props:
 * - onRequestPermission: función que se ejecuta cuando el usuario presiona "Conceder permiso"
 */
interface CameraPermissionViewProps {
  onRequestPermission: () => void;
}

export function CameraPermissionView({
  onRequestPermission,
}: CameraPermissionViewProps) {
  return (
    <ThemedBackground style={styles.container}>
      <View style={styles.permissionContainer}>
        <ThemedText style={styles.message}>
          Necesitamos tu permiso para usar la cámara
        </ThemedText>
        <ThemedButton variant="primary" onPress={onRequestPermission}>
          Conceder permiso
        </ThemedButton>
      </View>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
});
