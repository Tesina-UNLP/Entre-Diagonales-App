import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TourTarget } from "@wrack/react-native-tour-guide";

/**
 * CaptureButton - Botón circular para capturar fotos (estilo clásico de cámara)
 *
 * Props:
 * - onPress: función que se ejecuta al presionar el botón
 * - disabled: boolean (opcional) - Si el botón está deshabilitado
 */
interface CaptureButtonProps {
  onPress: () => void;
  disabled?: boolean;
  tutorialTargetId?: string;
}

export function CaptureButton({
  onPress,
  disabled = false,
  tutorialTargetId,
}: CaptureButtonProps) {
  const button = (
    <TouchableOpacity
      style={[
        styles.captureButton,
        disabled && styles.captureButtonDisabled, // Reduce la opacidad cuando está deshabilitado
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {/* Círculo interno blanco del botón */}
      <View style={styles.captureButtonInner} />
    </TouchableOpacity>
  );
  return tutorialTargetId ? (
    <TourTarget id={tutorialTargetId} style={styles.container}>
      {button}
    </TourTarget>
  ) : (
    <View style={styles.container}>{button}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 20,
    position: "absolute",
    bottom: 130,
    left: 0,
    right: 0,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
});
