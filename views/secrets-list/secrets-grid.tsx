import { SecretItemApiResponse } from "@/types";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
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
    <FlatList
      data={secrets}
      numColumns={3}
      renderItem={({ item }) => <SecretItemCard secret={item} />}
      keyExtractor={(item) => item.id.toString()}
      // espacio entre las columnas
      contentContainerStyle={styles.contentContainer}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
};

const styles = StyleSheet.create({
  secretsList: {
    flex: 3, // the number of columns you want to devide the screen into
    marginHorizontal: "auto",
    width: 400,
  },
  contentContainer: {
    gap: 10,
  },
  columnWrapper: {
    gap: 10,
    // No usamos space-between para que filas incompletas se alineen a la izquierda
  },
});
