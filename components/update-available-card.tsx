import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Updates from "expo-updates";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export const UpdateAvailableCard = () => {
  const { isUpdatePending, isUpdateAvailable } = Updates.useUpdates();

  useEffect(() => {
    if (isUpdatePending) {
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View
        style={{ flexDirection: "row", alignItems: "center", flex: 1, gap: 12 }}
      >
        <MaterialIcons name="system-update" size={24} color={TOKENS.accent} />
        <View style={styles.textContainer}>
          <ThemedText type="defaultSemiBold">
            Nueva versión disponible
          </ThemedText>
          <ThemedText type="muted">
            Hay una actualización lista para instalar
          </ThemedText>
        </View>
      </View>
      <ThemedButton
        variant="accent"
        size="small"
        onPress={() => Updates.fetchUpdateAsync()}
        style={styles.button}
      >
        Actualizar
      </ThemedButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 18,
    marginBottom: 20,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: TOKENS.accent,
    alignSelf: "center",
  },
  textContainer: {
    flex: 1,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
