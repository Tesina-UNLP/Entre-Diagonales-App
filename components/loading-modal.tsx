import { TOKENS } from "@/constants/colors";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

const LoadingModal = ({
  isLoading,
  text = "Procesando...",
}: {
  isLoading: boolean;
  text: string;
}) => {
  if (!isLoading) return null;

  return (
    <Modal transparent={true} visible={isLoading} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color={TOKENS.accent} />
          <ThemedText style={styles.modalText}>{text}</ThemedText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Estilos para el modal de cargando
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: TOKENS.background,
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    gap: 15,
    minWidth: 200,
    // Sombra para darle profundidad al modal
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default LoadingModal;
