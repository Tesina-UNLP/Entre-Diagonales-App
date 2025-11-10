import { SecretItemApiResponse } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SecretItemCard } from "./secret-item-card";

/**
 * Grid/Grilla de secretos
 * Muestra todos los secretos en un layout de 3 columnas
 *
 * @param secrets - Array de secretos a mostrar
 */
interface SecretsGridProps {
  secrets: SecretItemApiResponse[];
}

export const SecretsGrid = ({ secrets }: SecretsGridProps) => {
  return (
    <View style={styles.secretsList}>
      {/* Mapeamos cada secreto y renderizamos su tarjeta */}
      {secrets.map((secret) => (
        <SecretItemCard key={secret.id} secret={secret} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  secretsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
