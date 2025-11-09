/**
 * COMPONENTE: FunFactsCard
 *
 * Este componente muestra una tarjeta destacada con datos curiosos
 * o información interesante sobre el lugar. Tiene un diseño especial
 * con un ícono de bombilla y colores llamativos.
 */

import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { FunFactsCardProps } from "./types";

export const FunFactsCard = ({ funFacts }: FunFactsCardProps) => {
  return (
    <View style={styles.container}>
      {/* Encabezado con ícono y título */}
      <View style={styles.header}>
        {/* Ícono de bombilla para indicar "idea" o "dato curioso" */}
        <Ionicons name="bulb" size={20} color="#FF6B35" />
        <ThemedText style={styles.title}>¿Sabías que?</ThemedText>
      </View>

      {/* Texto con los datos curiosos */}
      <ThemedText style={styles.text}>{funFacts}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: "#974215", // Fondo marrón oscuro
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4, // Borde izquierdo más grueso para efecto visual
    borderLeftColor: "#F7A340", // Color naranja/dorado
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F7A340", // Color naranja/dorado que contrasta con el fondo
  },
  text: {
    fontSize: 14,
    lineHeight: 20, // Espaciado entre líneas para mejor legibilidad
    color: "#F7A340",
  },
});
