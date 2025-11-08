import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { TOKENS } from "@/constants/colors";

/**
 * FlashButton - Botón para controlar el flash/linterna de la cámara
 *
 * Props:
 * - enabled: boolean - Si el flash está activado o no
 * - onPress: función que se ejecuta al presionar el botón
 */
interface FlashButtonProps {
  enabled: boolean;
  onPress: () => void;
}

export function FlashButton({ enabled, onPress }: FlashButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.flashButton,
        enabled && styles.flashButtonActive, // Cambia el color cuando está activo
      ]}
      onPress={onPress}
    >
      <MaterialCommunityIcons name="flash" size={20} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  flashButton: {
    backgroundColor: "rgba(15, 38, 36, 0.4)",
    padding: 12,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  flashButtonActive: {
    backgroundColor: TOKENS.accent,
  },
});
