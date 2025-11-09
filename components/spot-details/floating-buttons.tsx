/**
 * COMPONENTE: FloatingButtons
 *
 * Este componente muestra dos botones flotantes en la esquina superior derecha:
 * 1. Botón de compartir
 * 2. Botón de cerrar
 *
 * Los botones "flotan" sobre el contenido porque tienen position: absolute
 */

import { TOKENS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FloatingButtonsProps } from "./types";

export const FloatingButtons = ({ onShare, onClose }: FloatingButtonsProps) => {
  return (
    <View style={styles.container}>
      {/* Botón de compartir */}
      <TouchableOpacity
        style={styles.button}
        onPress={onShare}
        activeOpacity={0.7} // Reduce la opacidad al presionar
      >
        <Ionicons name="share-social" size={24} color={TOKENS.accent} />
      </TouchableOpacity>

      {/* Botón de cerrar */}
      <TouchableOpacity
        style={styles.button}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={24} color={TOKENS.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute", // Se posiciona de forma absoluta sobre otros elementos
    top: 50,
    right: 16,
    gap: 12, // Espacio entre los dos botones
    flexDirection: "row", // Los botones se alinean horizontalmente
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22, // La mitad del width/height para hacerlo circular
    backgroundColor: TOKENS.background,
    justifyContent: "center",
    alignItems: "center",
    // Sombras para darle profundidad al botón
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Sombra para Android
  },
});
